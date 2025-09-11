import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Check if environment variables are set
        const envCheck = {
            DATABASE_URL: process.env.DATABASE_URL ? "✅ Set" : "❌ Missing",
            JWT_SECRET_KEY: process.env.JWT_SECRET_KEY ? "✅ Set" : "❌ Missing",
        };

        // Show partial values for verification (not full secrets)
        const partialValues = {
            DATABASE_URL: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 50) + "..." : "Not set",
            JWT_SECRET_KEY: process.env.JWT_SECRET_KEY ? "Set (length: " + process.env.JWT_SECRET_KEY.length + ")" : "Not set",
        };

        return NextResponse.json({
            message: "Environment Variables Check",
            status: "success",
            environment: process.env.NODE_ENV,
            timestamp: new Date().toISOString(),
            envCheck,
            partialValues
        });
    } catch (error) {
        return NextResponse.json({
            message: "Environment check failed",
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
