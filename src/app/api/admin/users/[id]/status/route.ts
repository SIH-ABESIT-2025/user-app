import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { verifyJwtToken } from "@/utilities/auth";

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

        // Prevent deactivating own account
        if (id === verifiedToken.id && !isActive) {
            return NextResponse.json({ error: "Cannot deactivate your own account" }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { isActive },
            select: {
                id: true,
                username: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                isPremium: true,
                photoUrl: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Error updating user status:", error);
        return NextResponse.json(
            { error: "Failed to update user status" },
            { status: 500 }
        );
    }
}
