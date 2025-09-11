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
        const { role } = await request.json();

        // Validate role
        const validRoles = ["CITIZEN", "MINISTRY_STAFF", "ADMIN", "SUPER_ADMIN"];
        if (!validRoles.includes(role)) {
            return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }

        // Only SUPER_ADMIN can assign ADMIN and SUPER_ADMIN roles
        if ((role === "ADMIN" || role === "SUPER_ADMIN") && verifiedToken.role !== "SUPER_ADMIN") {
            return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
        }

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
