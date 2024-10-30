import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

export const sendSmsNotification = async (data: {
  TransferType: string;
  amount: number;
  recieverPubkey: string;
  transactionLink: string;
  message: string;
  notificationId: string;
}) => {
  try {
    const twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const message = await twilioClient.messages.create({
      body: data.message,
      from: process.env.TWILIO_NUMBER,
      to: data.notificationId,
    });
    console.log("Message sent");
  } catch (error) {
    console.error(error);
  }
};
