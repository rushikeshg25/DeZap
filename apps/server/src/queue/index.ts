import dotenv from "dotenv";
import prisma from "@repo/db";
import { NotificationType, UserwithNotifications } from "@repo/db/types";
dotenv.config();

export type UserTransactionDataType = {
  TransferType: string;
  amount: number;
  secondaryPubkey: string;
  transactionLink: string;
  message: string;
};

export type UserActivityDetailsType = {
  primaryPubKey: string;
  transactionData: UserTransactionDataType;
};
import { createClient } from "redis";
dotenv.config();

const redis = createClient({
  password: process.env.REDIS_PASSWORD, // revert while pushing
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT as unknown as number,
  },
});
(async function connectClient() {
  await redis.connect();
  console.log("connected to redis server");
})();

export async function pushNotificationInQueue(
  userNotificationId: string,
  transactionActivity: UserActivityDetailsType
) {
  const data = await prisma.user.findUnique({
    where: {
      publicKey: transactionActivity.primaryPubKey,
    },
    select: {
      notifications: {
        select: {
          notificationId: true,
          type: true,
          channelId: true,
        },
      },
    },
  });
  const transactionActivityJSON = data?.notifications.map(
    async (notification: {
      notificationId: string;
      type: NotificationType;
      channelId: string | null;
    }) => {
      
      await redis.lPush(
        "notifications",
        JSON.stringify({
          ...transactionActivity,
          type: notification.type as NotificationType,
          notificationId: notification.notificationId, //if type is email then notificationId is the email id, if type is discord then notificationId is the discord id,etc
          channelId: notification.channelId
        })
      );
    }
  );
}
