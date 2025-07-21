export type TMessageAttachment = {
  uuid: string;
  type: "image";
  url: string;
  width: number;
  height: number;
};

export type TReaction = {
  uuid: string;
  participantUuid: string;
  value: string;
};

export type TParticipant = {
  uuid: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  email?: string;
  jobTitle?: string;
  createdAt: number;
  updatedAt: number;
};

export type TMessage = {
  uuid: string;
  text: string;
  attachments: TMessageAttachment[];
  replyToMessageUuid?: string;
  reactions: TReaction[];
  authorUuid: string;
  sentAt: number;
  updatedAt: number;
};

export type TMessageJSON = Omit<TMessage, "replyToMessageUuid"> & {
  replyToMessage?: Omit<TMessage, "replyToMessageUuid">;
};
