-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "category" VARCHAR(20) NOT NULL,
    "item_name" VARCHAR(50) NOT NULL,
    "price" INTEGER NOT NULL,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);
