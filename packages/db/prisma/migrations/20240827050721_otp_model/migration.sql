/*
  Warnings:

  - You are about to drop the column `otpString` on the `OTP` table. All the data in the column will be lost.
  - Added the required column `otp` to the `OTP` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OTP" DROP COLUMN "otpString",
ADD COLUMN     "otp" TEXT NOT NULL;
