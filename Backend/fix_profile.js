import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const profile = await prisma.adminProfile.findFirst();

    const data = {
        Collections_image: "Collections_image-1770654745923.jpg",
        OurStory_image: "OurStory_image-1770654745928.jpg",
        backend_logo: "backend_logo-1770654745908.jpg",
        business_logo: "business_logo-1770654745917.jpg",
        frontend_logo: "frontend_logo-1770654745901.jpg",
    };

    if (profile) {
        await prisma.adminProfile.update({
            where: { id: profile.id },
            data
        });
        console.log("Profile updated with existing images.");
    } else {
        await prisma.adminProfile.create({
            data: {
                business_name: "Sweet Tooth",
                address: "Kurnool, AP",
                ...data
            }
        });
        console.log("Profile created with existing images.");
    }

    await prisma.$disconnect();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
