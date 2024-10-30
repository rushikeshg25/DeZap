'use server';
import prisma from '@repo/db';
import { NotificationType, OTPType } from '@repo/db/types';
import { revalidatePath } from 'next/cache';

export const verifyEmailOTPAction = async (OTP: string, userId: string) => {
  try {
    const OTPData = await prisma.oTP.findUnique({
      where: {
        otpType: OTPType.EMAIL,
        userId: userId,
        otp: OTP,
      },
    });
    if (OTPData && OTPData.expiresAt > new Date()) {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          notifications: {
            create: {
              type: NotificationType.EMAIL,
              notificationId: OTPData.otpID,
            },
          },
        },
      });
      await prisma.oTP.delete({
        where: {
          userId: userId,
          otp: OTP,
        },
      });
      return { verified: 'true' };
    }
    return { verified: 'false' };
  } catch (error) {
    return { verified: 'error' };
  }
};
