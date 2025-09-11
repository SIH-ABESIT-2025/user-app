import { Box, Typography, Button } from "@mui/material";
import { getFileUrl } from "@/utilities/storage";
import { ComplaintAttachmentProps } from "@/types/ComplaintProps";

interface MediaDebugProps {
    attachments: ComplaintAttachmentProps[];
}

export default function MediaDebug({ attachments }: MediaDebugProps) {
    const testLocalStorage = async () => {
        try {
            console.log('Testing local storage...');
            console.log('Using local file storage instead of Supabase');
            
            // Test if we can access the uploads directory
            const response = await fetch('/api/upload', {
                method: 'HEAD'
            });
            
            if (response.ok) {
                console.log('Upload API is accessible');
            } else {
                console.log('Upload API returned:', response.status);
            }
        } catch (error) {
            console.error('Storage test error:', error);
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
                const publicUrl = getFileUrl(attachment.fileUrl);
                console.log(`Public URL for ${attachment.fileName}:`, publicUrl);
            } catch (error) {
                console.error(`Error getting URL for ${attachment.fileName}:`, error);
            }
        });
    };

    if (attachments.length === 0) {
        return (
            <Box sx={{ padding: 2, backgroundColor: '#f5f5f5', borderRadius: 1, margin: 2 }}>
                <Typography variant="h6">Media Debug - No Attachments</Typography>
                <Button onClick={testLocalStorage} variant="outlined" sx={{ mt: 1 }}>
                    Test Local Storage
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 2, backgroundColor: '#f5f5f5', borderRadius: 1, margin: 2 }}>
            <Typography variant="h6">Media Debug - {attachments.length} Attachments</Typography>
            
            <Box sx={{ marginTop: 2 }}>
                <Button onClick={testLocalStorage} variant="outlined" sx={{ mr: 1 }}>
                    Test Local Storage
                </Button>
                <Button onClick={testAttachmentUrls} variant="outlined">
                    Test Attachment URLs
                </Button>
            </Box>

            <Box sx={{ marginTop: 2 }}>
                <Typography variant="subtitle2">Attachment Details:</Typography>
                {attachments.map((attachment, index) => {
                    const publicUrl = getFileUrl(attachment.fileUrl);
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
                                <strong>Public URL:</strong> {publicUrl}
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
