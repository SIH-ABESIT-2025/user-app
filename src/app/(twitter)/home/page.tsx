"use client";

import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
    Box, 
    Typography, 
    Chip, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    Grid, 
    Alert, 
    Button,
    Paper
} from "@mui/material";
import { FaSignInAlt, FaPlus } from "react-icons/fa";

import { getMinistries } from "@/utilities/fetch";
import CircularLoading from "@/components/misc/CircularLoading";
import NothingToShow from "@/components/misc/NothingToShow";
import ComplaintCard from "@/components/complaint/ComplaintCard";
import InfiniteScroll from "@/components/misc/InfiniteScroll";
import { useInfiniteComplaints } from "@/hooks/useInfiniteComplaints";
import { AuthContext } from "@/contexts/AuthContext";
import { ComplaintProps, MinistryProps } from "@/types/ComplaintProps";
import CitizenAuthDialog from "@/components/dialog/CitizenAuthDialog";

export default function HomePage() {
    const { token, isPending } = useContext(AuthContext);
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
    const [filters, setFilters] = useState({
        ministryId: "",
        status: "",
        priority: ""
    });

    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch
    } = useInfiniteComplaints({ filters, enabled: true }); // Always enabled for public access

    const { data: ministries } = useQuery({
        queryKey: ["ministries"],
        queryFn: getMinistries,
    });

    const handleFilterChange = (filterType: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const handleSignIn = () => {
        setIsAuthDialogOpen(true);
    };

    const handleReportIssue = () => {
        setIsAuthDialogOpen(true);
    };

    if (isPending || isLoading) return <CircularLoading />;

    // Flatten all pages of complaints
    const complaints: ComplaintProps[] = data?.pages.flatMap(page => page.complaints) || [];
    const totalComplaints = data?.pages[0]?.pagination?.total || 0;

    return (
        <main>
            <Box sx={{ padding: 2 }}>
                {/* Header Section */}
                <Box sx={{ marginBottom: 3 }}>
                    <Typography variant="h4" component="h1" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
                        Civic Issue Dashboard
                    </Typography>
                    
                    <Typography variant="body1" color="text.secondary" sx={{ marginBottom: 2 }}>
                        View and track all reported civic issues in Jharkhand
                    </Typography>

                </Box>

                {/* Filters */}
                <Paper elevation={1} sx={{ marginBottom: 3, padding: 3 }}>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>
                        Filter Complaints
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Ministry</InputLabel>
                                <Select
                                    value={filters.ministryId}
                                    onChange={(e) => handleFilterChange('ministryId', e.target.value)}
                                    label="Ministry"
                                >
                                    <MenuItem value="">All Ministries</MenuItem>
                                    {ministries?.map((ministry: MinistryProps) => (
                                        <MenuItem key={ministry.id} value={ministry.id}>
                                            {ministry.icon} {ministry.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    label="Status"
                                >
                                    <MenuItem value="">All Status</MenuItem>
                                    <MenuItem value="SUBMITTED">Submitted</MenuItem>
                                    <MenuItem value="UNDER_REVIEW">Under Review</MenuItem>
                                    <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                                    <MenuItem value="RESOLVED">Resolved</MenuItem>
                                    <MenuItem value="REJECTED">Rejected</MenuItem>
                                    <MenuItem value="CLOSED">Closed</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Priority</InputLabel>
                                <Select
                                    value={filters.priority}
                                    onChange={(e) => handleFilterChange('priority', e.target.value)}
                                    label="Priority"
                                >
                                    <MenuItem value="">All Priorities</MenuItem>
                                    <MenuItem value="LOW">Low</MenuItem>
                                    <MenuItem value="MEDIUM">Medium</MenuItem>
                                    <MenuItem value="HIGH">High</MenuItem>
                                    <MenuItem value="URGENT">Urgent</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', gap: 1 }}>
                                <Chip 
                                    label={`${totalComplaints} Total`}
                                    color="primary"
                                    variant="outlined"
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Complaints List */}
                {complaints.length === 0 ? (
                    <NothingToShow 
                        type="complaints" 
                        message={!token ? "No complaints found. Be the first to report an issue!" : "No complaints found."}
                    />
                ) : (
                    <InfiniteScroll
                        hasNextPage={hasNextPage || false}
                        isFetchingNextPage={isFetchingNextPage}
                        fetchNextPage={fetchNextPage}
                        loadingText="Loading more complaints..."
                        endText="You've reached the end of the complaints list"
                    >
                        {complaints.map((complaint) => (
                            <ComplaintCard 
                                key={complaint.id} 
                                complaint={complaint}
                                showActions={token?.isPremium} // Only admins can see actions
                            />
                        ))}
                    </InfiniteScroll>
                )}
            </Box>

            {/* Auth Dialog */}
            <CitizenAuthDialog 
                open={isAuthDialogOpen} 
                handleClose={() => setIsAuthDialogOpen(false)} 
            />
        </main>
    );
}
