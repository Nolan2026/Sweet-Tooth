-- DropIndex
DROP INDEX "Address_userId_key";

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "label" VARCHAR(20) NOT NULL DEFAULT 'Home';
