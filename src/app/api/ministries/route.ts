import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET() {
    console.log('[MINISTRIES-GET] Starting request');
    
    try {
        // Check if Prisma client is available
        if (!prisma) {
            console.error('[MINISTRIES-GET] Prisma client is null');
            return NextResponse.json({ 
                success: false, 
                error: "Database connection not available",
                ministries: []
            });
        }

        console.log('[MINISTRIES-GET] Fetching ministries...');
        const ministries = await prisma.ministry.findMany({
            orderBy: {
                name: 'asc',
            },
            include: {
                _count: {
                    select: {
                        complaints: true
                    }
                }
            }
        });

        console.log(`[MINISTRIES-GET] Found ${ministries.length} ministries`);

        return NextResponse.json({
            ministries
        });
    } catch (error) {
        console.error('[MINISTRIES-GET] Error:', error);
        return NextResponse.json({ 
            success: false, 
            error: error instanceof Error ? error.message : "Unknown error",
            ministries: []
        });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description, icon, color } = body;

        const ministry = await prisma.ministry.create({
            data: {
                name,
                description,
                icon,
                color,
            },
        });

        return NextResponse.json(ministry, { status: 201 });
    } catch (error) {
        console.error("Error creating ministry:", error);
        return NextResponse.json(
            { error: "Failed to create ministry" },
            { status: 500 }
        );
    }
}
