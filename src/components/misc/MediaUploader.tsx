import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography, IconButton, Chip, Button } from "@mui/material";
import { FaTimes, FaFileImage, FaFileVideo, FaFileAudio, FaFileAlt } from "react-icons/fa";

interface MediaUploaderProps {
    handleMediaChange: (files: File[]) => void;
    onClose: () => void;
    acceptedTypes?: string[];
    maxFiles?: number;
    maxSize?: number; // in MB
}

export default function MediaUploader({ 
    handleMediaChange, 
    onClose, 
    acceptedTypes = ["image/*", "video/*", "audio/*"],
    maxFiles = 10,
    maxSize = 50
}: MediaUploaderProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [errors, setErrors] = useState<string[]>([]);

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
        const newErrors: string[] = [];
        
        // Handle rejected files
        rejectedFiles.forEach(({ file, errors }) => {
            errors.forEach((error: any) => {
                if (error.code === 'file-too-large') {
                    newErrors.push(`${file.name} is too large. Maximum size is ${maxSize}MB.`);
                } else if (error.code === 'file-invalid-type') {
                    newErrors.push(`${file.name} has an invalid file type.`);
                } else if (error.code === 'too-many-files') {
                    newErrors.push(`Too many files. Maximum ${maxFiles} files allowed.`);
                }
            });
        });

        setErrors(newErrors);

        // Add accepted files
        const updatedFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
        setFiles(updatedFiles);
        handleMediaChange(updatedFiles);
    }, [files, handleMediaChange, maxFiles, maxSize]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: acceptedTypes.reduce((acc, type) => {
            acc[type] = [];
            return acc;
        }, {} as Record<string, string[]>),
        maxFiles,
        maxSize: maxSize * 1024 * 1024, // Convert MB to bytes
    });

    const removeFile = (index: number) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        handleMediaChange(updatedFiles);
    };

    const getFileIcon = (file: File) => {
        if (file.type.startsWith('image/')) return <FaFileImage />;
        if (file.type.startsWith('video/')) return <FaFileVideo />;
        if (file.type.startsWith('audio/')) return <FaFileAudio />;
        return <FaFileAlt />;
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <Box className="media-uploader">
            <Box className="media-uploader-header">
                <Typography variant="h6">Upload Media Files</Typography>
                <IconButton onClick={onClose} size="small">
                    <FaTimes />
                </IconButton>
            </Box>

            <Box
                {...getRootProps()}
                className={`dropzone ${isDragActive ? 'active' : ''}`}
                sx={{
                    border: '2px dashed #ccc',
                    borderRadius: 2,
                    padding: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: isDragActive ? '#f5f5f5' : 'transparent',
                    transition: 'background-color 0.2s',
                    marginBottom: 2,
                }}
            >
                <input {...getInputProps()} />
                <Typography variant="body1" color="text.secondary">
                    {isDragActive
                        ? 'Drop the files here...'
                        : 'Drag & drop files here, or click to select files'
                    }
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                    Accepted types: Images, Videos, Audio, Documents
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Max {maxFiles} files, {maxSize}MB each
                </Typography>
            </Box>

            {errors.length > 0 && (
                <Box sx={{ marginBottom: 2 }}>
                    {errors.map((error, index) => (
                        <Chip
                            key={index}
                            label={error}
                            color="error"
                            size="small"
                            sx={{ margin: 0.5 }}
                        />
                    ))}
                </Box>
            )}

            {files.length > 0 && (
                <Box>
                    <Typography variant="subtitle2" sx={{ marginBottom: 1 }}>
                        Selected Files ({files.length}/{maxFiles}):
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {files.map((file, index) => (
                            <Chip
                                key={index}
                                icon={getFileIcon(file)}
                                label={`${file.name} (${formatFileSize(file.size)})`}
                                onDelete={() => removeFile(index)}
                                color="primary"
                                variant="outlined"
                            />
                        ))}
                    </Box>
                </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                <Button onClick={onClose} variant="outlined">
                    Done
                </Button>
            </Box>
        </Box>
    );
}
