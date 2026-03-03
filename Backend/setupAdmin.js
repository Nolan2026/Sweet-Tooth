import prisma from "./src/prismaClient.js";

async function main() {
    const email = "[EMAIL_ADDRESS]";
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
        await prisma.user.update({
            where: { email },
            data: { role: 'ADMIN' }
        });
        console.log(`Successfully upgraded ${email} to ADMIN.`);
    } else {
        console.log(`User ${email} not found. Register an account with this email via the Admin panel first.`);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
