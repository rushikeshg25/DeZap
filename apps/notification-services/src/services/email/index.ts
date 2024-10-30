import { sendEmail } from "./nodeMailer";

export const sendEmailNotification = async (data: {
  TransferType: string;
  amount: number;
  recieverPubkey: string;
  transactionLink: string;
  message: string;
  notificationId: string;
}) => {
  try {
    const isMailSent = await sendEmail(data.notificationId, data.message);
    if (!isMailSent) {
      console.log("Something wrong in sending mail!");
    }
  } catch (error) {
    console.log("Internal Server Error!");
  }
};
