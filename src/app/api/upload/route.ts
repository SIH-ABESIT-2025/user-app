import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwtToken } from "@/utilities/auth";
import { UserProps } from "@/types/UserProps";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create a Supabase client with service role key for server-side operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

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
        
        // Convert file to buffer
        const fileBuffer = await file.arrayBuffer();
        
        // Upload to Supabase storage using service role key
        const { data, error } = await supabaseAdmin.storage
            .from('primary')
            .upload(fileName, fileBuffer, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Supabase upload error:', error);
            return NextResponse.json({ error: "Upload failed" }, { status: 500 });
        }

        // Return file information
        return NextResponse.json({
            fileName: file.name,
            fileUrl: data.path,
            fileType: file.type,
            fileSize: file.size,
            mimeType: file.type
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
