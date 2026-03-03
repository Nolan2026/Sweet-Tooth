import prisma from "./src/prismaClient.js";

async function main() {
    try {
        console.log("Checking fields on User model...");
        // This will throw if the client doesn't have the otp field
        const userFields = Object.keys(prisma.user);

        // Try a dummy update (but with a non-existent email so it doesn't do anything)
        await prisma.user.update({
            where: { email: "dummy@example.com" },
            data: { otp: "123456" }
        });
    } catch (e) {
        console.log("Error caught:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
