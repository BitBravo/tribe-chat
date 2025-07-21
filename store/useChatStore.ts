import { API_BASE } from "@/constants/Colors";
import { TMessageJSON, TParticipant } from "@/types/chatTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { create } from "zustand";

interface ChatState {
  messages: TMessageJSON[];
  participants: Record<string, TParticipant>;
  input: string;
  setInput: (text: string) => void;
  initialize: () => Promise<void>;
  fetchLatest: () => Promise<void>;
  sendMessage: () => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  participants: {},
  input: "",

  setInput: (text: string) => set({ input: text }),

  initialize: async () => {
    try {
      const infoRes = await axios.get(`${API_BASE}/info`);
      const sessionId = infoRes.data.sessionUuid;
      const savedSession = await AsyncStorage.getItem("sessionId");

      if (savedSession !== sessionId) {
        await AsyncStorage.clear();
        await AsyncStorage.setItem("sessionId", sessionId);
      }

      const [messagesRes, participantsRes] = await Promise.all([
        axios.get(`${API_BASE}/messages/latest`),
        axios.get(`${API_BASE}/participants/all`),
      ]);

      set({
        messages: messagesRes.data,
        participants: Object.fromEntries(
          participantsRes.data.map((p: TParticipant) => [p.uuid, p])
        ),
      });
    } catch (err) {
      console.error("Initialization error:", err);
    }
  },

  fetchLatest: async () => {
    try {
      const res = await axios.get(`${API_BASE}/messages/latest`);
      set({ messages: res.data });
    } catch (err) {
      console.error("Fetch latest error:", err);
    }
  },

  sendMessage: async () => {
    const { input, messages } = get();
    if (!input.trim()) return;
    try {
      const res = await axios.post(`${API_BASE}/messages/new`, { text: input });
      set({
        messages: [...messages, res.data],
        input: "",
      });
    } catch (err) {
      console.error("Send message error:", err);
    }
  },
}));
