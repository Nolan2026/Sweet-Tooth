/*
  Warnings:

  - You are about to drop the column `availability` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `kilo_grams` on the `Item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "availability",
DROP COLUMN "kilo_grams",
ADD COLUMN     "isavailable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isbill" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "iskilo" BOOLEAN NOT NULL DEFAULT true;
