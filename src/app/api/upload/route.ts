import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwtToken } from "@/utilities/auth";
import { UserProps } from "@/types/UserProps";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
    try {
        // Verify authentication
        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;
        const verifiedToken: UserProps = token && (await verifyJwtToken(token));

        if (!verifiedToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Parse the form data
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Validate file size (50MB limit)
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
            return NextResponse.json({ error: "File too large. Maximum size is 50MB." }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = [
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
            'video/mp4', 'video/webm', 'video/ogg',
            'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mpeg',
            'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain', 'text/csv'
        ];

        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
        }

        // Generate unique filename
        const fileName = `${Date.now()}-${file.name}`;
        
        // Create uploads directory if it doesn't exist
        const uploadsDir = join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadsDir, { recursive: true });
        
        // Convert file to buffer
        const fileBuffer = await file.arrayBuffer();
        
        // Save file to local storage
        const filePath = join(uploadsDir, fileName);
        await writeFile(filePath, Buffer.from(fileBuffer));

        // Return file information
        return NextResponse.json({
            fileName: file.name,
            fileUrl: `/uploads/${fileName}`,
            fileType: file.type,
            fileSize: file.size,
            mimeType: file.type
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
