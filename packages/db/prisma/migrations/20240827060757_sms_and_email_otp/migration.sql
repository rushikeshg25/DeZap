/*
  Warnings:

  - You are about to drop the column `email` on the `OTP` table. All the data in the column will be lost.
  - Added the required column `otpID` to the `OTP` table without a default value. This is not possible if the table is not empty.
  - Added the required column `otpType` to the `OTP` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OTPType" AS ENUM ('EMAIL', 'SMS');

-- AlterTable
ALTER TABLE "OTP" DROP COLUMN "email",
ADD COLUMN     "otpID" TEXT NOT NULL,
ADD COLUMN     "otpType" "OTPType" NOT NULL;
