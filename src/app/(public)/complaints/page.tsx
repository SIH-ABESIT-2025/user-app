"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
    Box, 
    Typography, 
    Button, 
    Grid, 
    Card, 
    CardContent, 
    Chip, 
    Avatar, 
    IconButton,
    Tooltip,
    Alert,
    CircularProgress,
    Tabs,
    Tab,
    Fab,
    Badge,
    Paper,
    Divider
} from "@mui/material";
import { 
    FaExclamationTriangle, 
    FaMapMarkerAlt, 
    FaClock, 
    FaBuilding, 
    FaUser, 
    FaSignInAlt,
    FaPlus,
    FaSun,
    FaMoon,
    FaList,
    FaMap,
    FaFilter,
    FaPaperclip,
    FaEye,
    FaDownload
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

import { useInfiniteComplaints } from "@/hooks/useInfiniteComplaints";
import InfiniteScroll from "@/components/misc/InfiniteScroll";
import NothingToShow from "@/components/misc/NothingToShow";
import CitizenAuthDialog from "@/components/dialog/CitizenAuthDialog";
import { ComplaintProps } from "@/types/ComplaintProps";
import { getFileUrl } from "@/utilities/storage";
import { useTheme } from "@/contexts/ThemeContext";
import DynamicMap from "@/components/map/DynamicMap";

const getStatusColor = (status: string) => {
    switch (status) {
        case "SUBMITTED": return "#6c757d";
        case "UNDER_REVIEW": return "#ffc107";
        case "IN_PROGRESS": return "#17a2b8";
        case "RESOLVED": return "#28a745";
        case "REJECTED": return "#dc3545";
        case "CLOSED": return "#343a40";
        default: return "#6c757d";
    }
};

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case "LOW": return "#28a745";
        case "MEDIUM": return "#ffc107";
        case "HIGH": return "#fd7e14";
        case "URGENT": return "#dc3545";
        default: return "#6c757d";
    }
};

const getAvatarUrl = (photoUrl?: string) => {
    if (!photoUrl) return "/assets/egg.jpg";
    return getFileUrl(photoUrl);
};

