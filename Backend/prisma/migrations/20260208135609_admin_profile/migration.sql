-- CreateTable
CREATE TABLE "AdminProfile" (
    "id" SERIAL NOT NULL,
    "business_name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "gstin" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "business_email" TEXT,
    "instagram_url" TEXT,
    "facebook_url" TEXT,
    "frontend_logo" TEXT,
    "backend_logo" TEXT,
    "business_logo" TEXT,
    "Collections_image" TEXT,
    "OurStory_image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminProfile_pkey" PRIMARY KEY ("id")
);
