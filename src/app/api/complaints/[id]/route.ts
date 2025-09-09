import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/prisma/client";
import { verifyJwtToken } from "@/utilities/auth";
import { UserProps } from "@/types/UserProps";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const complaint = await prisma.complaint.findUnique({
            where: {
                id: params.id,
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
                comments: {
                    orderBy: {
                        createdAt: 'asc',
                    },
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                username: true,
                                photoUrl: true,
                            },
                        },
                    },
                },
            },
        });

        if (!complaint) {
            return NextResponse.json(
                { error: "Complaint not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(complaint);
    } catch (error) {
        console.error("Error fetching complaint:", error);
        return NextResponse.json(
            { error: "Failed to fetch complaint" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;
        const verifiedToken: UserProps = token && (await verifyJwtToken(token));
        if (!verifiedToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { status, message, assignedToId } = body;

        // Check if user has permission to update this complaint
        const existingComplaint = await prisma.complaint.findUnique({
            where: { id: params.id },
            select: { userId: true, assignedToId: true },
        });

        if (!existingComplaint) {
            return NextResponse.json(
                { error: "Complaint not found" },
                { status: 404 }
            );
        }

        // Only the complaint owner, assigned staff, or admin can update
        const canUpdate = 
            existingComplaint.userId === verifiedToken.id ||
            existingComplaint.assignedToId === verifiedToken.id ||
            verifiedToken.isPremium; // Assuming isPremium means admin

        if (!canUpdate) {
            return NextResponse.json(
                { error: "Insufficient permissions" },
                { status: 403 }
            );
        }

        const updateData: any = {};
        if (status) updateData.status = status;
        if (assignedToId) updateData.assignedToId = assignedToId;
        if (status === 'RESOLVED') updateData.resolvedAt = new Date();

        const complaint = await prisma.complaint.update({
            where: { id: params.id },
            data: updateData,
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
            },
        });

        // Create status update if status changed
        if (status && message) {
            await prisma.complaintUpdate.create({
                data: {
                    complaintId: params.id,
                    status,
                    message,
                    updatedById: verifiedToken.id,
                },
            });
        }

        return NextResponse.json(complaint);
    } catch (error) {
        console.error("Error updating complaint:", error);
        return NextResponse.json(
            { error: "Failed to update complaint" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;
        const verifiedToken: UserProps = token && (await verifyJwtToken(token));
        if (!verifiedToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const complaint = await prisma.complaint.findUnique({
            where: { id: params.id },
            select: { userId: true },
        });

        if (!complaint) {
            return NextResponse.json(
                { error: "Complaint not found" },
                { status: 404 }
            );
        }

        // Only the complaint owner or admin can delete
        if (complaint.userId !== verifiedToken.id && !verifiedToken.isPremium) {
            return NextResponse.json(
                { error: "Insufficient permissions" },
                { status: 403 }
            );
        }

        await prisma.complaint.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: "Complaint deleted successfully" });
    } catch (error) {
        console.error("Error deleting complaint:", error);
        return NextResponse.json(
            { error: "Failed to delete complaint" },
            { status: 500 }
        );
    }
}
