/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('ESCROW', 'SPL_TOKEN', 'NFT', 'AIRDROP', 'PAYMENT');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('EMAIL', 'SMS', 'DISCORD', 'TELEGRAM');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email";

-- CreateTable
CREATE TABLE "TransactionHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "transactionType" "TransactionType" NOT NULL,
    "signature" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "transactionData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransactionHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emailId" TEXT,
    "discordId" TEXT,
    "phoneNo" TEXT,
    "telegramId" TEXT,
    "type" "NotificationType" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "decimals" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TokenToTransactionHistory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_symbol_key" ON "Token"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "_TokenToTransactionHistory_AB_unique" ON "_TokenToTransactionHistory"("A", "B");

-- CreateIndex
CREATE INDEX "_TokenToTransactionHistory_B_index" ON "_TokenToTransactionHistory"("B");

-- AddForeignKey
ALTER TABLE "TransactionHistory" ADD CONSTRAINT "TransactionHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TokenToTransactionHistory" ADD CONSTRAINT "_TokenToTransactionHistory_A_fkey" FOREIGN KEY ("A") REFERENCES "Token"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TokenToTransactionHistory" ADD CONSTRAINT "_TokenToTransactionHistory_B_fkey" FOREIGN KEY ("B") REFERENCES "TransactionHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
