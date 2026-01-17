import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { Role } from '@prisma/client';

export async function GET(req: NextRequest) {
    try {
        // const authHeader = req.headers.get('authorization');
        // const token = authHeader && authHeader.split(' ')[1];

        // if (!token) {
        //     return NextResponse.json({ error: 'Access token required' }, { status: 401 });
        // }

        // const decoded = verifyToken(token);
        // if (!decoded || (decoded.role !== 'ADMIN' && decoded.role !== Role.ADMIN)) {
        //     // Handle case where role might be string or Enum in token. 
        //     // Usually it's stored as string in JWT but let's be safe.
        //     // Actually, verifyToken returns payload. role in payload.
        //     return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
        // }

        const zones = await prisma.disasterZone.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(zones);
    } catch (error) {
        console.error('Error fetching zones:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        // const authHeader = req.headers.get('authorization');
        // const token = authHeader && authHeader.split(' ')[1];

        // if (!token) {
        //     return NextResponse.json({ error: 'Access token required' }, { status: 401 });
        // }

        // const decoded = verifyToken(token);
        // if (!decoded || (decoded.role !== 'ADMIN' && decoded.role !== Role.ADMIN)) {
        //     return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
        // }

        const body = await req.json();
        const { name, location, latitude, longitude, budget, type, radius } = body;

        // Basic validation
        if (!name || !location || !budget) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newZone = await prisma.disasterZone.create({
            data: {
                name,
                location,
                latitude: latitude || 0, // Default or require
                longitude: longitude || 0,
                radius: radius || 1000,
                budget,
                type: type || 'General',
                status: 'PENDING',
                severity: 'MEDIUM'
            }
        });

        return NextResponse.json(newZone);
    } catch (error) {
        console.error('Error creating zone:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
