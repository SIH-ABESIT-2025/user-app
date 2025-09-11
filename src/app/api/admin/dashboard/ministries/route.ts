import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { verifyJwtToken } from "@/utilities/auth";

export async function GET(request: NextRequest) {
    try {
        // Verify admin access
        const token = request.cookies.get("token")?.value;
        const verifiedToken = token && (await verifyJwtToken(token));
        
        if (!verifiedToken || (verifiedToken.role !== "ADMIN" && verifiedToken.role !== "SUPER_ADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const totalMinistries = await prisma.ministry.count();

        return NextResponse.json({
            total: totalMinistries
        });
    } catch (error) {
        console.error("Error fetching ministry stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch ministry statistics" },
            { status: 500 }
        );
    }
}
