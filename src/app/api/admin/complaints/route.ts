import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { verifyJwtToken } from "@/utilities/auth";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        // Admin authentication removed - API is now accessible without login
        // const token = request.cookies.get("token")?.value;
        // const verifiedToken = token && (await verifyJwtToken(token));
        
        // if (!verifiedToken || (verifiedToken.role !== "ADMIN" && verifiedToken.role !== "SUPER_ADMIN")) {
        //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        // }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("search");
        const status = searchParams.get("status");
        const priority = searchParams.get("priority");

        const skip = (page - 1) * limit;

        const where: any = {};
        
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { complaintNumber: { contains: search, mode: 'insensitive' } },
                { user: { username: { contains: search, mode: 'insensitive' } } },
                { user: { name: { contains: search, mode: 'insensitive' } } }
            ];
        }
        if (status) where.status = status;
        if (priority) where.priority = priority;

        const [complaints, total] = await Promise.all([
            prisma.complaint.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            photoUrl: true,
                        },
                    },
                    ministry: true,
                    assignedTo: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                        },
                    },
                    attachments: true,
                    updates: {
                        orderBy: {
                            createdAt: 'desc',
                        },
                        take: 1,
                        include: {
                            updatedBy: {
                                select: {
                                    id: true,
                                    name: true,
                                    username: true,
                                },
                            },
                        },
                    },
                    _count: {
                        select: {
                            comments: true,
                            updates: true,
                        },
                    },
                },
            }),
            prisma.complaint.count({ where }),
        ]);

        return NextResponse.json({
            complaints,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching complaints:", error);
        return NextResponse.json(
            { error: "Failed to fetch complaints" },
            { status: 500 }
        );
    }
}
