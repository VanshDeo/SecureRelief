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
            include: {
                receivedVouchers: {
                    include: {
                        zone: {
                            select: {
                                name: true
                            }
                        },
                        donation: {
                            select: {
                                donorAddress: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const vouchers = user.receivedVouchers.map(v => ({
            id: v.id,
            type: v.zone.name, // Using zone name as type for now or could be "Relief Aid"
            amount: v.amount,
            expiry: new Date(new Date(v.createdAt).setMonth(new Date(v.createdAt).getMonth() + 3)).toISOString().split('T')[0], // Mock expiry 3 months from now
            zone: v.zone.name,
            qrCode: v.qrCode,
            status: v.status,
            donor: v.donation?.donorAddress || "Anonymous"
        }));

        return NextResponse.json({ vouchers });

    } catch (error) {
        console.error('Fetch vouchers error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
