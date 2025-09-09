import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET() {
    try {
        // Test 1: Basic connection
        await prisma.$connect();
        
        // Test 2: Simple query
        const result = await prisma.$queryRaw`SELECT 1 as test`;
        
        // Test 3: Try to access a table
        const ministryCount = await prisma.ministry.count();
        
        // Test 4: Try to read ministries
        const ministries = await prisma.ministry.findMany({
            take: 1
        });
        
        return NextResponse.json({
            success: true,
            message: "All database tests passed",
            tests: {
                connection: "✅ Connected",
                simpleQuery: "✅ Passed",
                tableAccess: "✅ Passed",
                ministryCount: ministryCount,
                sampleData: ministries.length > 0 ? "✅ Data found" : "⚠️ No data"
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Database test failed:", error);
        
        return NextResponse.json({
            success: false,
            message: "Database test failed",
            error: error instanceof Error ? error.message : "Unknown error",
            errorType: error instanceof Error ? error.constructor.name : "Unknown",
            timestamp: new Date().toISOString()
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
