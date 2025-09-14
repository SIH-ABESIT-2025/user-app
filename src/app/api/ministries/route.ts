import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET() {
    const startTime = Date.now();
    const requestId = Math.random().toString(36).substr(2, 9);
    
    console.log(`[${requestId}] [MINISTRIES-GET] Starting request at ${new Date().toISOString()}`);
    
    try {
        // Test database connection first
        console.log(`[${requestId}] [MINISTRIES-GET] Testing database connection...`);
        await prisma.$connect();
        console.log(`[${requestId}] [MINISTRIES-GET] Database connected successfully`);

        console.log(`[${requestId}] [MINISTRIES-GET] Fetching ministries...`);
        const ministries = await prisma.ministry.findMany({
            // Temporarily remove isActive filter to debug
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

        console.log(`[${requestId}] [MINISTRIES-GET] Found ${ministries.length} ministries`);
        console.log(`[${requestId}] [MINISTRIES-GET] Ministries data:`, JSON.stringify(ministries, null, 2));

        // Return the same structure as admin API
        const response = {
            ministries
        };

        console.log(`[${requestId}] [MINISTRIES-GET] Request completed successfully in ${Date.now() - startTime}ms`);
        return NextResponse.json(response);
    } catch (error) {
        const executionTime = Date.now() - startTime;
        console.error(`[${requestId}] [MINISTRIES-GET] Error after ${executionTime}ms:`, {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            name: error instanceof Error ? error.name : 'Unknown',
            cause: error instanceof Error ? error.cause : undefined,
            executionTime,
            timestamp: new Date().toISOString()
        });

        const errorResponse = {
            success: false,
            error: "Failed to fetch ministries",
            details: error instanceof Error ? error.message : "Unknown error occurred",
            debug: {
                requestId,
                executionTime,
                errorType: error instanceof Error ? error.constructor.name : 'Unknown',
                timestamp: new Date().toISOString()
            }
        };

        return NextResponse.json(errorResponse, { status: 500 });
    } finally {
        try {
            await prisma.$disconnect();
            console.log(`[${requestId}] [MINISTRIES-GET] Database disconnected`);
        } catch (disconnectError) {
            console.error(`[${requestId}] [MINISTRIES-GET] Error disconnecting from database:`, disconnectError);
        }
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
