import { Telegraf } from "telegraf";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db";
import { NotificationType } from "@repo/db/types";

//curl https://api.telegram.org/bot<telegram_bot_token>/setWebhook?url=https://<your-deployment.vercel>.app/api/bot

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

bot.command("verify", async (ctx) => {
  const verifyPayload = ctx.payload;
  const chatId = ctx.chat.id.toString();
  if (verifyPayload) {
    ctx.reply(`Verification code received: ${verifyPayload}`);
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: verifyPayload,
        },
      });
      if (!user) {
        ctx.reply("Invalid user. Please try again.");
        return;
      }
      await prisma.notification.create({
        data: {
          notificationId: chatId,
          type: NotificationType.TELEGRAM,
          userId: verifyPayload,
        },
      });
      ctx.reply(
        "Verification successful! Now you will receive notifications from DeZap!"
      );
    } catch (error) {
      ctx.reply("Verification failed. Please try again.");
    }
  } else {
    ctx.reply("Please send the verification message. Usage: /verify <code>");
  }
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    await bot.handleUpdate(body);

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Error in processing the update:", error);
    return NextResponse.json({ status: "error", message: error });
  }
}
