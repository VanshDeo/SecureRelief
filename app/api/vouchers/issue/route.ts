
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { zoneId, beneficiaryId, amount } = body;

        if (!zoneId || !beneficiaryId || !amount) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const amountDecimal = Number(amount);

        // 1. Verify Zone has enough allocated funds (or handle over-allocation logic)
        const zone = await prisma.disasterZone.findUnique({
            where: { id: zoneId }
        });

        if (!zone) {
            return NextResponse.json({ error: 'Zone not found' }, { status: 404 });
        }

        // Basic check: can't distribute more than allocated?
        // For now, we allow it but maybe warn, or we strict check.
        // Let's strictly check if distributed + amount <= allocated
        const currentDistributed = Number(zone.distributed);
        const currentAllocated = Number(zone.allocated);

        if (currentDistributed + amountDecimal > currentAllocated) {
            return NextResponse.json({ error: 'Insufficient allocated funds in this zone' }, { status: 400 });
        }

        // 2. Generate Unique QR/Token
        // In a real app, this might be a signed JWT or a hash of the data + secret
        const qrData = JSON.stringify({
            z: zoneId,
            b: beneficiaryId,
            a: amountDecimal,
            n: crypto.randomBytes(8).toString('hex') // nonce
        });
        const qrHash = crypto.createHash('sha256').update(qrData).digest('hex');

        // 3. Create Voucher Record
        const voucher = await prisma.voucher.create({
            data: {
                zoneId,
                beneficiaryId,
                amount: amountDecimal,
                qrCode: qrHash,
                status: 'ISSUED'
            }
        });

        // 4. Update Zone Distributed Amount
        await prisma.disasterZone.update({
            where: { id: zoneId },
            data: {
                distributed: {
                    increment: amountDecimal
                },
                beneficiaries: {
                    increment: 1
                }
            }
        });

        return NextResponse.json({
            success: true,
            voucher,
            qrCode: qrHash // The user (beneficiary) gets this
        });

    } catch (error) {
        console.error('Voucher issuance error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
