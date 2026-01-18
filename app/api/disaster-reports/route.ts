import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch all disaster reports (for admin)
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const userId = searchParams.get('userId');

        const where: any = {};
        if (status) where.status = status;
        if (userId) where.reportedById = userId;

        const reports = await prisma.disasterReport.findMany({
            where,
            include: {
                reportedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        walletAddress: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ reports });
    } catch (error) {
        console.error('Fetch disaster reports error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST - Create a new disaster report
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            title,
            description,
            location,
            latitude,
            longitude,
            disasterType,
            severity,
            images,
            contactInfo,
            reportedById
        } = body;

        if (!title || !description || !location || !disasterType || !reportedById) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const report = await prisma.disasterReport.create({
            data: {
                title,
                description,
                location,
                latitude: latitude || null,
                longitude: longitude || null,
                disasterType,
                severity: severity || 'MEDIUM',
                images: images || [],
                contactInfo,
                reportedById,
                status: 'PENDING'
            },
            include: {
                reportedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return NextResponse.json({ success: true, report }, { status: 201 });
    } catch (error) {
        console.error('Create disaster report error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH - Update disaster report status (for admin)
export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { reportId, status, reviewedBy } = body;

        if (!reportId || !status) {
            return NextResponse.json(
                { error: 'Report ID and status are required' },
                { status: 400 }
            );
        }

        const report = await prisma.disasterReport.update({
            where: { id: reportId },
            data: {
                status,
                reviewedAt: new Date(),
                reviewedBy
            }
        });

        return NextResponse.json({ success: true, report });
    } catch (error) {
        console.error('Update disaster report error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
