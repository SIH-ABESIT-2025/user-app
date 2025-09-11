import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { verifyJwtToken } from "@/utilities/auth";

export async function DELETE(
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

        // Prevent deleting own account
        if (id === verifiedToken.id) {
            return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
        }

        // Check if user exists and get their role
        const user = await prisma.user.findUnique({
            where: { id },
            select: { role: true }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Only SUPER_ADMIN can delete ADMIN and SUPER_ADMIN users
        if ((user.role === "ADMIN" || user.role === "SUPER_ADMIN") && verifiedToken.role !== "SUPER_ADMIN") {
            return NextResponse.json({ error: "Insufficient permissions to delete this user" }, { status: 403 });
        }

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
