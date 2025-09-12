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
            totalMinistries,
            // Current month data
            currentMonthMinistries,
            // Previous month data
            previousMonthMinistries
        ] = await Promise.all([
            prisma.ministry.count(),
            // Current month
            prisma.ministry.count({
                where: {
                    createdAt: { gte: currentMonth }
                }
            }),
            // Previous month
            prisma.ministry.count({
                where: {
                    createdAt: { 
                        gte: previousMonth,
                        lte: previousMonthEnd
                    }
                }
            })
        ]);

        // Calculate ministry trend
        const ministriesTrend = previousMonthMinistries > 0 
            ? Math.round(((currentMonthMinistries - previousMonthMinistries) / previousMonthMinistries) * 100)
            : currentMonthMinistries > 0 ? 100 : 0;

        return NextResponse.json({
            total: totalMinistries,
            trends: {
                ministries: ministriesTrend
            },
            monthly: {
                current: {
                    ministries: currentMonthMinistries
                },
                previous: {
                    ministries: previousMonthMinistries
                }
            }
        });
    } catch (error) {
        console.error("Error fetching ministry stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch ministry statistics" },
            { status: 500 }
        );
    }
}
