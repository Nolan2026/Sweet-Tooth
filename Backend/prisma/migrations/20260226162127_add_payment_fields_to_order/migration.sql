-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentDetails" JSONB,
ADD COLUMN     "paymentMethod" VARCHAR(20);
