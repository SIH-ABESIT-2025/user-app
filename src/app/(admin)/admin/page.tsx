"use client";

import { useState, useEffect } from "react";
import { 
    Grid, 
    Card, 
    CardContent, 
    Typography, 
    Box, 
    LinearProgress,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    IconButton,
    Tooltip,
    Button,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemAvatar,
    Badge,
    Alert,
    CircularProgress
} from "@mui/material";
import { 
    FaClipboardList, 
    FaUsers, 
    FaBuilding, 
    FaCheckCircle, 
    FaClock, 
    FaExclamationTriangle,
    FaEye,
    FaEdit,
    FaChartLine,
    FaArrowUp,
    FaArrowDown,
    FaMinus,
    FaCalendarAlt,
    FaFilter,
    FaDownload,
    FaSync,
    FaBell,
    FaCog
} from "react-icons/fa";
import { formatDistanceToNow, format } from "date-fns";
import { ComplaintProps } from "@/types/ComplaintProps";
import { UserProps } from "@/types/UserProps";
import { useRouter } from "next/navigation";

interface DashboardStats {
    totalComplaints: number;
    totalUsers: number;
    totalMinistries: number;
    resolvedComplaints: number;
    pendingComplaints: number;
    urgentComplaints: number;
    recentComplaints: ComplaintProps[];
    recentUsers: UserProps[];
    monthlyStats: {
        complaints: number;
        users: number;
        resolutionRate: number;
    };
    topMinistries: Array<{
        name: string;
        complaints: number;
        resolved: number;
    }>;
    systemHealth: {
        databaseStatus: 'healthy' | 'warning' | 'error';
        storageUsage: number;
        activeUsers: number;
    };
}

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats>({
        totalComplaints: 0,
        totalUsers: 0,
        totalMinistries: 0,
        resolvedComplaints: 0,
        pendingComplaints: 0,
        urgentComplaints: 0,
        recentComplaints: [],
        recentUsers: [],
        monthlyStats: {
            complaints: 0,
            users: 0,
            resolutionRate: 0
        },
        topMinistries: [],
        systemHealth: {
            databaseStatus: 'healthy',
            storageUsage: 0,
            activeUsers: 0
        }
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            
            const [complaintsRes, usersRes, ministriesRes] = await Promise.all([
                fetch('/api/admin/dashboard/complaints'),
                fetch('/api/admin/dashboard/users'),
                fetch('/api/admin/dashboard/ministries')
            ]);

            const [complaintsData, usersData, ministriesData] = await Promise.all([
                complaintsRes.json(),
                usersRes.json(),
                ministriesRes.json()
            ]);

            // Mock additional data for demonstration
            const mockMonthlyStats = {
                complaints: Math.floor(Math.random() * 50) + 20,
                users: Math.floor(Math.random() * 20) + 10,
                resolutionRate: Math.floor(Math.random() * 20) + 70
            };

            const mockTopMinistries = [
                { name: "Public Works", complaints: 45, resolved: 38 },
                { name: "Health & Family Welfare", complaints: 32, resolved: 28 },
                { name: "Education", complaints: 28, resolved: 22 },
                { name: "Transport", complaints: 25, resolved: 18 },
                { name: "Water Resources", complaints: 22, resolved: 19 }
            ];

            setStats({
                totalComplaints: complaintsData.total || 0,
                resolvedComplaints: complaintsData.resolved || 0,
                pendingComplaints: complaintsData.pending || 0,
                urgentComplaints: complaintsData.urgent || 0,
                recentComplaints: complaintsData.recent || [],
                totalUsers: usersData.total || 0,
                recentUsers: usersData.recent || [],
                totalMinistries: ministriesData.total || 0,
                monthlyStats: mockMonthlyStats,
                topMinistries: mockTopMinistries,
                systemHealth: {
                    databaseStatus: 'healthy',
                    storageUsage: Math.floor(Math.random() * 30) + 45,
                    activeUsers: Math.floor(Math.random() * 50) + 25
                }
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        fetchDashboardData(true);
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

    const getTrendIcon = (value: number, threshold: number = 0) => {
        if (value > threshold) return <FaArrowUp color="#2e7d32" />;
        if (value < threshold) return <FaArrowDown color="#d32f2f" />;
        return <FaMinus color="#6c757d" />;
    };

    const getHealthStatusColor = (status: string) => {
        switch (status) {
            case 'healthy': return '#2e7d32';
            case 'warning': return '#ed6c02';
            case 'error': return '#d32f2f';
            default: return '#6c757d';
        }
    };

    const StatCard = ({ title, value, icon, color, trend, subtitle }: any) => (
        <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)` }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                            {title}
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 'bold', color: color }}>
                            {value}
                        </Typography>
                        {subtitle && (
                            <Typography variant="body2" color="text.secondary">
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {icon}
                        {trend && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {getTrendIcon(trend)}
                                <Typography variant="body2" color="text.secondary">
                                    {trend > 0 ? `+${trend}%` : `${trend}%`}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: '60vh',
                gap: 2
            }}>
                <CircularProgress size={60} />
                <Typography variant="h6" color="text.secondary">
                    Loading Dashboard...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 0 }}>
            {/* Header Section */}
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 4,
                p: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 2,
                color: 'white'
            }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Admin Dashboard
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        Welcome back! Here's what's happening with your system today.
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<FaDownload />}
                        sx={{ 
                            color: 'white', 
                            borderColor: 'white',
                            '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
                        }}
                    >
                        Export Report
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={refreshing ? <CircularProgress size={16} color="inherit" /> : <FaSync />}
                        onClick={handleRefresh}
                        disabled={refreshing}
                        sx={{ 
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
                        }}
                    >
                        Refresh
                    </Button>
                </Box>
            </Box>

            {/* System Health Alert */}
            <Alert 
                severity={stats.systemHealth?.databaseStatus === 'healthy' ? 'success' : 'warning'} 
                sx={{ mb: 3 }}
                icon={stats.systemHealth?.databaseStatus === 'healthy' ? <FaCheckCircle /> : <FaExclamationTriangle />}
            >
                System Status: {stats.systemHealth?.databaseStatus?.toUpperCase() || 'UNKNOWN'} • 
                Storage Usage: {stats.systemHealth?.storageUsage || 0}% • 
                Active Users: {stats.systemHealth?.activeUsers || 0}
            </Alert>

            {/* Main Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Complaints"
                        value={stats.totalComplaints || 0}
                        icon={<FaClipboardList size={32} />}
                        color="#1976d2"
                        trend={12}
                        subtitle="This month"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Users"
                        value={stats.totalUsers || 0}
                        icon={<FaUsers size={32} />}
                        color="#2e7d32"
                        trend={8}
                        subtitle="Registered users"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Active Ministries"
                        value={stats.totalMinistries || 0}
                        icon={<FaBuilding size={32} />}
                        color="#ed6c02"
                        trend={0}
                        subtitle="Government departments"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Resolution Rate"
                        value={`${stats.totalComplaints > 0 ? Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100) : 0}%`}
                        icon={<FaCheckCircle size={32} />}
                        color="#2e7d32"
                        trend={5}
                        subtitle={`${stats.resolvedComplaints || 0} resolved`}
                    />
                </Grid>
            </Grid>

            {/* Priority & Status Overview */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%', borderLeft: '4px solid #d32f2f' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <FaExclamationTriangle size={24} color="#d32f2f" />
                                <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                                    Urgent Complaints
                                </Typography>
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main', mb: 1 }}>
                                {stats.urgentComplaints || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Requires immediate attention
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%', borderLeft: '4px solid #ed6c02' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <FaClock size={24} color="#ed6c02" />
                                <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                                    Pending Review
                                </Typography>
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main', mb: 1 }}>
                                {stats.pendingComplaints || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Awaiting ministry response
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%', borderLeft: '4px solid #1976d2' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <FaCalendarAlt size={24} color="#1976d2" />
                                <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                                    This Month
                                </Typography>
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                                {stats.monthlyStats?.complaints || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                New complaints received
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Detailed Analytics Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Top Ministries Performance */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <FaChartLine size={24} color="#1976d2" />
                                <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                                    Ministry Performance
                                </Typography>
                            </Box>
                            <List>
                                {(stats.topMinistries || []).length > 0 ? (
                                    (stats.topMinistries || []).map((ministry, index) => (
                                        <ListItem key={index} sx={{ px: 0 }}>
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                                                    {index + 1}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={ministry.name}
                                                secondary={`${ministry.complaints} complaints • ${ministry.resolved} resolved`}
                                            />
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    {Math.round((ministry.resolved / ministry.complaints) * 100)}%
                                                </Typography>
                                                <LinearProgress 
                                                    variant="determinate" 
                                                    value={(ministry.resolved / ministry.complaints) * 100}
                                                    sx={{ width: 60, height: 6, borderRadius: 3 }}
                                                />
                                            </Box>
                                        </ListItem>
                                    ))
                                ) : (
                                    <ListItem>
                                        <ListItemText 
                                            primary="No ministry data available" 
                                            secondary="Ministry performance data will appear here"
                                        />
                                    </ListItem>
                                )}
                            </List>
                            <Button 
                                fullWidth 
                                variant="outlined" 
                                startIcon={<FaBuilding />}
                                onClick={() => router.push('/admin/ministries')}
                                sx={{ mt: 2 }}
                            >
                                View All Ministries
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Activity */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <FaBell size={24} color="#9c27b0" />
                                <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                                    Recent Activity
                                </Typography>
                            </Box>
                            <List>
                                {(stats.recentUsers || []).length > 0 ? (
                                    (stats.recentUsers || []).slice(0, 5).map((user) => (
                                        <ListItem key={user.id} sx={{ px: 0 }}>
                                            <ListItemAvatar>
                                                <Avatar
                                                    src={user.photoUrl || "/assets/egg.jpg"}
                                                    alt={user.name || user.username}
                                                    sx={{ width: 40, height: 40 }}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={`${user.name || user.username} registered`}
                                                secondary={formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                                            />
                                            <Chip 
                                                label={user.role.replace('_', ' ')} 
                                                size="small" 
                                                color={user.role === 'ADMIN' ? 'error' : 'default'}
                                            />
                                        </ListItem>
                                    ))
                                ) : (
                                    <ListItem>
                                        <ListItemText 
                                            primary="No recent activity" 
                                            secondary="User activity will appear here"
                                        />
                                    </ListItem>
                                )}
                            </List>
                            <Button 
                                fullWidth 
                                variant="outlined" 
                                startIcon={<FaUsers />}
                                onClick={() => router.push('/admin/users')}
                                sx={{ mt: 2 }}
                            >
                                View All Users
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Recent Complaints Table */}
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Recent Complaints
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<FaFilter />}
                            onClick={() => router.push('/admin/complaints')}
                        >
                            View All Complaints
                        </Button>
                    </Box>
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Complaint Details</TableCell>
                                    <TableCell>User</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Priority</TableCell>
                                    <TableCell>Ministry</TableCell>
                                    <TableCell>Created</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(stats.recentComplaints || []).slice(0, 5).map((complaint) => (
                                    <TableRow key={complaint.id} hover>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                    {complaint.title}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {complaint.complaintNumber}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Avatar
                                                    src={complaint.user.photoUrl || "/assets/egg.jpg"}
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
                                            <Typography variant="body2" color="text.secondary">
                                                {formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                <Tooltip title="View Details">
                                                    <IconButton size="small">
                                                        <FaEye />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit">
                                                    <IconButton size="small">
                                                        <FaEdit />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Box>
    );
}
