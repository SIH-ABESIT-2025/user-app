import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!URL || !KEY) throw new Error("Supabase credentials are not provided.");

export const supabase = createClient(URL, KEY);

// Client-side upload function that uses the API route for security
export const uploadFile = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Upload failed');
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Upload error:', error);
        return null;
    }
};

// Direct Supabase upload (for cases where RLS is properly configured)
export const uploadFileDirect = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from("primary").upload(fileName, file);
    if (error) {
        console.error('Upload error:', error);
        return null;
    }
    return {
        fileName: file.name,
        fileUrl: data.path,
        fileType: file.type,
        fileSize: file.size,
        mimeType: file.type
    };
};
