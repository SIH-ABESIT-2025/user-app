import { Box, Typography, Button } from "@mui/material";
import { supabase } from "@/utilities/storage";
import { ComplaintAttachmentProps } from "@/types/ComplaintProps";

interface MediaDebugProps {
    attachments: ComplaintAttachmentProps[];
}

export default function MediaDebug({ attachments }: MediaDebugProps) {
    const testSupabaseConnection = async () => {
        try {
            console.log('Testing Supabase connection...');
            console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
            console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_KEY ? 'Present' : 'Missing');
            
            // Test listing files in the primary bucket
            const { data, error } = await supabase.storage
                .from('primary')
                .list('', { limit: 5 });
            
            if (error) {
                console.error('Supabase storage error:', error);
            } else {
                console.log('Files in primary bucket:', data);
            }
        } catch (error) {
            console.error('Connection test error:', error);
        }
    };

    const testAttachmentUrls = () => {
        console.log('Testing attachment URLs...');
        attachments.forEach((attachment, index) => {
            console.log(`Attachment ${index + 1}:`, {
                fileName: attachment.fileName,
                fileUrl: attachment.fileUrl,
                mimeType: attachment.mimeType
            });
            
            try {
                const { data } = supabase.storage.from("primary").getPublicUrl(attachment.fileUrl);
                console.log(`Public URL for ${attachment.fileName}:`, data.publicUrl);
            } catch (error) {
                console.error(`Error getting URL for ${attachment.fileName}:`, error);
            }
        });
    };

    if (attachments.length === 0) {
        return (
            <Box sx={{ padding: 2, backgroundColor: '#f5f5f5', borderRadius: 1, margin: 2 }}>
                <Typography variant="h6">Media Debug - No Attachments</Typography>
                <Button onClick={testSupabaseConnection} variant="outlined" sx={{ mt: 1 }}>
                    Test Supabase Connection
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 2, backgroundColor: '#f5f5f5', borderRadius: 1, margin: 2 }}>
            <Typography variant="h6">Media Debug - {attachments.length} Attachments</Typography>
            
            <Box sx={{ marginTop: 2 }}>
                <Button onClick={testSupabaseConnection} variant="outlined" sx={{ mr: 1 }}>
                    Test Supabase Connection
                </Button>
                <Button onClick={testAttachmentUrls} variant="outlined">
                    Test Attachment URLs
                </Button>
            </Box>

            <Box sx={{ marginTop: 2 }}>
                <Typography variant="subtitle2">Attachment Details:</Typography>
                {attachments.map((attachment, index) => {
                    const { data } = supabase.storage.from("primary").getPublicUrl(attachment.fileUrl);
                    return (
                        <Box key={index} sx={{ marginTop: 1, padding: 1, backgroundColor: 'white', borderRadius: 1 }}>
                            <Typography variant="body2">
                                <strong>File:</strong> {attachment.fileName}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Path:</strong> {attachment.fileUrl}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Type:</strong> {attachment.mimeType}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Public URL:</strong> {data.publicUrl}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Size:</strong> {attachment.fileSize} bytes
                            </Typography>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}
