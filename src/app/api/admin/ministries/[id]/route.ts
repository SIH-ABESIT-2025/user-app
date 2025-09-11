import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { verifyJwtToken } from "@/utilities/auth";

export const dynamic = 'force-dynamic';

export async function PUT(
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
        const { name, description, icon, color, isActive } = await request.json();

        if (!name) {
            return NextResponse.json({ error: "Ministry name is required" }, { status: 400 });
        }

        const ministry = await prisma.ministry.update({
            where: { id },
            data: {
                name,
                description,
                icon,
                color,
                isActive
            }
        });

        return NextResponse.json(ministry);
    } catch (error) {
        console.error("Error updating ministry:", error);
        return NextResponse.json(
            { error: "Failed to update ministry" },
            { status: 500 }
        );
    }
}

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

        // Check if ministry has complaints
        const complaintCount = await prisma.complaint.count({
            where: { ministryId: id }
        });

        if (complaintCount > 0) {
            return NextResponse.json(
                { error: "Cannot delete ministry with existing complaints" },
                { status: 400 }
            );
        }

        await prisma.ministry.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting ministry:", error);
        return NextResponse.json(
            { error: "Failed to delete ministry" },
            { status: 500 }
        );
    }
}
