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
            totalUsers,
            recentUsers
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    username: true,
                    name: true,
                    email: true,
                    photoUrl: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                    _count: {
                        select: {
                            complaints: true,
                            createdTweets: true,
                            followers: true,
                            following: true,
                        },
                    },
                },
            })
        ]);

        return NextResponse.json({
            total: totalUsers,
            recent: recentUsers
        });
    } catch (error) {
        console.error("Error fetching user stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch user statistics" },
            { status: 500 }
        );
    }
}
