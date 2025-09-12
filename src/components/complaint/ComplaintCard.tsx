import { useState } from "react";
import { Card, CardContent, CardHeader, Avatar, Chip, Box, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import { FaEllipsisH, FaMapMarkerAlt, FaClock, FaUser, FaBuilding } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

import { ComplaintProps, ComplaintStatus, ComplaintPriority } from "@/types/ComplaintProps";
import { getFullURL } from "@/utilities/misc/getFullURL";
import { getFileUrl } from "@/utilities/storage";
import MediaDisplay from "@/components/misc/MediaDisplay";

interface ComplaintCardProps {
    complaint: ComplaintProps;
    showActions?: boolean;
    onStatusUpdate?: (id: string, status: ComplaintStatus) => void;
    onDelete?: (id: string) => void;
}

export default function ComplaintCard({ complaint, showActions = false, onStatusUpdate, onDelete }: ComplaintCardProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const router = useRouter();

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleCardClick = () => {
        // For unauthenticated users, use the public route
        // For authenticated users, use the authenticated route
        router.push(`/complaints/${complaint.id}`);
    };

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation(); // Prevent card click when clicking menu
        setAnchorEl(event.currentTarget);
    };

    const getStatusColor = (status: ComplaintStatus) => {
        switch (status) {
            case 'SUBMITTED': return '#6c757d';
            case 'UNDER_REVIEW': return '#ffc107';
            case 'IN_PROGRESS': return '#17a2b8';
            case 'RESOLVED': return '#28a745';
            case 'REJECTED': return '#dc3545';
            case 'CLOSED': return '#343a40';
            default: return '#6c757d';
        }
    };

    const getPriorityColor = (priority: ComplaintPriority) => {
        switch (priority) {
            case 'LOW': return '#28a745';
            case 'MEDIUM': return '#ffc107';
            case 'HIGH': return '#fd7e14';
            case 'URGENT': return '#dc3545';
            default: return '#6c757d';
        }
    };

    const formatStatus = (status: ComplaintStatus) => {
        return status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    const getAvatarUrl = (photoUrl?: string) => {
        if (!photoUrl) return "/assets/default-avatar.svg";
        return getFileUrl(photoUrl);
    };

    return (
        <Card 
            sx={{ 
                marginBottom: 2, 
                cursor: 'pointer',
                '&:hover': { 
                    boxShadow: 3,
                    backgroundColor: 'rgba(0, 0, 0, 0.02)'
                },
                transition: 'all 0.2s ease-in-out'
            }}
            onClick={handleCardClick}
        >
            <CardHeader
                avatar={
                    <Avatar
                        src={getAvatarUrl(complaint.user.photoUrl)}
                        alt={complaint.user.name || complaint.user.username}
                    />
                }
                title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="h6" component="span">
                            {complaint.title}
                        </Typography>
                        <Chip
                            label={complaint.complaintNumber}
                            size="small"
                            variant="outlined"
                            color="primary"
                        />
                    </Box>
                }
                subheader={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', marginTop: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <FaUser size={12} />
                            <Typography variant="body2" color="text.secondary">
                                {complaint.user.name || complaint.user.username}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <FaClock size={12} />
                            <Typography variant="body2" color="text.secondary">
                                {formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })}
                            </Typography>
                        </Box>
                    </Box>
                }
                action={
                    showActions && (
                        <IconButton onClick={handleMenuClick}>
                            <FaEllipsisH />
                        </IconButton>
                    )
                }
            />
            <CardContent>
                <Typography variant="body1" paragraph>
                    {complaint.description}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginBottom: 2 }}>
                    <Chip
                        label={formatStatus(complaint.status)}
                        size="small"
                        style={{ backgroundColor: getStatusColor(complaint.status), color: 'white' }}
                    />
                    <Chip
                        label={complaint.priority}
                        size="small"
                        style={{ backgroundColor: getPriorityColor(complaint.priority), color: 'white' }}
                    />
                    <Chip
                        icon={<FaBuilding />}
                        label={complaint.ministry.name}
                        size="small"
                        variant="outlined"
                        color="primary"
                    />
                </Box>

                {complaint.location && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, marginBottom: 1 }}>
                        <FaMapMarkerAlt size={12} color="#6c757d" />
                        <Typography variant="body2" color="text.secondary">
                            {complaint.location}
                        </Typography>
                    </Box>
                )}

                {complaint.attachments.length > 0 && (
                    <Box 
                        sx={{ marginTop: 2 }}
                        onClick={(e) => e.stopPropagation()} // Prevent card click when clicking attachments
                    >
                        <MediaDisplay 
                            attachments={complaint.attachments} 
                            maxDisplay={3}
                        />
                    </Box>
                )}

                {complaint.updates.length > 0 && (
                    <Box sx={{ marginTop: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Last update: {formatDistanceToNow(new Date(complaint.updates[0].createdAt), { addSuffix: true })}
                        </Typography>
                    </Box>
                )}
            </CardContent>

            {showActions && (
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    onClick={(e) => e.stopPropagation()}
                >
                    <MenuItem onClick={(e) => {
                        e.stopPropagation();
                        onStatusUpdate?.(complaint.id, 'UNDER_REVIEW');
                        handleMenuClose();
                    }}>
                        Mark as Under Review
                    </MenuItem>
                    <MenuItem onClick={(e) => {
                        e.stopPropagation();
                        onStatusUpdate?.(complaint.id, 'IN_PROGRESS');
                        handleMenuClose();
                    }}>
                        Mark as In Progress
                    </MenuItem>
                    <MenuItem onClick={(e) => {
                        e.stopPropagation();
                        onStatusUpdate?.(complaint.id, 'RESOLVED');
                        handleMenuClose();
                    }}>
                        Mark as Resolved
                    </MenuItem>
                    <MenuItem onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(complaint.id);
                        handleMenuClose();
                    }} sx={{ color: 'error.main' }}>
                        Delete
                    </MenuItem>
                </Menu>
            )}
        </Card>
    );
}
