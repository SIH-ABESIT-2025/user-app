import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET() {
    try {
        // Test database connection
        await prisma.$connect();
        
        // Test a simple query
        const result = await prisma.$queryRaw`SELECT 1 as test`;
        
        return NextResponse.json({
            success: true,
            message: "Database connection successful",
            test: result,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Database connection test failed:", error);
        
        return NextResponse.json({
            success: false,
            message: "Database connection failed",
            error: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date().toISOString()
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
