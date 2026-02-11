import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const profile = await prisma.adminProfile.findFirst();
    console.log("Current Admin Profile:", JSON.stringify(profile, null, 2));
    const items = await prisma.item.findMany({ take: 5 });
    console.log("Sample Items:", JSON.stringify(items, null, 2));
    await prisma.$disconnect();
}

main();
