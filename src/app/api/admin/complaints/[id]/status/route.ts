import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { verifyJwtToken } from "@/utilities/auth";

export const dynamic = 'force-dynamic';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Admin authentication removed - API is now accessible without login

        const { id } = params;
        const { status, message } = await request.json();

        // Update complaint status
        const updatedComplaint = await prisma.complaint.update({
            where: { id },
            data: { 
                status,
                ...(status === "RESOLVED" && { resolvedAt: new Date() })
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
            },
        });

        // Status update record creation removed since admin authentication is disabled
        // await prisma.complaintUpdate.create({
        //     data: {
        //         complaintId: id,
        //         status,
        //         message: message || `Status updated to ${status.replace('_', ' ')}`,
        //         updatedById: verifiedToken.id,
        //     },
        // });

        return NextResponse.json(updatedComplaint);
    } catch (error) {
        console.error("Error updating complaint status:", error);
        return NextResponse.json(
            { error: "Failed to update complaint status" },
            { status: 500 }
        );
    }
}
