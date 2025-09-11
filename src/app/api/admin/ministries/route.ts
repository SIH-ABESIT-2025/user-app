import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { verifyJwtToken } from "@/utilities/auth";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        // Verify admin access
        const token = request.cookies.get("token")?.value;
        const verifiedToken = token && (await verifyJwtToken(token));
        
        if (!verifiedToken || (verifiedToken.role !== "ADMIN" && verifiedToken.role !== "SUPER_ADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search");

        const where: any = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        const ministries = await prisma.ministry.findMany({
            where,
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: {
                        complaints: true
                    }
                }
            }
        });

        return NextResponse.json({ ministries });
    } catch (error) {
        console.error("Error fetching ministries:", error);
        return NextResponse.json(
            { error: "Failed to fetch ministries" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        // Verify admin access
        const token = request.cookies.get("token")?.value;
        const verifiedToken = token && (await verifyJwtToken(token));
        
        if (!verifiedToken || (verifiedToken.role !== "ADMIN" && verifiedToken.role !== "SUPER_ADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, description, icon, color, isActive } = await request.json();

        if (!name) {
            return NextResponse.json({ error: "Ministry name is required" }, { status: 400 });
        }

        const ministry = await prisma.ministry.create({
            data: {
                name,
                description,
                icon,
                color,
                isActive: isActive !== false
            }
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
