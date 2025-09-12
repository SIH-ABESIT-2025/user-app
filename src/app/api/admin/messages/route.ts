import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { verifyJwtToken } from "@/utilities/auth";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        // Admin authentication removed - API is now accessible without login

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("search");

        const skip = (page - 1) * limit;

        const where: any = {};
        
        if (search) {
            where.OR = [
                { text: { contains: search, mode: 'insensitive' } },
                { sender: { username: { contains: search, mode: 'insensitive' } } },
                { sender: { name: { contains: search, mode: 'insensitive' } } },
                { recipient: { username: { contains: search, mode: 'insensitive' } } },
                { recipient: { name: { contains: search, mode: 'insensitive' } } }
            ];
        }

        const [messages, total] = await Promise.all([
            prisma.message.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    sender: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            photoUrl: true,
                        },
                    },
                    recipient: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            photoUrl: true,
                        },
                    },
                },
            }),
            prisma.message.count({ where }),
        ]);

        return NextResponse.json({
            messages,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json(
            { error: "Failed to fetch messages" },
            { status: 500 }
        );
    }
}
