import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { verifyJwtToken } from "@/utilities/auth";

export const dynamic = 'force-dynamic';

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Admin authentication removed - API is now accessible without login

        const { id } = params;

        // Delete complaint and all related data
        await prisma.complaint.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting complaint:", error);
        return NextResponse.json(
            { error: "Failed to delete complaint" },
            { status: 500 }
        );
    }
}
