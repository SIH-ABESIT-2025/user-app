"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Tooltip,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Avatar,
    Pagination,
    Grid,
    InputAdornment
} from "@mui/material";
import {
    FaEye,
    FaEdit,
    FaTrash,
    FaSearch,
    FaFilter,
    FaDownload,
    FaMapMarkerAlt,
    FaClock,
    FaUser,
    FaBuilding
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { ComplaintProps, ComplaintStatus, ComplaintPriority } from "@/types/ComplaintProps";

interface ComplaintsResponse {
    complaints: ComplaintProps[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export default function AdminComplaints() {
    const [complaints, setComplaints] = useState<ComplaintProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "">("");
    const [priorityFilter, setPriorityFilter] = useState<ComplaintPriority | "">("");
    const [selectedComplaint, setSelectedComplaint] = useState<ComplaintProps | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    useEffect(() => {
        fetchComplaints();
    }, [page, searchTerm, statusFilter, priorityFilter]);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "10",
                ...(searchTerm && { search: searchTerm }),
                ...(statusFilter && { status: statusFilter }),
                ...(priorityFilter && { priority: priorityFilter })
            });

            const response = await fetch(`/api/admin/complaints?${params}`);
            const data: ComplaintsResponse = await response.json();
            
            setComplaints(data.complaints);
            setTotalPages(data.pagination.pages);
        } catch (error) {
            console.error('Error fetching complaints:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (complaint: ComplaintProps) => {
        setSelectedComplaint(complaint);
        setDetailsOpen(true);
    };

    const handleStatusUpdate = async (complaintId: string, newStatus: ComplaintStatus) => {
        try {
            const response = await fetch(`/api/admin/complaints/${complaintId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                fetchComplaints();
                setDetailsOpen(false);
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDeleteComplaint = async (complaintId: string) => {
        if (window.confirm('Are you sure you want to delete this complaint?')) {
            try {
                const response = await fetch(`/api/admin/complaints/${complaintId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    fetchComplaints();
                }
            } catch (error) {
                console.error('Error deleting complaint:', error);
            }
        }
    };

    const getStatusColor = (status: ComplaintStatus) => {
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

    const getPriorityColor = (priority: ComplaintPriority) => {
        switch (priority) {
            case 'URGENT': return 'error';
            case 'HIGH': return 'warning';
            case 'MEDIUM': return 'info';
            case 'LOW': return 'success';
            default: return 'default';
        }
    };

    const exportComplaints = () => {
        // Implementation for exporting complaints to CSV/Excel
        console.log('Exporting complaints...');
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Complaints Management
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<FaDownload />}
                    onClick={exportComplaints}
                >
                    Export
                </Button>
            </Box>

            {/* Filters */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                placeholder="Search complaints..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FaSearch />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value as ComplaintStatus)}
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
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Priority</InputLabel>
                                <Select
                                    value={priorityFilter}
                                    onChange={(e) => setPriorityFilter(e.target.value as ComplaintPriority)}
                                    label="Priority"
                                >
                                    <MenuItem value="">All Priority</MenuItem>
                                    <MenuItem value="LOW">Low</MenuItem>
                                    <MenuItem value="MEDIUM">Medium</MenuItem>
                                    <MenuItem value="HIGH">High</MenuItem>
                                    <MenuItem value="URGENT">Urgent</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<FaFilter />}
                                onClick={fetchComplaints}
                            >
                                Filter
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Complaints Table */}
            <Card>
                <CardContent>
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Complaint</TableCell>
                                    <TableCell>User</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Priority</TableCell>
                                    <TableCell>Ministry</TableCell>
                                    <TableCell>Location</TableCell>
                                    <TableCell>Created</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : complaints.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            No complaints found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    complaints.map((complaint) => (
                                        <TableRow key={complaint.id} hover>
                                            <TableCell>
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                        {complaint.title}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {complaint.complaintNumber}
                                                    </Typography>
                                                    <Typography 
                                                        variant="body2" 
                                                        color="text.secondary"
                                                        sx={{ 
                                                            mt: 0.5,
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden'
                                                        }}
                                                    >
                                                        {complaint.description}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Avatar
                                                        src={complaint.user.photoUrl || "/assets/default-avatar.svg"}
                                                        alt={complaint.user.name || complaint.user.username}
                                                        sx={{ width: 32, height: 32 }}
                                                    />
                                                    <Box>
                                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                            {complaint.user.name || complaint.user.username}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            @{complaint.user.username}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={complaint.status.replace('_', ' ')}
                                                    color={getStatusColor(complaint.status) as any}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={complaint.priority}
                                                    color={getPriorityColor(complaint.priority) as any}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <FaBuilding size={12} />
                                                    <Typography variant="body2">
                                                        {complaint.ministry.name}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                {complaint.location && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <FaMapMarkerAlt size={12} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {complaint.location}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <FaClock size={12} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                    <Tooltip title="View Details">
                                                        <IconButton 
                                                            size="small"
                                                            onClick={() => handleViewDetails(complaint)}
                                                        >
                                                            <FaEye />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Edit">
                                                        <IconButton size="small">
                                                            <FaEdit />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <IconButton 
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleDeleteComplaint(complaint.id)}
                                                        >
                                                            <FaTrash />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(_, newPage) => setPage(newPage)}
                                color="primary"
                            />
                        </Box>
                    )}
                </CardContent>
            </Card>

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
                            
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                <Chip
                                    label={selectedComplaint.status.replace('_', ' ')}
                                    color={getStatusColor(selectedComplaint.status) as any}
                                />
                                <Chip
                                    label={selectedComplaint.priority}
                                    color={getPriorityColor(selectedComplaint.priority) as any}
                                />
                            </Box>

                            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                                Status Update
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {(['SUBMITTED', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'REJECTED', 'CLOSED'] as ComplaintStatus[]).map((status) => (
                                    <Button
                                        key={status}
                                        variant={selectedComplaint.status === status ? "contained" : "outlined"}
                                        size="small"
                                        onClick={() => handleStatusUpdate(selectedComplaint.id, status)}
                                    >
                                        {status.replace('_', ' ')}
                                    </Button>
                                ))}
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDetailsOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
