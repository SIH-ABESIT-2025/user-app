import { NextResponse, NextRequest } from "next/server";
import { SignJWT } from "jose";

import { prisma } from "@/prisma/client";
import { comparePasswords } from "@/utilities/bcrypt";
import { getJwtSecretKey } from "@/utilities/auth";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    const { username, password } = await request.json();

    try {
        const user = await prisma.user.findFirst({
            where: {
                username: username,
                isActive: true, // Ensure user is active
            },
        });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "Invalid credentials. Please check your username and password.",
            });
        }

        // Check if user has admin privileges
        if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
            return NextResponse.json({
                success: false,
                message: "Access denied. You do not have admin privileges.",
            });
        }

        const isPasswordValid = await comparePasswords(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({
                success: false,
                message: "Invalid credentials. Please check your username and password.",
            });
        }

        const token = await new SignJWT({
            id: user.id,
            username: user.username,
            name: user.name,
            description: user.description,
            location: user.location,
            website: user.website,
            isPremium: user.isPremium,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
            photoUrl: user.photoUrl,
            headerUrl: user.headerUrl,
        })
            .setProtectedHeader({
                alg: "HS256",
            })
            .setIssuedAt()
            .setExpirationTime("1d")
            .sign(getJwtSecretKey());

        const response = NextResponse.json({
            success: true,
            message: "Login successful!",
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                role: user.role,
                isActive: user.isActive,
            }
        });

        response.cookies.set({
            name: "token",
            value: token,
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return response;
    } catch (error: unknown) {
        console.error("Admin login error:", error);
        return NextResponse.json({ 
            success: false, 
            message: "An unexpected error occurred. Please try again later.",
            error: process.env.NODE_ENV === "development" ? error : undefined
        }, { status: 500 });
    }
}
