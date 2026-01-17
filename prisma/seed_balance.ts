
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany();

    if (users.length === 0) {
        console.log("No users found. Creating a mock user...");
        const newUser = await prisma.user.create({
            data: {
                name: "Test User",
                email: "test@example.com",
                passwordHash: "mock_hash",
                walletAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", // Common Hardhat test account #0
                role: "DONOR",
                status: "ACTIVE",
                balance: 5000
            }
        });
        console.log(`Created user with wallet: ${newUser.walletAddress} and balance: ${newUser.balance}`);
    } else {
        console.log(`Found ${users.length} users.`);
        for (const user of users) {
            const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: { balance: { increment: 5000 } }
            });
            console.log(`Added 5000 to user ${updatedUser.email} (Wallet: ${updatedUser.walletAddress}). New Balance: ${updatedUser.balance}`);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
