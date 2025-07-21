import { useChatStore } from "@/store/useChatStore";
import { TMessageJSON } from "@/types/chatTypes";
import dayjs from "dayjs";
import React, { useEffect, useRef } from "react";
import {
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const ChatScreen = () => {
  const flatListRef = useRef<FlatList<TMessageJSON>>(null);
  const { messages, participants, sendMessage, input, setInput, initialize } =
    useChatStore();

  const handleSend = async () => {
    await sendMessage();
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 50);
  };

  useEffect(() => {
    initialize();
  }, []);

  const renderItem = ({ item }: { item: TMessageJSON }) => {
    const participant = participants[item.authorUuid];
    const imageAttachment = item.attachments?.find(
      (att) => att.type === "image"
    );

    return (
      <View style={styles.messageContainer}>
        <View style={styles.header}>
          <Image
            source={{ uri: participant?.avatarUrl }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{participant?.name}</Text>
          <Text style={styles.timestamp}>
            {dayjs(item.sentAt).format("HH:mm")}
          </Text>
        </View>
        {item.replyToMessage && (
          <Text style={styles.reply}>
            Replying to: {item.replyToMessage.text}
          </Text>
        )}
        <Text style={styles.text}>
          {item.text} {item.updatedAt > item.sentAt ? "(edited)" : ""}
        </Text>
        {imageAttachment && (
          <Image source={{ uri: imageAttachment.url }} style={styles.image} />
        )}
        {item.reactions && item.reactions.length > 0 && (
          <View style={styles.reactions}>
            {item.reactions.map((r, idx) => (
              <Text key={idx}>{r.value}</Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.uuid}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
      />
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message"
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  name: {
    fontWeight: "bold",
    marginRight: 8,
  },
  timestamp: {
    fontSize: 10,
    color: "gray",
  },
  text: {
    fontSize: 16,
  },
  reply: {
    fontStyle: "italic",
    backgroundColor: "#ddd",
    padding: 4,
    borderRadius: 4,
    marginBottom: 4,
  },
  reactions: {
    flexDirection: "row",
    marginTop: 4,
  },
  image: {
    width: "100%",
    aspectRatio: 1.5,
    borderRadius: 12,
    marginTop: 6,
    maxHeight: 300,
    resizeMode: "cover",
    backgroundColor: "#f2f2f2",
  },
  inputBar: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginRight: 10,
    paddingHorizontal: 8,
  },
});

export default ChatScreen;
