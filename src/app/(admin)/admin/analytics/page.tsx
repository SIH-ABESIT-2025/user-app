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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    LinearProgress
} from "@mui/material";
import {
    FaClipboardList,
    FaUsers,
    FaBuilding,
    FaCheckCircle,
    FaExclamationTriangle,
} from "react-icons/fa";

interface AnalyticsData {
    overview: {
        totalComplaints: number;
        totalUsers: number;
        totalMinistries: number;
        resolvedComplaints: number;
        pendingComplaints: number;
        urgentComplaints: number;
    };
    complaintsByStatus: Array<{
        status: string;
        count: number;
        percentage: number;
    }>;
    complaintsByPriority: Array<{
        priority: string;
        count: number;
        percentage: number;
    }>;
    complaintsByMinistry: Array<{
        ministry: string;
        count: number;
        percentage: number;
    }>;
    monthlyTrends: Array<{
        month: string;
        complaints: number;
        resolved: number;
    }>;
    topUsers: Array<{
        user: string;
        complaints: number;
    }>;
}

export default function AdminAnalytics() {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState("30");

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/admin/analytics?timeRange=${timeRange}`);
            const data = await response.json();
            setAnalytics(data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'RESOLVED': return 'success';
            case 'IN_PROGRESS': return 'info';
            case 'UNDER_REVIEW': return 'warning';
            case 'SUBMITTED': return 'default';
            case 'REJECTED': return 'error';
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

    if (loading) {
        return (
            <Box sx={{ width: '100%' }}>
                <LinearProgress />
            </Box>
        );
    }

    if (!analytics) {
        return (
            <Box>
                <Typography variant="h4" gutterBottom>
                    Analytics
                </Typography>
                <Typography>No analytics data available.</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Analytics Dashboard
                </Typography>
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Time Range</InputLabel>
                    <Select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        label="Time Range"
                    >
                        <MenuItem value="7">Last 7 days</MenuItem>
                        <MenuItem value="30">Last 30 days</MenuItem>
                        <MenuItem value="90">Last 90 days</MenuItem>
                        <MenuItem value="365">Last year</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Overview Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <FaClipboardList size={24} color="#1976d2" />
                                <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                                    Total Complaints
                                </Typography>
                            </Box>
                            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                {analytics.overview.totalComplaints}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <FaUsers size={24} color="#2e7d32" />
                                <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                                    Total Users
                                </Typography>
                            </Box>
                            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                {analytics.overview.totalUsers}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <FaCheckCircle size={24} color="#2e7d32" />
                                <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                                    Resolved
                                </Typography>
                            </Box>
                            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                {analytics.overview.resolvedComplaints}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {analytics.overview.totalComplaints > 0 
                                    ? `${Math.round((analytics.overview.resolvedComplaints / analytics.overview.totalComplaints) * 100)}% resolution rate`
                                    : '0% resolution rate'
                                }
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <FaExclamationTriangle size={24} color="#d32f2f" />
                                <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                                    Urgent
                                </Typography>
                            </Box>
                            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                                {analytics.overview.urgentComplaints}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Charts and Tables */}
            <Grid container spacing={3}>
                {/* Complaints by Status */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Complaints by Status
                            </Typography>
                            <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Status</TableCell>
                                            <TableCell align="right">Count</TableCell>
                                            <TableCell align="right">Percentage</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {analytics.complaintsByStatus.map((item) => (
                                            <TableRow key={item.status}>
                                                <TableCell>
                                                    <Chip
                                                        label={item.status.replace('_', ' ')}
                                                        color={getStatusColor(item.status) as any}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell align="right">{item.count}</TableCell>
                                                <TableCell align="right">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                                        <Box sx={{ width: 100 }}>
                                                            <LinearProgress 
                                                                variant="determinate" 
                                                                value={item.percentage} 
                                                                color={getStatusColor(item.status) as any}
                                                            />
                                                        </Box>
                                                        <Typography variant="body2">
                                                            {item.percentage.toFixed(1)}%
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Complaints by Priority */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Complaints by Priority
                            </Typography>
                            <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Priority</TableCell>
                                            <TableCell align="right">Count</TableCell>
                                            <TableCell align="right">Percentage</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {analytics.complaintsByPriority.map((item) => (
                                            <TableRow key={item.priority}>
                                                <TableCell>
                                                    <Chip
                                                        label={item.priority}
                                                        color={getPriorityColor(item.priority) as any}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell align="right">{item.count}</TableCell>
                                                <TableCell align="right">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                                        <Box sx={{ width: 100 }}>
                                                            <LinearProgress 
                                                                variant="determinate" 
                                                                value={item.percentage} 
                                                                color={getPriorityColor(item.priority) as any}
                                                            />
                                                        </Box>
                                                        <Typography variant="body2">
                                                            {item.percentage.toFixed(1)}%
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Complaints by Ministry */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Complaints by Ministry
                            </Typography>
                            <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Ministry</TableCell>
                                            <TableCell align="right">Count</TableCell>
                                            <TableCell align="right">Percentage</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {analytics.complaintsByMinistry.slice(0, 10).map((item) => (
                                            <TableRow key={item.ministry}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <FaBuilding size={16} />
                                                        <Typography variant="body2">
                                                            {item.ministry}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="right">{item.count}</TableCell>
                                                <TableCell align="right">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                                        <Box sx={{ width: 100 }}>
                                                            <LinearProgress 
                                                                variant="determinate" 
                                                                value={item.percentage} 
                                                                color="primary"
                                                            />
                                                        </Box>
                                                        <Typography variant="body2">
                                                            {item.percentage.toFixed(1)}%
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Top Users */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Top Users by Complaints
                            </Typography>
                            <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>User</TableCell>
                                            <TableCell align="right">Complaints</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {analytics.topUsers.slice(0, 10).map((item, index) => (
                                            <TableRow key={item.user}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            #{index + 1}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            {item.user}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="right">{item.complaints}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
