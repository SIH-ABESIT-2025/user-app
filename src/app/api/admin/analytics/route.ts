import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { verifyJwtToken } from "@/utilities/auth";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        // Verify admin access
        const token = request.cookies.get("token")?.value;
        const verifiedToken = token && (await verifyJwtToken(token));
        
        if (!verifiedToken || (verifiedToken.role !== "ADMIN" && verifiedToken.role !== "SUPER_ADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const timeRange = parseInt(searchParams.get("timeRange") || "30");
        
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - timeRange);

        // Overview statistics
        const [
            totalComplaints,
            totalUsers,
            totalMinistries,
            resolvedComplaints,
            pendingComplaints,
            urgentComplaints
        ] = await Promise.all([
            prisma.complaint.count({
                where: { createdAt: { gte: startDate } }
            }),
            prisma.user.count(),
            prisma.ministry.count(),
            prisma.complaint.count({
                where: { 
                    status: "RESOLVED",
                    createdAt: { gte: startDate }
                }
            }),
            prisma.complaint.count({
                where: { 
                    status: { in: ["SUBMITTED", "UNDER_REVIEW", "IN_PROGRESS"] },
                    createdAt: { gte: startDate }
                }
            }),
            prisma.complaint.count({
                where: { 
                    priority: "URGENT",
                    createdAt: { gte: startDate }
                }
            })
        ]);

        // Complaints by status
        const statusCounts = await prisma.complaint.groupBy({
            by: ['status'],
            where: { createdAt: { gte: startDate } },
            _count: { status: true }
        });

        const complaintsByStatus = statusCounts.map(item => ({
            status: item.status,
            count: item._count.status,
            percentage: totalComplaints > 0 ? (item._count.status / totalComplaints) * 100 : 0
        }));

        // Complaints by priority
        const priorityCounts = await prisma.complaint.groupBy({
            by: ['priority'],
            where: { createdAt: { gte: startDate } },
            _count: { priority: true }
        });

        const complaintsByPriority = priorityCounts.map(item => ({
            priority: item.priority,
            count: item._count.priority,
            percentage: totalComplaints > 0 ? (item._count.priority / totalComplaints) * 100 : 0
        }));

        // Complaints by ministry
        const ministryCounts = await prisma.complaint.groupBy({
            by: ['ministryId'],
            where: { createdAt: { gte: startDate } },
            _count: { ministryId: true }
        });

        const ministryData = await Promise.all(
            ministryCounts.map(async (item) => {
                const ministry = await prisma.ministry.findUnique({
                    where: { id: item.ministryId },
                    select: { name: true }
                });
                return {
                    ministry: ministry?.name || 'Unknown',
                    count: item._count.ministryId,
                    percentage: totalComplaints > 0 ? (item._count.ministryId / totalComplaints) * 100 : 0
                };
            })
        );

        const complaintsByMinistry = ministryData.sort((a, b) => b.count - a.count);

        // Monthly trends (last 6 months)
        const monthlyTrends = [];
        for (let i = 5; i >= 0; i--) {
            const monthStart = new Date();
            monthStart.setMonth(monthStart.getMonth() - i, 1);
            const monthEnd = new Date(monthStart);
            monthEnd.setMonth(monthEnd.getMonth() + 1, 0);

            const [monthComplaints, monthResolved] = await Promise.all([
                prisma.complaint.count({
                    where: {
                        createdAt: {
                            gte: monthStart,
                            lte: monthEnd
                        }
                    }
                }),
                prisma.complaint.count({
                    where: {
                        status: "RESOLVED",
                        createdAt: {
                            gte: monthStart,
                            lte: monthEnd
                        }
                    }
                })
            ]);

            monthlyTrends.push({
                month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                complaints: monthComplaints,
                resolved: monthResolved
            });
        }

        // Top users by complaints
        const topUsers = await prisma.user.findMany({
            where: {
                complaints: {
                    some: {
                        createdAt: { gte: startDate }
                    }
                }
            },
            select: {
                username: true,
                name: true,
                _count: {
                    select: {
                        complaints: {
                            where: { createdAt: { gte: startDate } }
                        }
                    }
                }
            },
            orderBy: {
                complaints: {
                    _count: 'desc'
                }
            },
            take: 10
        });

        const topUsersData = topUsers.map(user => ({
            user: user.name || user.username,
            complaints: user._count.complaints
        }));

        return NextResponse.json({
            overview: {
                totalComplaints,
                totalUsers,
                totalMinistries,
                resolvedComplaints,
                pendingComplaints,
                urgentComplaints
            },
            complaintsByStatus,
            complaintsByPriority,
            complaintsByMinistry,
            monthlyTrends,
            topUsers: topUsersData
        });
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return NextResponse.json(
            { error: "Failed to fetch analytics data" },
            { status: 500 }
        );
    }
}
