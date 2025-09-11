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

        const [
            totalComplaints,
            resolvedComplaints,
            pendingComplaints,
            urgentComplaints,
            recentComplaints
        ] = await Promise.all([
            prisma.complaint.count(),
            prisma.complaint.count({ where: { status: "RESOLVED" } }),
            prisma.complaint.count({ 
                where: { 
                    status: { in: ["SUBMITTED", "UNDER_REVIEW", "IN_PROGRESS"] } 
                } 
            }),
            prisma.complaint.count({ where: { priority: "URGENT" } }),
            prisma.complaint.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            photoUrl: true,
                        },
                    },
                    ministry: true,
                    _count: {
                        select: {
                            comments: true,
                            updates: true,
                        },
                    },
                },
            })
        ]);

        return NextResponse.json({
            total: totalComplaints,
            resolved: resolvedComplaints,
            pending: pendingComplaints,
            urgent: urgentComplaints,
            recent: recentComplaints
        });
    } catch (error) {
        console.error("Error fetching complaint stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch complaint statistics" },
            { status: 500 }
        );
    }
}
