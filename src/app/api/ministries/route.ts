import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET() {
    try {
        const ministries = await prisma.ministry.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        return NextResponse.json(ministries);
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
