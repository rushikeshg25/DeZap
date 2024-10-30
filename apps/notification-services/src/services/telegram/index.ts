import { Telegraf } from "telegraf";
import dotenv from "dotenv";
dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN as string);

export const sendTelegramNotification = async (data: {
  TransferType: string;
  amount: number;
  recieverPubkey: string;
  transactionLink: string;
  message: string;
  notificationId: string;
}) => {
  const { message, notificationId } = data;

  if (message && notificationId) {
    bot.telegram
      .sendMessage(notificationId, message)
      .then(() => {
        console.log("Telegram message sent successfully");
      })
      .catch((error) => {
        console.error("Error sending Telegram message:", error);
      });
  } else {
    console.log("Somthing went wrong");
  }
};
