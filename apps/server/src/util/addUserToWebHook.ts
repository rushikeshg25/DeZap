import heliusClient from "../HeliusClient";

export const addUserToWebHook = async (publicKey: string) => {
  return heliusClient.appendAddressesToWebhook(process.env.WEBHOOK_ID as string, [
    publicKey
  ]);
};
