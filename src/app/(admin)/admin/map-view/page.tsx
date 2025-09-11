"use client";
import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from "@mui/material";
import {
    FaMapMarkerAlt,
    FaFilter,
    FaEye,
    FaEdit,
    FaBuilding,
    FaClock,
    FaUser,
    FaExclamationTriangle
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { ComplaintProps } from "@/types/ComplaintProps";
import MapComponent from "@/components/map/MapComponent";

interface MapComplaint extends ComplaintProps {
    latitude: number;
    longitude: number;
}

export default function AdminMapView() {
    const [complaints, setComplaints] = useState<MapComplaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [priorityFilter, setPriorityFilter] = useState<string>("");
    const [selectedComplaint, setSelectedComplaint] = useState<MapComplaint | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    useEffect(() => {
        fetchComplaints();
    }, [statusFilter, priorityFilter]);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (statusFilter) params.append("status", statusFilter);
            if (priorityFilter) params.append("priority", priorityFilter);

            const response = await fetch(`/api/admin/complaints?${params}&limit=100`);
            const data = await response.json();
            
            // Filter complaints that have location data
            const complaintsWithLocation = data.complaints.filter(
                (complaint: ComplaintProps) => complaint.latitude && complaint.longitude
            );
            setComplaints(complaintsWithLocation);
        } catch (error) {
            console.error('Error fetching complaints:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleComplaintClick = (complaint: MapComplaint) => {
        setSelectedComplaint(complaint);
        setDetailsOpen(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'RESOLVED': return 'success';
            case 'IN_PROGRESS': return 'info';
            case 'UNDER_REVIEW': return 'warning';
            case 'SUBMITTED': return 'default';
            case 'REJECTED': return 'error';
            case 'CLOSED': return 'default';
            default: return 'default';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'URGENT': return 'error';
            case 'HIGH': return 'warning';
            case 'MEDIUM': return 'info';
            case 'LOW': return 'success';
            default: return 'default';
        }
    };

    const getMarkerColor = (complaint: MapComplaint) => {
        if (complaint.priority === 'URGENT') return '#d32f2f';
        if (complaint.priority === 'HIGH') return '#ed6c02';
        if (complaint.priority === 'MEDIUM') return '#1976d2';
        return '#2e7d32';
    };

    // Prepare map markers
    const mapMarkers = complaints.map(complaint => ({
        id: complaint.id,
        position: [complaint.latitude!, complaint.longitude!],
        color: getMarkerColor(complaint),
        title: complaint.title,
        status: complaint.status,
        priority: complaint.priority,
        ministry: complaint.ministry.name,
        onClick: () => handleComplaintClick(complaint)
    }));

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Complaints Map View
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
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
                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Priority</InputLabel>
                        <Select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            label="Priority"
                        >
                            <MenuItem value="">All Priority</MenuItem>
                            <MenuItem value="LOW">Low</MenuItem>
                            <MenuItem value="MEDIUM">Medium</MenuItem>
                            <MenuItem value="HIGH">High</MenuItem>
                            <MenuItem value="URGENT">Urgent</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* Map */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ height: '600px' }}>
                        <CardContent sx={{ height: '100%', p: 0 }}>
                            <MapComponent 
                                markers={mapMarkers}
                                center={[23.6102, 85.2799]} // Jharkhand center coordinates
                                zoom={7}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Statistics and Legend */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Map Statistics
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2">Total Complaints:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                        {complaints.length}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2">With Location:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                        {complaints.length}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2">Urgent:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                                        {complaints.filter(c => c.priority === 'URGENT').length}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2">Resolved:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                        {complaints.filter(c => c.status === 'RESOLVED').length}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Legend
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 16, height: 16, bgcolor: '#d32f2f', borderRadius: '50%' }} />
                                    <Typography variant="body2">Urgent Priority</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 16, height: 16, bgcolor: '#ed6c02', borderRadius: '50%' }} />
                                    <Typography variant="body2">High Priority</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 16, height: 16, bgcolor: '#1976d2', borderRadius: '50%' }} />
                                    <Typography variant="body2">Medium Priority</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 16, height: 16, bgcolor: '#2e7d32', borderRadius: '50%' }} />
                                    <Typography variant="body2">Low Priority</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Complaint Details Dialog */}
            <Dialog 
                open={detailsOpen} 
                onClose={() => setDetailsOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Complaint Details - {selectedComplaint?.complaintNumber}
                </DialogTitle>
                <DialogContent>
                    {selectedComplaint && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                {selectedComplaint.title}
                            </Typography>
                            <Typography variant="body1" paragraph>
                                {selectedComplaint.description}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                <Chip
                                    label={selectedComplaint.status.replace('_', ' ')}
                                    color={getStatusColor(selectedComplaint.status) as any}
                                />
                                <Chip
                                    label={selectedComplaint.priority}
                                    color={getPriorityColor(selectedComplaint.priority) as any}
                                />
                            </Box>

                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <FaUser size={16} />
                                        <Typography variant="body2">
                                            <strong>User:</strong> {selectedComplaint.user.name || selectedComplaint.user.username}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <FaBuilding size={16} />
                                        <Typography variant="body2">
                                            <strong>Ministry:</strong> {selectedComplaint.ministry.name}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <FaMapMarkerAlt size={16} />
                                        <Typography variant="body2">
                                            <strong>Location:</strong> {selectedComplaint.location}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <FaClock size={16} />
                                        <Typography variant="body2">
                                            <strong>Created:</strong> {formatDistanceToNow(new Date(selectedComplaint.createdAt), { addSuffix: true })}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>

                            {selectedComplaint.attachments.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Attachments ({selectedComplaint.attachments.length})
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        {selectedComplaint.attachments.map((attachment, index) => (
                                            <Chip
                                                key={index}
                                                label={attachment.fileName}
                                                size="small"
                                                variant="outlined"
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDetailsOpen(false)}>Close</Button>
                    <Button variant="contained">View Full Details</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

