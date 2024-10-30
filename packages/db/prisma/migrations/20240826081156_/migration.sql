/*
  Warnings:

  - You are about to drop the column `discordId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `emailId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNo` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `telegramId` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `notificationId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "discordId",
DROP COLUMN "emailId",
DROP COLUMN "phoneNo",
DROP COLUMN "telegramId",
ADD COLUMN     "notificationId" TEXT NOT NULL;
