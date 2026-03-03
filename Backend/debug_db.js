import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const profile = await prisma.adminProfile.findFirst();
    const items = await prisma.item.findMany({ take: 5 });
    await prisma.$disconnect();
}

main();
