import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { verifyJwtToken } from "@/utilities/auth";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        // Admin authentication removed - API is now accessible without login

        // Get current date and calculate previous month
        const now = new Date();
        const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        const [
            totalComplaints,
            resolvedComplaints,
            pendingComplaints,
            urgentComplaints,
            recentComplaints,
            // Current month data
            currentMonthComplaints,
            currentMonthResolved,
            // Previous month data
            previousMonthComplaints,
            previousMonthResolved
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
            }),
            // Current month
            prisma.complaint.count({
                where: {
                    createdAt: { gte: currentMonth }
                }
            }),
            prisma.complaint.count({
                where: {
                    status: "RESOLVED",
                    createdAt: { gte: currentMonth }
                }
            }),
            // Previous month
            prisma.complaint.count({
                where: {
                    createdAt: { 
                        gte: previousMonth,
                        lte: previousMonthEnd
                    }
                }
            }),
            prisma.complaint.count({
                where: {
                    status: "RESOLVED",
                    createdAt: { 
                        gte: previousMonth,
                        lte: previousMonthEnd
                    }
                }
            })
        ]);

        // Calculate trends
        const complaintsTrend = previousMonthComplaints > 0 
            ? Math.round(((currentMonthComplaints - previousMonthComplaints) / previousMonthComplaints) * 100)
            : currentMonthComplaints > 0 ? 100 : 0;

        const resolvedTrend = previousMonthResolved > 0 
            ? Math.round(((currentMonthResolved - previousMonthResolved) / previousMonthResolved) * 100)
            : currentMonthResolved > 0 ? 100 : 0;

        const resolutionRate = totalComplaints > 0 
            ? Math.round((resolvedComplaints / totalComplaints) * 100)
            : 0;

        const previousResolutionRate = (previousMonthComplaints - previousMonthResolved) > 0 
            ? Math.round((previousMonthResolved / previousMonthComplaints) * 100)
            : 0;

        const resolutionTrend = previousResolutionRate > 0 
            ? Math.round(((resolutionRate - previousResolutionRate) / previousResolutionRate) * 100)
            : resolutionRate > 0 ? 100 : 0;

        return NextResponse.json({
            total: totalComplaints,
            resolved: resolvedComplaints,
            pending: pendingComplaints,
            urgent: urgentComplaints,
            recent: recentComplaints,
            trends: {
                complaints: complaintsTrend,
                resolved: resolvedTrend,
                resolutionRate: resolutionTrend
            },
            monthly: {
                current: {
                    complaints: currentMonthComplaints,
                    resolved: currentMonthResolved
                },
                previous: {
                    complaints: previousMonthComplaints,
                    resolved: previousMonthResolved
                }
            }
        });
    } catch (error) {
        console.error("Error fetching complaint stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch complaint statistics" },
            { status: 500 }
        );
    }
}
