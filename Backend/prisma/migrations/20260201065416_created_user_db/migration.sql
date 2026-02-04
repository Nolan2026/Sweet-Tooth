-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "image_url" DROP NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(30) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "pasword" VARCHAR(15) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
