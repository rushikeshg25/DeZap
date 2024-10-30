import {
  NotificationType,
  Prisma,
  Notification,
  TransactionType,
  OTPType,
} from '@prisma/client';

export type { Prisma, Notification };
export type UserwithNotifications = Prisma.UserGetPayload<{
  include: {
    notifications: {
      select: {
        type: true;
        notificationId: true;
      };
    };
  };
}>;

export { OTPType, NotificationType, TransactionType };
