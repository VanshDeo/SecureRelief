import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const wallet = searchParams.get('wallet');

        if (!wallet) {
            return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
        }

        const user = await prisma.user.findFirst({
            where: {
                walletAddress: {
                    equals: wallet,
                    mode: 'insensitive'
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Fetch vouchers with zone info
        const vouchersRaw = await prisma.voucher.findMany({
            where: { beneficiaryId: user.id },
            include: {
                zone: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Manually fetch donor addresses to avoid the prisma include relation bug
        const donationIds = vouchersRaw.map(v => v.donationId).filter((id): id is string => !!id);
        const donations = await prisma.donation.findMany({
            where: { id: { in: donationIds } },
            select: { id: true, donorAddress: true }
        });

        const donationMap: Record<string, string> = {};
        donations.forEach(d => {
            donationMap[d.id] = d.donorAddress || "Anonymous";
        });

        const vouchers = vouchersRaw.map(v => ({
            id: v.id,
            type: v.zone?.name || "Relief Aid",
            amount: v.amount,
            expiry: new Date(new Date(v.createdAt).setMonth(new Date(v.createdAt).getMonth() + 3)).toISOString().split('T')[0],
            zone: v.zone?.name || "Global",
            qrCode: v.qrCode,
            status: v.status,
            donor: v.donationId ? donationMap[v.donationId] || "Anonymous" : "Anonymous"
        }));

        return NextResponse.json({ vouchers });

    } catch (error) {
        console.error('Fetch vouchers error detail:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { walletAddress, zoneId } = body;

        if (!walletAddress || !zoneId) {
            return NextResponse.json({ error: 'Wallet address and Zone ID are required' }, { status: 400 });
        }

        const user = await prisma.user.findFirst({
            where: {
                walletAddress: {
                    equals: walletAddress,
                    mode: 'insensitive'
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Generate a unique QR token
        const qrCode = "CLAIM-" + Math.random().toString(36).substring(2).toUpperCase() + "-" + Date.now();

        // Create the voucher
        // For a generic claim, we give a default amount or link to an available donation if exists
        // Here we just create one with 50 USDC default for demo
        const voucher = await prisma.voucher.create({
            data: {
                amount: 50.00,
                qrCode: qrCode,
                status: 'ISSUED',
                beneficiaryId: user.id,
                zoneId: zoneId
            },
            include: {
                zone: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            voucher: {
                ...voucher,
                type: voucher.zone.name,
                zone: voucher.zone.name,
                expiry: new Date(new Date(voucher.createdAt).setMonth(new Date(voucher.createdAt).getMonth() + 3)).toISOString().split('T')[0],
                donor: "Pool Fund"
            }
        });

    } catch (error) {
        console.error('Claim voucher error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
