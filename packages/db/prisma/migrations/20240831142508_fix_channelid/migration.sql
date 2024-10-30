/*
  Warnings:

  - Made the column `channelId` on table `Notification` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "channelId" SET NOT NULL;
