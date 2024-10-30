import db from "@repo/db/client";

export const getUserInfo = async (publicKey: string) => {
  const data = await db.user.findUnique({
    where: {
      publicKey,
    },
    //find his notification Channel  (Discord/Telegram)
  });
  return data;
};
