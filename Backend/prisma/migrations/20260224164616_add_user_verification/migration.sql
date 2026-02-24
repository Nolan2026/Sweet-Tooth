-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "otp" VARCHAR(6),
ADD COLUMN     "otpExpiresAt" TIMESTAMP(3);
