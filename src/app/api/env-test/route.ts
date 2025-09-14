import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        success: true,
        environment: {
            NODE_ENV: process.env.NODE_ENV,
            DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
            DATABASE_URL_LENGTH: process.env.DATABASE_URL?.length || 0,
            JWT_SECRET_EXISTS: !!process.env.JWT_SECRET_KEY,
            JWT_SECRET_LENGTH: process.env.JWT_SECRET_KEY?.length || 0,
            HOST_URL: process.env.NEXT_PUBLIC_HOST_URL,
            STORAGE_URL: process.env.NEXT_PUBLIC_STORAGE_URL,
        },
        availableEnvVars: Object.keys(process.env)
            .filter(key => 
                key.includes('DATABASE') || 
                key.includes('DB') || 
                key.includes('JWT') || 
                key.includes('NEXT_PUBLIC') ||
                key.includes('NODE_ENV')
            )
            .sort()
    });
}
