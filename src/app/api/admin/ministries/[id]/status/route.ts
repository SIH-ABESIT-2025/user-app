import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { verifyJwtToken } from "@/utilities/auth";

export const dynamic = 'force-dynamic';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Verify admin access
        const token = request.cookies.get("token")?.value;
        const verifiedToken = token && (await verifyJwtToken(token));
        
        if (!verifiedToken || (verifiedToken.role !== "ADMIN" && verifiedToken.role !== "SUPER_ADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

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
