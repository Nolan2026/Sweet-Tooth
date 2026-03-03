import prisma from './src/prismaClient.js';

async function test() {
    try {
        const contact = await prisma.contact.create({
            data: {
                name: "Leo Nardo",
                email: "leo@example.com",
                subject: "Sweet FeedBack From LeoNado Dicrapio",
                message: "i have recently tasted your seweets i liked soo much. i recomend it to my friends",
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
