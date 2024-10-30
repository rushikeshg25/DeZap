export enum NotificationType {
  DISCORD = "DISCORD",
  EMAIL = "EMAIL",
  SMS = "SMS",
  TELEGRAM = "TELEGRAM",
}

export type RedisData = {
  type: string;
  notificationId: string;
  transactionData: UserTransactionDataType;
  channelId: string | null;
};

type UserTransactionDataType = {
  TransferType: string;
  amount: number;
  recieverPubkey: string;
  transactionLink: string;
  message: string;
};
