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

        // Get current date and calculate previous month
        const now = new Date();
        const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        const [
            totalUsers,
            recentUsers,
            // Current month data
            currentMonthUsers,
            // Previous month data
            previousMonthUsers
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
            }),
            // Current month
            prisma.user.count({
                where: {
                    createdAt: { gte: currentMonth }
                }
            }),
            // Previous month
            prisma.user.count({
                where: {
                    createdAt: { 
                        gte: previousMonth,
                        lte: previousMonthEnd
                    }
                }
            })
        ]);

        // Calculate user trend
        const usersTrend = previousMonthUsers > 0 
            ? Math.round(((currentMonthUsers - previousMonthUsers) / previousMonthUsers) * 100)
            : currentMonthUsers > 0 ? 100 : 0;

        return NextResponse.json({
            total: totalUsers,
            recent: recentUsers,
            trends: {
                users: usersTrend
            },
            monthly: {
                current: {
                    users: currentMonthUsers
                },
                previous: {
                    users: previousMonthUsers
                }
            }
        });
    } catch (error) {
        console.error("Error fetching user stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch user statistics" },
            { status: 500 }
        );
    }
}
