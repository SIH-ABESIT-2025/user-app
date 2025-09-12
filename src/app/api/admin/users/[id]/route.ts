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

        // Self-deletion check removed since admin authentication is disabled
        // if (id === verifiedToken.id) {
        //     return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
        // }

        // Check if user exists and get their role
        const user = await prisma.user.findUnique({
            where: { id },
            select: { role: true }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Permission check removed since admin authentication is disabled
        // if ((user.role === "ADMIN" || user.role === "SUPER_ADMIN") && verifiedToken.role !== "SUPER_ADMIN") {
        //     return NextResponse.json({ error: "Insufficient permissions to delete this user" }, { status: 403 });
        // }

        // Delete user and all related data
        await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
            { error: "Failed to delete user" },
            { status: 500 }
        );
    }
}
