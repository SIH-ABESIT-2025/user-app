import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/prisma/client";
import { verifyJwtToken } from "@/utilities/auth";
import { UserProps } from "@/types/UserProps";

export async function GET(request: NextRequest) {
    const startTime = Date.now();
    const requestId = Math.random().toString(36).substr(2, 9);
    
    console.log(`[${requestId}] [COMPLAINTS-GET] Starting request at ${new Date().toISOString()}`);
    
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const ministryId = searchParams.get("ministryId");
        const status = searchParams.get("status");
        const priority = searchParams.get("priority");
        const userId = searchParams.get("userId");

        console.log(`[${requestId}] [COMPLAINTS-GET] Query params:`, {
            page,
            limit,
            ministryId,
            status,
            priority,
            userId,
            url: request.url
        });

        const skip = (page - 1) * limit;

        const where: any = {};
        
        if (ministryId) where.ministryId = ministryId;
        if (status) where.status = status;
        if (priority) where.priority = priority;
        if (userId) where.userId = userId;

        console.log(`[${requestId}] [COMPLAINTS-GET] Prisma where clause:`, where);

        // Test database connection first
        console.log(`[${requestId}] [COMPLAINTS-GET] Testing database connection...`);
        await prisma.$connect();
        console.log(`[${requestId}] [COMPLAINTS-GET] Database connected successfully`);

        console.log(`[${requestId}] [COMPLAINTS-GET] Executing Prisma queries...`);
        const [complaints, total] = await Promise.all([
            prisma.complaint.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
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
                    assignedTo: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                        },
                    },
                    attachments: true,
                    updates: {
                        orderBy: {
                            createdAt: 'desc',
                        },
                        take: 1,
                        include: {
                            updatedBy: {
                                select: {
                                    id: true,
                                    name: true,
                                    username: true,
                                },
                            },
                        },
                    },
                    _count: {
                        select: {
                            comments: true,
                            updates: true,
                        },
                    },
                },
            }),
            prisma.complaint.count({ where }),
        ]);

        console.log(`[${requestId}] [COMPLAINTS-GET] Query results:`, {
            complaintsCount: complaints.length,
            totalCount: total,
            executionTime: Date.now() - startTime
        });

        const response = {
            success: true,
            complaints,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
            debug: {
                requestId,
                executionTime: Date.now() - startTime,
                timestamp: new Date().toISOString()
            }
        };

        console.log(`[${requestId}] [COMPLAINTS-GET] Request completed successfully in ${Date.now() - startTime}ms`);
        return NextResponse.json(response);
    } catch (error) {
        const executionTime = Date.now() - startTime;
        console.error(`[${requestId}] [COMPLAINTS-GET] Error after ${executionTime}ms:`, {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            name: error instanceof Error ? error.name : 'Unknown',
            cause: error instanceof Error ? error.cause : undefined,
            executionTime,
            timestamp: new Date().toISOString()
        });

        const errorResponse = {
            success: false,
            error: "Failed to fetch complaints",
            details: error instanceof Error ? error.message : "Unknown error occurred",
            debug: {
                requestId,
                executionTime,
                errorType: error instanceof Error ? error.constructor.name : 'Unknown',
                timestamp: new Date().toISOString()
            }
        };

        return NextResponse.json(errorResponse, { status: 500 });
    } finally {
        try {
            await prisma.$disconnect();
            console.log(`[${requestId}] [COMPLAINTS-GET] Database disconnected`);
        } catch (disconnectError) {
            console.error(`[${requestId}] [COMPLAINTS-GET] Error disconnecting from database:`, disconnectError);
        }
    }
}

