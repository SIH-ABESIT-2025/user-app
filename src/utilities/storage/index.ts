// Local file storage utilities
export const getFileUrl = (fileUrl: string) => {
    // If it's already a full URL, return as is
    if (fileUrl.startsWith('http')) {
        return fileUrl;
    }
    // For local files, return the path as is (will be served by Next.js)
    return fileUrl;
};

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

// Legacy function for compatibility - now just calls uploadFile
export const uploadFileDirect = async (file: File) => {
    return await uploadFile(file);
};
