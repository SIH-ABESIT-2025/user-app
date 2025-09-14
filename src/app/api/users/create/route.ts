import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

import { prisma } from "@/prisma/client";
import { hashPassword } from "@/utilities/bcrypt";
import { getJwtSecretKey } from "@/utilities/auth";

export async function POST(request: NextRequest) {
    const userData = await request.json();
    const hashedPassword = await hashPassword(userData.password);
    const secret = process.env.CREATION_SECRET_KEY;

    if (!secret) {
        return NextResponse.json({
            success: false,
            message: "Secret key not found.",
        });
    }

    try {
        const userExists = await prisma.user.findUnique({
            where: {
                username: userData.username,
            },
        });

        if (userExists) {
            return NextResponse.json({
                success: false,
                message: "Username already exists.",
            });
        }

        const newUser = await prisma.user.create({
            data: {
                username: userData.username,
                password: hashedPassword,
                phoneNumber: userData.phoneNumber,
                email: userData.email,
            },
        });

        // Create welcome notification directly instead of using fetch
        try {
            await prisma.notification.create({
                data: {
                    user: {
                        connect: {
                            username: newUser.username,
                        },
                    },
                    type: "welcome",
                    content: JSON.stringify({
                        message: "Welcome to Jharkhand Civic Reporting Platform!",
                        action: "Get started by reporting your first civic issue."
                    }),
                },
            });
        } catch (notificationError) {
            console.error("Failed to create welcome notification:", notificationError);
            // Don't fail the user creation if notification fails
        }

        const token = await new SignJWT({
            id: newUser.id,
            username: newUser.username,
            phoneNumber: newUser.phoneNumber,
            email: newUser.email,
            name: newUser.name,
            description: newUser.description,
            location: newUser.location,
            website: newUser.website,
            isPremium: newUser.isPremium,
            createdAt: newUser.createdAt,
            photoUrl: newUser.photoUrl,
            headerUrl: newUser.headerUrl,
        })
            .setProtectedHeader({
                alg: "HS256",
            })
            .setIssuedAt()
            .setExpirationTime("1d")
            .sign(getJwtSecretKey());

        const response = NextResponse.json({
            success: true,
        });
        response.cookies.set({
            name: "token",
            value: token,
            path: "/",
        });

        return response;
    } catch (error: unknown) {
        console.error("User creation error:", error);
        return NextResponse.json({ 
            success: false, 
            error: error instanceof Error ? error.message : "Unknown error occurred",
            details: process.env.NODE_ENV === "development" ? error : undefined
        });
    }
}
