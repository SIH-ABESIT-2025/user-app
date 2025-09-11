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
    IconButton,
    Tooltip,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    InputAdornment,
    Chip,
    Avatar
} from "@mui/material";
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaSearch,
    FaBuilding,
    FaUsers,
    FaClipboardList,
    FaToggleOn,
    FaToggleOff
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

interface Ministry {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: {
        complaints: number;
    };
}

export default function AdminMinistries() {
    const [ministries, setMinistries] = useState<Ministry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMinistry, setSelectedMinistry] = useState<Ministry | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        icon: "",
        color: "#1976d2",
        isActive: true
    });

    useEffect(() => {
        fetchMinistries();
    }, [searchTerm]);

    const fetchMinistries = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchTerm) params.append("search", searchTerm);

            const response = await fetch(`/api/admin/ministries?${params}`);
            const data = await response.json();
            setMinistries(data.ministries || []);
        } catch (error) {
            console.error('Error fetching ministries:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateMinistry = () => {
        setFormData({
            name: "",
            description: "",
            icon: "",
            color: "#1976d2",
            isActive: true
        });
        setIsEditing(false);
        setDialogOpen(true);
    };

    const handleEditMinistry = (ministry: Ministry) => {
        setFormData({
            name: ministry.name,
            description: ministry.description || "",
            icon: ministry.icon || "",
            color: ministry.color || "#1976d2",
            isActive: ministry.isActive
        });
        setSelectedMinistry(ministry);
        setIsEditing(true);
        setDialogOpen(true);
    };

    const handleSaveMinistry = async () => {
        try {
            const url = isEditing 
                ? `/api/admin/ministries/${selectedMinistry?.id}`
                : '/api/admin/ministries';
            
            const method = isEditing ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                fetchMinistries();
                setDialogOpen(false);
                setSelectedMinistry(null);
            }
        } catch (error) {
            console.error('Error saving ministry:', error);
        }
    };

    const handleDeleteMinistry = async (ministryId: string) => {
        if (window.confirm('Are you sure you want to delete this ministry?')) {
            try {
                const response = await fetch(`/api/admin/ministries/${ministryId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    fetchMinistries();
                }
            } catch (error) {
                console.error('Error deleting ministry:', error);
            }
        }
    };

    const handleToggleStatus = async (ministryId: string, isActive: boolean) => {
        try {
            const response = await fetch(`/api/admin/ministries/${ministryId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isActive })
            });

            if (response.ok) {
                fetchMinistries();
            }
        } catch (error) {
            console.error('Error updating ministry status:', error);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Ministries Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<FaPlus />}
                    onClick={handleCreateMinistry}
                >
                    Add Ministry
                </Button>
            </Box>

            {/* Search */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <TextField
                        fullWidth
                        placeholder="Search ministries..."
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
                </CardContent>
            </Card>

            {/* Ministries Table */}
            <Card>
                <CardContent>
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Ministry</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Complaints</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Created</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : ministries.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            No ministries found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    ministries.map((ministry) => (
                                        <TableRow key={ministry.id} hover>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar
                                                        sx={{ 
                                                            bgcolor: ministry.color || '#1976d2',
                                                            width: 48,
                                                            height: 48
                                                        }}
                                                    >
                                                        <FaBuilding size={24} />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                            {ministry.name}
                                                        </Typography>
                                                        {ministry.icon && (
                                                            <Typography variant="caption" color="text.secondary">
                                                                Icon: {ministry.icon}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography 
                                                    variant="body2" 
                                                    color="text.secondary"
                                                    sx={{ 
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    {ministry.description || 'No description'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <FaClipboardList size={16} />
                                                    <Typography variant="body2">
                                                        {ministry._count.complaints}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={ministry.isActive ? <FaToggleOn /> : <FaToggleOff />}
                                                    label={ministry.isActive ? "Active" : "Inactive"}
                                                    color={ministry.isActive ? "success" : "default"}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {formatDistanceToNow(new Date(ministry.createdAt), { addSuffix: true })}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                    <Tooltip title="Edit">
                                                        <IconButton 
                                                            size="small"
                                                            onClick={() => handleEditMinistry(ministry)}
                                                        >
                                                            <FaEdit />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title={ministry.isActive ? "Deactivate" : "Activate"}>
                                                        <IconButton 
                                                            size="small"
                                                            onClick={() => handleToggleStatus(ministry.id, !ministry.isActive)}
                                                        >
                                                            {ministry.isActive ? <FaToggleOff /> : <FaToggleOn />}
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <IconButton 
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleDeleteMinistry(ministry.id)}
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
                </CardContent>
            </Card>

            {/* Ministry Dialog */}
            <Dialog 
                open={dialogOpen} 
                onClose={() => setDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {isEditing ? 'Edit Ministry' : 'Create New Ministry'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Ministry Name"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                multiline
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Icon (FontAwesome class)"
                                value={formData.icon}
                                onChange={(e) => setFormData({...formData, icon: e.target.value})}
                                placeholder="e.g., fa-building"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Color"
                                type="color"
                                value={formData.color}
                                onChange={(e) => setFormData({...formData, color: e.target.value})}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button 
                        variant="contained" 
                        onClick={handleSaveMinistry}
                        disabled={!formData.name}
                    >
                        {isEditing ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
