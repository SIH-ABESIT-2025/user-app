import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/prisma/client";
import { verifyJwtToken } from "@/utilities/auth";
import { UserProps } from "@/types/UserProps";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const ministryId = searchParams.get("ministryId");
        const status = searchParams.get("status");
        const priority = searchParams.get("priority");
        const userId = searchParams.get("userId");

        const skip = (page - 1) * limit;

        const where: any = {};
        
        if (ministryId) where.ministryId = ministryId;
        if (status) where.status = status;
        if (priority) where.priority = priority;
        if (userId) where.userId = userId;

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

export async function POST(request: NextRequest) {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;
        const verifiedToken: UserProps = token && (await verifyJwtToken(token));

        if (!verifiedToken) {
            return NextResponse.json({ error: "You are not authorized to perform this action." }, { status: 401 });
        }

        const body = await request.json();
        const { title, description, location, latitude, longitude, priority, ministryId, attachments } = body;

        // Generate complaint number (format: JH-YYYYMMDD-XXXX)
        const now = new Date();
        const dateStr = now.getFullYear().toString() + 
                       (now.getMonth() + 1).toString().padStart(2, '0') + 
                       now.getDate().toString().padStart(2, '0');
        const randomStr = Math.random().toString(36).substr(2, 4).toUpperCase();
        const complaintNumber = `JH-${dateStr}-${randomStr}`;

        const complaint = await prisma.complaint.create({
            data: {
                title,
                description,
                location,
                latitude,
                longitude,
                priority,
                ministryId,
                userId: verifiedToken.id,
                complaintNumber,
                attachments: {
                    create: attachments?.map((attachment: any) => ({
                        fileName: attachment.fileName,
                        fileUrl: attachment.fileUrl,
                        fileType: attachment.fileType,
                        fileSize: attachment.fileSize,
                        mimeType: attachment.mimeType,
                    })) || [],
                },
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
                attachments: true,
            },
        });

        // Create initial status update
        await prisma.complaintUpdate.create({
            data: {
                complaintId: complaint.id,
                status: 'SUBMITTED',
                message: 'Complaint has been submitted and is under review.',
                updatedById: verifiedToken.id,
            },
        });

        // Create notification for ministry staff (if any)
        // This would be implemented based on your notification system

        return NextResponse.json(complaint, { status: 201 });
    } catch (error) {
        console.error("Error creating complaint:", error);
        return NextResponse.json(
            { error: "Failed to create complaint" },
            { status: 500 }
        );
    }
}
