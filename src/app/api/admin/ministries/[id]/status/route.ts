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
        const { isActive } = await request.json();

        const ministry = await prisma.ministry.update({
            where: { id },
            data: { isActive }
        });

        return NextResponse.json(ministry);
    } catch (error) {
        console.error("Error updating ministry status:", error);
        return NextResponse.json(
            { error: "Failed to update ministry status" },
            { status: 500 }
        );
    }
}
