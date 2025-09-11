"use client";

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
    InputAdornment,
    Switch,
    FormControlLabel
} from "@mui/material";
import {
    FaEye,
    FaEdit,
    FaTrash,
    FaSearch,
    FaFilter,
    FaDownload,
    FaUserShield,
    FaUser,
    FaUserCheck,
    FaUserTimes,
    FaClock,
    FaEnvelope,
    FaPhone
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

interface User {
    id: string;
    username: string;
    name?: string;
    email: string;
    phoneNumber: string;
    role: 'CITIZEN' | 'MINISTRY_STAFF' | 'ADMIN' | 'SUPER_ADMIN';
    isActive: boolean;
    isPremium: boolean;
    createdAt: Date;
    updatedAt: Date;
    photoUrl?: string;
    _count: {
        complaints: number;
        createdTweets: number;
        followers: number;
        following: number;
    };
}

interface UsersResponse {
    users: User[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, [page, searchTerm, roleFilter, statusFilter]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "10",
                ...(searchTerm && { search: searchTerm }),
                ...(roleFilter && { role: roleFilter }),
                ...(statusFilter && { status: statusFilter })
            });

            const response = await fetch(`/api/admin/users?${params}`);
            const data: UsersResponse = await response.json();
            
            setUsers(data.users);
            setTotalPages(data.pagination.pages);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (user: User) => {
        setSelectedUser(user);
        setDetailsOpen(true);
    };

    const handleRoleUpdate = async (userId: string, newRole: string) => {
        try {
            const response = await fetch(`/api/admin/users/${userId}/role`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: newRole })
            });

            if (response.ok) {
                fetchUsers();
                setDetailsOpen(false);
            }
        } catch (error) {
            console.error('Error updating role:', error);
        }
    };

    const handleStatusToggle = async (userId: string, isActive: boolean) => {
        try {
            const response = await fetch(`/api/admin/users/${userId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isActive })
            });

            if (response.ok) {
                fetchUsers();
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`/api/admin/users/${userId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    fetchUsers();
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'SUPER_ADMIN': return 'error';
            case 'ADMIN': return 'warning';
            case 'MINISTRY_STAFF': return 'info';
            case 'CITIZEN': return 'success';
            default: return 'default';
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'SUPER_ADMIN': return <FaUserShield />;
            case 'ADMIN': return <FaUserShield />;
            case 'MINISTRY_STAFF': return <FaUserCheck />;
            case 'CITIZEN': return <FaUser />;
            default: return <FaUser />;
        }
    };

    const exportUsers = () => {
        // Implementation for exporting users to CSV/Excel
        console.log('Exporting users...');
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Users Management
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<FaDownload />}
                    onClick={exportUsers}
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
                                placeholder="Search users..."
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
                                <InputLabel>Role</InputLabel>
                                <Select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    label="Role"
                                >
                                    <MenuItem value="">All Roles</MenuItem>
                                    <MenuItem value="CITIZEN">Citizen</MenuItem>
                                    <MenuItem value="MINISTRY_STAFF">Ministry Staff</MenuItem>
                                    <MenuItem value="ADMIN">Admin</MenuItem>
                                    <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    label="Status"
                                >
                                    <MenuItem value="">All Status</MenuItem>
                                    <MenuItem value="active">Active</MenuItem>
                                    <MenuItem value="inactive">Inactive</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<FaFilter />}
                                onClick={fetchUsers}
                            >
                                Filter
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardContent>
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>User</TableCell>
                                    <TableCell>Contact</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Stats</TableCell>
                                    <TableCell>Joined</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : users.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            No users found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((user) => (
                                        <TableRow key={user.id} hover>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar
                                                        src={user.photoUrl || "/assets/egg.jpg"}
                                                        alt={user.name || user.username}
                                                        sx={{ width: 48, height: 48 }}
                                                    />
                                                    <Box>
                                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                            {user.name || user.username}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            @{user.username}
                                                        </Typography>
                                                        {user.isPremium && (
                                                            <Chip
                                                                label="Premium"
                                                                size="small"
                                                                color="primary"
                                                                sx={{ mt: 0.5 }}
                                                            />
                                                        )}
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                                                        <FaEnvelope size={12} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {user.email}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <FaPhone size={12} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {user.phoneNumber}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={getRoleIcon(user.role)}
                                                    label={user.role.replace('_', ' ')}
                                                    color={getRoleColor(user.role) as any}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={user.isActive}
                                                            onChange={(e) => handleStatusToggle(user.id, e.target.checked)}
                                                            size="small"
                                                        />
                                                    }
                                                    label={user.isActive ? "Active" : "Inactive"}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Complaints: {user._count.complaints}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Posts: {user._count.createdTweets}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Followers: {user._count.followers}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <FaClock size={12} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                    <Tooltip title="View Details">
                                                        <IconButton 
                                                            size="small"
                                                            onClick={() => handleViewDetails(user)}
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
                                                            onClick={() => handleDeleteUser(user.id)}
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

            {/* User Details Dialog */}
            <Dialog 
                open={detailsOpen} 
                onClose={() => setDetailsOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    User Details - {selectedUser?.username}
                </DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <Box sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Avatar
                                    src={selectedUser.photoUrl || "/assets/egg.jpg"}
                                    alt={selectedUser.name || selectedUser.username}
                                    sx={{ width: 64, height: 64 }}
                                />
                                <Box>
                                    <Typography variant="h6">
                                        {selectedUser.name || selectedUser.username}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        @{selectedUser.username}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                        <Chip
                                            icon={getRoleIcon(selectedUser.role)}
                                            label={selectedUser.role.replace('_', ' ')}
                                            color={getRoleColor(selectedUser.role) as any}
                                            size="small"
                                        />
                                        {selectedUser.isPremium && (
                                            <Chip
                                                label="Premium"
                                                size="small"
                                                color="primary"
                                            />
                                        )}
                                    </Box>
                                </Box>
                            </Box>

                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" gutterBottom>
                                        Contact Information
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <FaEnvelope size={16} />
                                        <Typography variant="body2">{selectedUser.email}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <FaPhone size={16} />
                                        <Typography variant="body2">{selectedUser.phoneNumber}</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" gutterBottom>
                                        Statistics
                                    </Typography>
                                    <Typography variant="body2">Complaints: {selectedUser._count.complaints}</Typography>
                                    <Typography variant="body2">Posts: {selectedUser._count.createdTweets}</Typography>
                                    <Typography variant="body2">Followers: {selectedUser._count.followers}</Typography>
                                    <Typography variant="body2">Following: {selectedUser._count.following}</Typography>
                                </Grid>
                            </Grid>

                            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                                Change Role
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {(['CITIZEN', 'MINISTRY_STAFF', 'ADMIN', 'SUPER_ADMIN'] as const).map((role) => (
                                    <Button
                                        key={role}
                                        variant={selectedUser.role === role ? "contained" : "outlined"}
                                        size="small"
                                        startIcon={getRoleIcon(role)}
                                        onClick={() => handleRoleUpdate(selectedUser.id, role)}
                                    >
                                        {role.replace('_', ' ')}
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