export async function POST(request: NextRequest) {
    const startTime = Date.now();
    const requestId = Math.random().toString(36).substr(2, 9);
    
    console.log(`[${requestId}] [COMPLAINTS-POST] Starting request at ${new Date().toISOString()}`);
    
    try {
        console.log(`[${requestId}] [COMPLAINTS-POST] Getting cookies...`);
        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;
        
        console.log(`[${requestId}] [COMPLAINTS-POST] Token found:`, token ? "Yes" : "No");
        
        let verifiedToken: UserProps | null = null;
        if (token) {
            console.log(`[${requestId}] [COMPLAINTS-POST] Verifying JWT token...`);
            try {
                verifiedToken = await verifyJwtToken(token);
                console.log(`[${requestId}] [COMPLAINTS-POST] Token verified for user:`, verifiedToken?.username);
            } catch (tokenError) {
                console.error(`[${requestId}] [COMPLAINTS-POST] Token verification failed:`, tokenError);
            }
        }

        if (!verifiedToken) {
            console.log(`[${requestId}] [COMPLAINTS-POST] No valid token, returning 401`);
            return NextResponse.json({ 
                success: false,
                error: "You are not authorized to perform this action.",
                debug: {
                    requestId,
                    executionTime: Date.now() - startTime,
                    timestamp: new Date().toISOString()
                }
            }, { status: 401 });
        }

        console.log(`[${requestId}] [COMPLAINTS-POST] Parsing request body...`);
        const body = await request.json();
        const { title, description, location, latitude, longitude, priority, ministryId, attachments } = body;

        console.log(`[${requestId}] [COMPLAINTS-POST] Request body parsed:`, {
            title: title ? `${title.substring(0, 50)}...` : 'No title',
            description: description ? `${description.substring(0, 100)}...` : 'No description',
            location,
            latitude,
            longitude,
            priority,
            ministryId,
            attachmentsCount: attachments?.length || 0
        });

        // Generate complaint number (format: JH-YYYYMMDD-XXXX)
        const now = new Date();
        const dateStr = now.getFullYear().toString() + 
                       (now.getMonth() + 1).toString().padStart(2, '0') + 
                       now.getDate().toString().padStart(2, '0');
        const randomStr = Math.random().toString(36).substr(2, 4).toUpperCase();
        const complaintNumber = `JH-${dateStr}-${randomStr}`;

        console.log(`[${requestId}] [COMPLAINTS-POST] Generated complaint number:`, complaintNumber);

        // Test database connection
        console.log(`[${requestId}] [COMPLAINTS-POST] Testing database connection...`);
        await prisma.$connect();
        console.log(`[${requestId}] [COMPLAINTS-POST] Database connected successfully`);

        console.log(`[${requestId}] [COMPLAINTS-POST] Creating complaint in database...`);
        const complaint = await prisma.complaint.create({
            data: {
                title,
                description,
                location,
                latitude,
                longitude,
                priority,
                ministryId,
                userId: verifiedToken.id,
                complaintNumber,
                attachments: {
                    create: attachments?.map((attachment: any) => ({
                        fileName: attachment.fileName,
                        fileUrl: attachment.fileUrl,
                        fileType: attachment.fileType,
                        fileSize: attachment.fileSize,
                        mimeType: attachment.mimeType,
                    })) || [],
                },
            },
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
                attachments: true,
            },
        });

        console.log(`[${requestId}] [COMPLAINTS-POST] Complaint created with ID:`, complaint.id);

        // Create initial status update
        console.log(`[${requestId}] [COMPLAINTS-POST] Creating initial status update...`);
        await prisma.complaintUpdate.create({
            data: {
                complaintId: complaint.id,
                status: 'SUBMITTED',
                message: 'Complaint has been submitted and is under review.',
                updatedById: verifiedToken.id,
            },
        });

        console.log(`[${requestId}] [COMPLAINTS-POST] Status update created successfully`);

        const response = {
            success: true,
            ...complaint,
            debug: {
                requestId,
                executionTime: Date.now() - startTime,
                timestamp: new Date().toISOString()
            }
        };

        console.log(`[${requestId}] [COMPLAINTS-POST] Request completed successfully in ${Date.now() - startTime}ms`);
        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        const executionTime = Date.now() - startTime;
        console.error(`[${requestId}] [COMPLAINTS-POST] Error after ${executionTime}ms:`, {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            name: error instanceof Error ? error.name : 'Unknown',
            cause: error instanceof Error ? error.cause : undefined,
            executionTime,
            timestamp: new Date().toISOString()
        });

        const errorResponse = {
            success: false,
            error: "Failed to create complaint",
            details: error instanceof Error ? error.message : "Unknown error occurred",
            debug: {
                requestId,
                executionTime,
                errorType: error instanceof Error ? error.constructor.name : 'Unknown',
                timestamp: new Date().toISOString()
            }
        };

        return NextResponse.json(errorResponse, { status: 500 });
    } finally {
        try {
            await prisma.$disconnect();
            console.log(`[${requestId}] [COMPLAINTS-POST] Database disconnected`);
        } catch (disconnectError) {
            console.error(`[${requestId}] [COMPLAINTS-POST] Error disconnecting from database:`, disconnectError);
        }
    }
}
