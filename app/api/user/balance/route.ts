
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const wallet = searchParams.get('wallet');

        if (!wallet) {
            return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { walletAddress: wallet },
            select: { balance: true }
        });

        if (!user) {
            // Return 0 if user not found, essentially treating them as new
            return NextResponse.json({ balance: "0" });
        }

        return NextResponse.json({ balance: user.balance.toString() });

    } catch (error) {
        console.error('Fetch balance error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { wallet, amount } = body;

        if (!wallet || !amount) {
            return NextResponse.json({ error: 'Wallet and amount required' }, { status: 400 });
        }

        const amountDecimal = Number(amount);

        // Uses upsert to handle cases where the user might not exist yet (Mock helper)
        const updatedUser = await prisma.user.upsert({
            where: { walletAddress: wallet },
            update: {
                balance: {
                    increment: amountDecimal
                }
            },
            create: {
                walletAddress: wallet,
                email: `${wallet.slice(0, 8)}@mock.com`, // Mock email
                name: "Mock User",
                passwordHash: "mock_password", // Placeholder
                role: "DONOR",
                balance: amountDecimal
            }
        });

        return NextResponse.json({
            success: true,
            balance: updatedUser.balance.toString()
        });

    } catch (error) {
        console.error('Top up error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
