"use server";
import twilio from "twilio";
import prisma from "@repo/db";
import { OTPType } from "@repo/db/types";

export const sendSMSOTP = async (phoneNumber: string, userId: string) => {
  let OTP = Math.floor(1000 + Math.random() * 9000).toString();
  await prisma.oTP.create({
    data: {
      otpType: OTPType.SMS,
      otpID: phoneNumber,
      otp: OTP,
      userId: userId,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });
  try {
    const twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const message = await twilioClient.messages.create({
      body: `Your OTP is ${OTP}`,
      from: process.env.TWILIO_NUMBER,
      to: phoneNumber,
    });
    return { sucess: true };
  } catch (error) {
    console.error(error);
    return { sucess: false };
  }
};