export default function PublicComplaintsPage() {
    const router = useRouter();
    const { theme, toggleTheme, isDark } = useTheme();
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [filters, setFilters] = useState({
        ministry: "",
        status: "",
        priority: ""
    });
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>();

    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteComplaints({ filters, enabled: true });

    // Get user location for map
    useEffect(() => {
        if (navigator.geolocation && viewMode === 'map') {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        }
    }, [viewMode]);

    const handleComplaintClick = (complaintId: string) => {
        router.push(`/complaints/details/${complaintId}`);
    };

    const handleReportIssue = () => {
        setIsAuthDialogOpen(true);
    };

    const handleSignIn = () => {
        setIsAuthDialogOpen(true);
    };

    const handleViewModeChange = (event: React.SyntheticEvent, newValue: 'list' | 'map') => {
        setViewMode(newValue);
    };

    if (isLoading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '100vh',
                flexDirection: 'column',
                gap: 2,
                backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa'
            }}>
                <CircularProgress size={60} sx={{ color: 'var(--gov-primary)' }} />
                <Typography variant="h6" sx={{ color: isDark ? '#ffffff' : '#6c757d' }}>
                    Loading complaints...
                </Typography>
            </Box>
        );
    }

    if (isError) {
        return (
            <Box sx={{ 
                padding: 3, 
                backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa',
                minHeight: '100vh'
            }}>
                <Alert severity="error" sx={{ marginBottom: 2 }}>
                    Failed to load complaints. Please try again later.
                </Alert>
            </Box>
        );
    }

    // Flatten all pages of complaints
    const complaints: ComplaintProps[] = data?.pages.flatMap(page => page.complaints) || [];
    const complaintsWithLocation = complaints.filter(complaint => 
        complaint.latitude && complaint.longitude
    );

    return (
        <Box sx={{ 
            minHeight: "100vh", 
            backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa',
            transition: 'background-color 0.3s ease'
        }}>
            {/* Modern Header */}
            <Paper elevation={3} sx={{ 
                position: "sticky",
                top: 0,
                zIndex: 1000,
                backgroundColor: isDark ? '#2d2d2d' : '#ffffff',
                borderBottom: `1px solid ${isDark ? '#404040' : '#dee2e6'}`,
                transition: 'all 0.3s ease'
            }}>
                <Box sx={{ 
                    padding: 3,
                    maxWidth: "1400px",
                    margin: "0 auto"
                }}>
                    <Box sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 2
                    }}>
                        {/* Logo and Title */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Image 
                                src="/assets/favicon.png" 
                                alt="Jharkhand Government" 
                                width={50} 
                                height={50} 
                            />
                            <Box>
                                <Typography 
                                    variant="h4" 
                                    sx={{ 
                                        fontWeight: "bold",
                                        color: isDark ? '#ffffff' : '#212529',
                                        transition: 'color 0.3s ease'
                                    }}
                                >
                                    Government of Jharkhand
                                </Typography>
                                <Typography 
                                    variant="subtitle1" 
                                    sx={{ 
                                        opacity: 0.8,
                                        color: isDark ? '#b3b3b3' : '#6c757d',
                                        transition: 'color 0.3s ease'
                                    }}
                                >
                                    Civic Complaints Portal
                                </Typography>
                            </Box>
                        </Box>

                        {/* Action Buttons */}
                        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                            {/* Theme Toggle */}
                            <Tooltip title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
                                <IconButton 
                                    onClick={toggleTheme}
                                    sx={{ 
                                        color: isDark ? '#ffffff' : '#6c757d',
                                        transition: 'color 0.3s ease'
                                    }}
                                >
                                    {isDark ? <FaSun /> : <FaMoon />}
                                </IconButton>
                            </Tooltip>

                            {/* View Mode Toggle */}
                            <Tabs 
                                value={viewMode} 
                                onChange={handleViewModeChange}
                                sx={{ minHeight: 'auto' }}
                            >
                                <Tab 
                                    icon={<FaList />} 
                                    value="list"
                                    sx={{ minHeight: 'auto', padding: '8px 16px' }}
                                />
                                <Tab 
                                    icon={<FaMap />} 
                                    value="map"
                                    sx={{ minHeight: 'auto', padding: '8px 16px' }}
                                />
                            </Tabs>

                            <Divider orientation="vertical" flexItem />

                            <Button 
                                variant="outlined" 
                                startIcon={<FaSignInAlt />}
                                onClick={handleSignIn}
                                sx={{ 
                                    borderColor: 'var(--gov-primary)',
                                    color: 'var(--gov-primary)',
                                    '&:hover': { 
                                        borderColor: 'var(--gov-primary-dark)',
                                        backgroundColor: 'rgba(0, 123, 255, 0.1)'
                                    }
                                }}
                            >
                                Sign In
                            </Button>
                            <Button 
                                variant="contained" 
                                startIcon={<FaPlus />}
                                onClick={handleReportIssue}
                                sx={{ 
                                    backgroundColor: 'var(--gov-primary)',
                                    '&:hover': { backgroundColor: 'var(--gov-primary-dark)' }
                                }}
                            >
                                Report Issue
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Paper>

            {/* Main Content */}
            <Box sx={{ 
                padding: 3, 
                maxWidth: "1400px", 
                margin: "0 auto",
                transition: 'padding 0.3s ease'
            }}>
                {/* Stats and Info */}
                <Box sx={{ marginBottom: 4 }}>
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2,
                        marginBottom: 2
                    }}>
                        <Box>
                            <Typography 
                                variant="h4" 
                                sx={{ 
                                    fontWeight: "bold", 
                                    marginBottom: 1,
                                    color: isDark ? '#ffffff' : '#212529',
                                    transition: 'color 0.3s ease'
                                }}
                            >
                                Civic Complaints
                            </Typography>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    color: 'var(--gov-primary)',
                                    fontWeight: 'bold'
                                }}
                            >
                                {complaints.length} Total • {complaintsWithLocation.length} with Location
                            </Typography>
                        </Box>
                        
                        <Alert 
                            severity="info" 
                            sx={{ 
                                maxWidth: 400,
                                backgroundColor: isDark ? '#1e3a5f' : '#e3f2fd',
                                color: isDark ? '#ffffff' : '#1976d2',
                                border: `1px solid ${isDark ? '#2d5aa0' : '#bbdefb'}`
                            }}
                            action={
                                <Button 
                                    color="inherit" 
                                    size="small" 
                                    onClick={handleSignIn}
                                    startIcon={<FaSignInAlt />}
                                >
                                    Sign In
                                </Button>
                            }
                        >
                            Viewing as guest. Sign in for full access.
                        </Alert>
                    </Box>
                </Box>

                {/* Content Based on View Mode */}
                {viewMode === 'list' ? (
                    /* List View */
                    complaints.length === 0 ? (
                        <NothingToShow 
                            type="complaints" 
                            message="No complaints found. Be the first to report an issue!" 
                        />
                    ) : (
                        <InfiniteScroll
                            hasNextPage={hasNextPage || false}
                            isFetchingNextPage={isFetchingNextPage}
                            fetchNextPage={fetchNextPage}
                            loadingText="Loading more complaints..."
                            endText="You've reached the end of the complaints list."
                        >
                            <Grid container spacing={3}>
                                {complaints.map((complaint) => (
                                    <Grid item xs={12} md={6} lg={4} key={complaint.id}>
                                        <Card 
                                            sx={{ 
                                                cursor: "pointer",
                                                height: '100%',
                                                backgroundColor: isDark ? '#2d2d2d' : '#ffffff',
                                                border: `1px solid ${isDark ? '#404040' : '#dee2e6'}`,
                                                transition: "all 0.3s ease",
                                                "&:hover": {
                                                    transform: "translateY(-4px)",
                                                    boxShadow: isDark 
                                                        ? "0 12px 32px rgba(0,0,0,0.4)" 
                                                        : "0 12px 32px rgba(0,0,0,0.15)",
                                                    borderColor: 'var(--gov-primary)'
                                                }
                                            }}
                                            onClick={() => handleComplaintClick(complaint.id)}
                                        >
                                            <CardContent sx={{ padding: 3 }}>
                                                {/* Header */}
                                                <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
                                                    <Avatar 
                                                        src={getAvatarUrl(complaint.user.photoUrl)}
                                                        alt={complaint.user.name || complaint.user.username}
                                                        sx={{ width: 48, height: 48 }}
                                                    />
                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                        <Typography 
                                                            variant="h6" 
                                                            sx={{ 
                                                                fontWeight: "bold", 
                                                                marginBottom: 0.5,
                                                                color: isDark ? '#ffffff' : '#212529',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap'
                                                            }}
                                                        >
                                                            {complaint.title}
                                                        </Typography>
                                                        <Typography 
                                                            variant="body2" 
                                                            sx={{ 
                                                                color: isDark ? '#b3b3b3' : '#6c757d',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap'
                                                            }}
                                                        >
                                                            {complaint.user.name || complaint.user.username}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                {/* Status Chips */}
                                                <Box sx={{ display: "flex", gap: 1, marginBottom: 2, flexWrap: "wrap" }}>
                                                    <Chip
                                                        label={complaint.status.replace('_', ' ')}
                                                        size="small"
                                                        sx={{ 
                                                            backgroundColor: getStatusColor(complaint.status),
                                                            color: "white",
                                                            fontWeight: "bold",
                                                            fontSize: '0.75rem'
                                                        }}
                                                    />
                                                    <Chip
                                                        label={complaint.priority}
                                                        size="small"
                                                        sx={{ 
                                                            backgroundColor: getPriorityColor(complaint.priority),
                                                            color: "white",
                                                            fontWeight: "bold",
                                                            fontSize: '0.75rem'
                                                        }}
                                                    />
                                                </Box>

                                                {/* Description */}
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        marginBottom: 2,
                                                        color: isDark ? '#e0e0e0' : '#495057',
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 3,
                                                        WebkitBoxOrient: "vertical",
                                                        overflow: "hidden",
                                                        lineHeight: 1.5
                                                    }}
                                                >
                                                    {complaint.description}
                                                </Typography>

                                                {/* Attachments Indicator */}
                                                {complaint.attachments && complaint.attachments.length > 0 && (
                                                    <Box sx={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        gap: 0.5, 
                                                        marginBottom: 2,
                                                        color: 'var(--gov-primary)'
                                                    }}>
                                                        <FaPaperclip size={12} />
                                                        <Typography variant="caption">
                                                            {complaint.attachments.length} attachment{complaint.attachments.length > 1 ? 's' : ''}
                                                        </Typography>
                                                    </Box>
                                                )}

                                                {/* Footer Info */}
                                                <Box sx={{ 
                                                    display: "flex", 
                                                    gap: 2, 
                                                    alignItems: "center", 
                                                    flexWrap: "wrap",
                                                    paddingTop: 1,
                                                    borderTop: `1px solid ${isDark ? '#404040' : '#dee2e6'}`
                                                }}>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                        <FaBuilding size={12} color="var(--gov-primary)" />
                                                        <Typography 
                                                            variant="caption" 
                                                            sx={{ 
                                                                color: isDark ? '#b3b3b3' : '#6c757d',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                                maxWidth: 100
                                                            }}
                                                        >
                                                            {complaint.ministry.name}
                                                        </Typography>
                                                    </Box>
                                                    
                                                    {complaint.location && (
                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                            <FaMapMarkerAlt size={12} color="var(--gov-primary)" />
                                                            <Typography 
                                                                variant="caption" 
                                                                sx={{ 
                                                                    color: isDark ? '#b3b3b3' : '#6c757d',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    whiteSpace: 'nowrap',
                                                                    maxWidth: 80
                                                                }}
                                                            >
                                                                {complaint.location}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                    
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                        <FaClock size={12} color="var(--gov-primary)" />
                                                        <Typography 
                                                            variant="caption" 
                                                            sx={{ 
                                                                color: isDark ? '#b3b3b3' : '#6c757d'
                                                            }}
                                                        >
                                                            {formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </InfiniteScroll>
                    )
                ) : (
                    /* Map View */
                    <Box sx={{ 
                        height: 'calc(100vh - 200px)',
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: `1px solid ${isDark ? '#404040' : '#dee2e6'}`,
                        boxShadow: isDark 
                            ? '0 8px 32px rgba(0,0,0,0.3)' 
                            : '0 8px 32px rgba(0,0,0,0.1)'
                    }}>
                        <DynamicMap
                            complaints={complaints}
                            userLocation={userLocation}
                            onLocationUpdate={setUserLocation}
                        />
                    </Box>
                )}
            </Box>

            {/* Floating Action Button for Quick Report */}
            <Fab
                color="primary"
                aria-label="report issue"
                onClick={handleReportIssue}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    backgroundColor: 'var(--gov-primary)',
                    '&:hover': {
                        backgroundColor: 'var(--gov-primary-dark)',
                        transform: 'scale(1.1)'
                    },
                    transition: 'all 0.3s ease'
                }}
            >
                <FaPlus />
            </Fab>

            {/* Auth Dialog */}
            <CitizenAuthDialog 
                open={isAuthDialogOpen} 
                handleClose={() => setIsAuthDialogOpen(false)} 
            />
        </Box>
    );
}
