import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { verifyJwtToken } from "@/utilities/auth";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        // Admin authentication removed - API is now accessible without login

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
        // Admin authentication removed - API is now accessible without login

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
