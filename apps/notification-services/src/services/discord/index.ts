import { getClient, replyToUser } from "./DiscordHelper";

export const sendDiscordNotification = async (data: {
  TransferType: string;
  amount: number;
  recieverPubkey: string;
  transactionLink: string;
  message: string;
  notificationId: string;
  channelId: string | null;
}) => {
  const { notificationId, message, channelId } = data;

  if (notificationId && channelId) {
    const result = await replyToUser(notificationId, message, channelId, true);
    if (result.success) {
      console.log("Reply sent to user");
    } else {
      console.log("Error sending reply");
    }
  }
};
