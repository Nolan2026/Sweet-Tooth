import prisma from './src/prismaClient.js';

async function test() {
    try {
        const contact = await prisma.contact.create({
            data: {
                name: "Test",
                email: "test@example.com",
                message: "Test message"
            }
        });
        console.log("Success:", contact);
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await prisma.$disconnect();
    }
}

test();
