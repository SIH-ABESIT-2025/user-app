import { useState } from "react";
import { Box, Typography, IconButton, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { FaPlay, FaPause, FaVolumeUp, FaDownload, FaExpand } from "react-icons/fa";
import Image from "next/image";
import { ComplaintAttachmentProps } from "@/types/ComplaintProps";
import { getFileUrl } from "@/utilities/storage";

interface MediaDisplayProps {
    attachments: ComplaintAttachmentProps[];
    maxDisplay?: number;
    showAll?: boolean;
}

export default function MediaDisplay({ attachments, maxDisplay = 3, showAll = false }: MediaDisplayProps) {
    const [selectedMedia, setSelectedMedia] = useState<ComplaintAttachmentProps | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const getPublicUrl = (fileUrl: string) => {
        return getFileUrl(fileUrl);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleMediaClick = (attachment: ComplaintAttachmentProps) => {
        setSelectedMedia(attachment);
        setIsPlaying(false);
    };

    const handleDownload = async (attachment: ComplaintAttachmentProps) => {
        try {
            const url = getFileUrl(attachment.fileUrl);
            const link = document.createElement('a');
            link.href = url;
            link.download = attachment.fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    const displayAttachments = showAll ? attachments : attachments.slice(0, maxDisplay);
    const remainingCount = attachments.length - maxDisplay;

    if (attachments.length === 0) return null;

    return (
        <Box sx={{ marginTop: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {displayAttachments.map((attachment, index) => {
                    const publicUrl = getPublicUrl(attachment.fileUrl);
                    const isImage = attachment.mimeType.startsWith('image/');
                    const isVideo = attachment.mimeType.startsWith('video/');
                    const isAudio = attachment.mimeType.startsWith('audio/');

                    return (
                        <Box
                            key={index}
                            sx={{
                                position: 'relative',
                                cursor: 'pointer',
                                borderRadius: 2,
                                overflow: 'hidden',
                                border: '1px solid #e0e0e0',
                                '&:hover': {
                                    boxShadow: 2,
                                    transform: 'scale(1.02)',
                                    transition: 'all 0.2s ease-in-out'
                                }
                            }}
                            onClick={() => handleMediaClick(attachment)}
                        >
                            {isImage ? (
                                <Box sx={{ width: 200, height: 150, position: 'relative' }}>
                                    <Image
                                        src={publicUrl}
                                        alt={attachment.fileName}
                                        fill
                                        style={{
                                            objectFit: 'cover'
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 4,
                                            right: 4,
                                            backgroundColor: 'rgba(0,0,0,0.7)',
                                            borderRadius: 1,
                                            padding: 0.5
                                        }}
                                    >
                                        <FaExpand size={12} color="white" />
                                    </Box>
                                </Box>
                            ) : isVideo ? (
                                <Box sx={{ width: 200, height: 150, position: 'relative' }}>
                                    <video
                                        src={publicUrl}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                        muted
                                    />
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            backgroundColor: 'rgba(0,0,0,0.7)',
                                            borderRadius: '50%',
                                            width: 50,
                                            height: 50,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <FaPlay size={20} color="white" />
                                    </Box>
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 4,
                                            right: 4,
                                            backgroundColor: 'rgba(0,0,0,0.7)',
                                            borderRadius: 1,
                                            padding: 0.5
                                        }}
                                    >
                                        <FaExpand size={12} color="white" />
                                    </Box>
                                </Box>
                            ) : isAudio ? (
                                <Box
                                    sx={{
                                        width: 200,
                                        height: 150,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#f5f5f5',
                                        gap: 1
                                    }}
                                >
                                    <FaVolumeUp size={32} color="#666" />
                                    <Typography variant="body2" sx={{ textAlign: 'center', px: 1, fontWeight: 'bold' }}>
                                        {attachment.fileName}
                                    </Typography>
                                    <Typography variant="caption" sx={{ textAlign: 'center', px: 1 }}>
                                        {formatFileSize(attachment.fileSize)}
                                    </Typography>
                                </Box>
                            ) : (
                                <Box
                                    sx={{
                                        width: 200,
                                        height: 150,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#f5f5f5',
                                        gap: 1
                                    }}
                                >
                                    <Typography variant="h3">📄</Typography>
                                    <Typography variant="body2" sx={{ textAlign: 'center', px: 1, fontWeight: 'bold' }}>
                                        {attachment.fileName}
                                    </Typography>
                                    <Typography variant="caption" sx={{ textAlign: 'center', px: 1 }}>
                                        {formatFileSize(attachment.fileSize)}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    );
                })}
                
                {!showAll && remainingCount > 0 && (
                    <Box
                        sx={{
                            width: 200,
                            height: 150,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f0f0f0',
                            borderRadius: 2,
                            border: '1px solid #e0e0e0',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: '#e0e0e0'
                            }
                        }}
                        onClick={() => setSelectedMedia(null)} // This will show all media
                    >
                        <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                            +{remainingCount} more
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Media Preview Dialog */}
            <Dialog
                open={!!selectedMedia}
                onClose={() => setSelectedMedia(null)}
                maxWidth="md"
                fullWidth
            >
                {selectedMedia && (
                    <>
                        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6">{selectedMedia.fileName}</Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton
                                    onClick={() => handleDownload(selectedMedia)}
                                    size="small"
                                >
                                    <FaDownload />
                                </IconButton>
                                <IconButton
                                    onClick={() => setSelectedMedia(null)}
                                    size="small"
                                >
                                    ×
                                </IconButton>
                            </Box>
                        </DialogTitle>
                        <DialogContent>
                            {selectedMedia.mimeType.startsWith('image/') && (
                                <Box sx={{ position: 'relative', width: '100%', height: '70vh' }}>
                                    <Image
                                        src={getPublicUrl(selectedMedia.fileUrl)}
                                        alt={selectedMedia.fileName}
                                        fill
                                        style={{
                                            objectFit: 'contain'
                                        }}
                                    />
                                </Box>
                            )}
                            {selectedMedia.mimeType.startsWith('video/') && (
                                <video
                                    src={getPublicUrl(selectedMedia.fileUrl)}
                                    controls
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        maxHeight: '70vh'
                                    }}
                                />
                            )}
                            {selectedMedia.mimeType.startsWith('audio/') && (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Box sx={{ marginBottom: 2 }}>
                                        <FaVolumeUp size={48} color="#666" />
                                    </Box>
                                    <Typography variant="h6" gutterBottom>
                                        {selectedMedia.fileName}
                                    </Typography>
                                    <audio
                                        src={getPublicUrl(selectedMedia.fileUrl)}
                                        controls
                                        style={{ width: '100%', marginTop: 2 }}
                                    />
                                </Box>
                            )}
                            {!selectedMedia.mimeType.startsWith('image/') && 
                             !selectedMedia.mimeType.startsWith('video/') && 
                             !selectedMedia.mimeType.startsWith('audio/') && (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography variant="h4" gutterBottom>📄</Typography>
                                    <Typography variant="h6" gutterBottom>
                                        {selectedMedia.fileName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {formatFileSize(selectedMedia.fileSize)}
                                    </Typography>
                                    <IconButton
                                        onClick={() => handleDownload(selectedMedia)}
                                        size="large"
                                        sx={{ mt: 2 }}
                                    >
                                        <FaDownload size={24} />
                                    </IconButton>
                                </Box>
                            )}
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </Box>
    );
}
