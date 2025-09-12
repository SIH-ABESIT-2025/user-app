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
        const { role } = await request.json();

        // Validate role
        const validRoles = ["CITIZEN", "MINISTRY_STAFF", "ADMIN", "SUPER_ADMIN"];
        if (!validRoles.includes(role)) {
            return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }

        // Role assignment validation removed since admin authentication is disabled
        // if ((role === "ADMIN" || role === "SUPER_ADMIN") && verifiedToken.role !== "SUPER_ADMIN") {
        //     return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
        // }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { role },
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
        console.error("Error updating user role:", error);
        return NextResponse.json(
            { error: "Failed to update user role" },
            { status: 500 }
        );
    }
}
