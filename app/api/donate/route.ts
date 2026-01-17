
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { zoneId, amount, donorWallet } = body;

        if (!zoneId || !amount) {
            return NextResponse.json({ error: 'Missing zoneId or amount' }, { status: 400 });
        }

        const amountDecimal = Number(amount);

        // ATOMIC TRANSACTION: Deduct Balance -> Create Donation -> Update Zone
        const result = await prisma.$transaction(async (tx) => {
            // 1. Check & Deduct User Balance
            if (donorWallet) {
                const user = await tx.user.findUnique({ where: { walletAddress: donorWallet } });

                // If user exists, we enforce balance check. 
                // If mock user (no DB record but using wallet), strict check might fail unless we allow negative.
                // Assuming registered users for now.
                if (user) {
                    if (Number(user.balance) < amountDecimal) {
                        throw new Error("Insufficient balance");
                    }
                    await tx.user.update({
                        where: { walletAddress: donorWallet },
                        data: { balance: { decrement: amountDecimal } }
                    });
                }
            }

            // 2. Record Donation
            const donation = await tx.donation.create({
                data: {
                    zoneId,
                    amount: amountDecimal,
                    donorAddress: donorWallet || '0x00...mock',
                    status: 'COMPLETED',
                    currency: 'USDC'
                }
            });

            // 3. Update Zone Allocated Budget
            const updatedZone = await tx.disasterZone.update({
                where: { id: zoneId },
                data: {
                    allocated: {
                        increment: amountDecimal
                    }
                }
            });

            // 4. (DEMO ONLY) Auto-issue Voucher to a Beneficiary
            // In a real app, this would be a separate "Claim" or "Distribute" process.
            // Here we find the first available BENEFICIARY and give them the token so it appears on their dashboard.
            const demoBeneficiary = await tx.user.findFirst({
                where: { role: 'BENEFICIARY' }
            });

            if (demoBeneficiary) {
                await tx.voucher.create({
                    data: {
                        amount: amountDecimal,
                        status: 'ISSUED',
                        qrCode: `V-${Date.now()}-${Math.random().toString(36).substring(7)}`, // Unique QR string
                        beneficiaryId: demoBeneficiary.id,
                        zoneId: zoneId,
                        donationId: donation.id // Link voucher to the specific donation
                    }
                });
            }

            return { donation, newAllocated: updatedZone.allocated };
        });

        return NextResponse.json({
            success: true,
            donation: result.donation,
            newAllocated: result.newAllocated
        });

    } catch (error) {
        console.error('Donation error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
