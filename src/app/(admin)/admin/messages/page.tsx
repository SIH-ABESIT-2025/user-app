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
    IconButton,
    Tooltip,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Avatar,
    Pagination,
    Grid,
    InputAdornment,
    Chip
} from "@mui/material";
import {
    FaEye,
    FaTrash,
    FaSearch,
    FaFilter,
    FaDownload,
    FaClock,
    FaUser,
    FaEnvelope,
    FaReply
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

interface Message {
    id: string;
    text: string;
    createdAt: Date;
    sender: {
        id: string;
        name?: string;
        username: string;
        photoUrl?: string;
    };
    recipient: {
        id: string;
        name?: string;
        username: string;
        photoUrl?: string;
    };
    photoUrl?: string;
}

interface MessagesResponse {
    messages: Message[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export default function AdminMessages() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    useEffect(() => {
        fetchMessages();
    }, [page, searchTerm]);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "10",
                ...(searchTerm && { search: searchTerm })
            });

            const response = await fetch(`/api/admin/messages?${params}`);
            const data: MessagesResponse = await response.json();
            
            setMessages(data.messages);
            setTotalPages(data.pagination.pages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (message: Message) => {
        setSelectedMessage(message);
        setDetailsOpen(true);
    };

    const handleDeleteMessage = async (messageId: string) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                const response = await fetch(`/api/admin/messages/${messageId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    fetchMessages();
                }
            } catch (error) {
                console.error('Error deleting message:', error);
            }
        }
    };

    const exportMessages = () => {
        // Implementation for exporting messages to CSV/Excel
        console.log('Exporting messages...');
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Messages Management
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<FaDownload />}
                    onClick={exportMessages}
                >
                    Export
                </Button>
            </Box>

            {/* Search */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <TextField
                        fullWidth
                        placeholder="Search messages..."
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

            {/* Messages Table */}
            <Card>
                <CardContent>
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>From</TableCell>
                                    <TableCell>To</TableCell>
                                    <TableCell>Message</TableCell>
                                    <TableCell>Created</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : messages.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            No messages found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    messages.map((message) => (
                                        <TableRow key={message.id} hover>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Avatar
                                                        src={message.sender.photoUrl || "/assets/egg.jpg"}
                                                        alt={message.sender.name || message.sender.username}
                                                        sx={{ width: 32, height: 32 }}
                                                    />
                                                    <Box>
                                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                            {message.sender.name || message.sender.username}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            @{message.sender.username}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Avatar
                                                        src={message.recipient.photoUrl || "/assets/egg.jpg"}
                                                        alt={message.recipient.name || message.recipient.username}
                                                        sx={{ width: 32, height: 32 }}
                                                    />
                                                    <Box>
                                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                            {message.recipient.name || message.recipient.username}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            @{message.recipient.username}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        maxWidth: 300
                                                    }}
                                                >
                                                    {message.text}
                                                </Typography>
                                                {message.photoUrl && (
                                                    <Chip
                                                        label="Has Attachment"
                                                        size="small"
                                                        color="primary"
                                                        sx={{ mt: 0.5 }}
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <FaClock size={12} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                    <Tooltip title="View Details">
                                                        <IconButton 
                                                            size="small"
                                                            onClick={() => handleViewDetails(message)}
                                                        >
                                                            <FaEye />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Reply">
                                                        <IconButton size="small">
                                                            <FaReply />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <IconButton 
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleDeleteMessage(message.id)}
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

            {/* Message Details Dialog */}
            <Dialog 
                open={detailsOpen} 
                onClose={() => setDetailsOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Message Details
                </DialogTitle>
                <DialogContent>
                    {selectedMessage && (
                        <Box sx={{ mt: 2 }}>
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar
                                            src={selectedMessage.sender.photoUrl || "/assets/egg.jpg"}
                                            alt={selectedMessage.sender.name || selectedMessage.sender.username}
                                            sx={{ width: 48, height: 48 }}
                                        />
                                        <Box>
                                            <Typography variant="h6">
                                                From: {selectedMessage.sender.name || selectedMessage.sender.username}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                @{selectedMessage.sender.username}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar
                                            src={selectedMessage.recipient.photoUrl || "/assets/egg.jpg"}
                                            alt={selectedMessage.recipient.name || selectedMessage.recipient.username}
                                            sx={{ width: 48, height: 48 }}
                                        />
                                        <Box>
                                            <Typography variant="h6">
                                                To: {selectedMessage.recipient.name || selectedMessage.recipient.username}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                @{selectedMessage.recipient.username}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>

                            <Typography variant="h6" gutterBottom>
                                Message Content
                            </Typography>
                            <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                                <Typography variant="body1">
                                    {selectedMessage.text}
                                </Typography>
                            </Card>

                            {selectedMessage.photoUrl && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Attachment
                                    </Typography>
                                    <img 
                                        src={selectedMessage.photoUrl} 
                                        alt="Message attachment"
                                        style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                                    />
                                </Box>
                            )}

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <FaClock size={16} />
                                <Typography variant="body2" color="text.secondary">
                                    Sent: {formatDistanceToNow(new Date(selectedMessage.createdAt), { addSuffix: true })}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDetailsOpen(false)}>Close</Button>
                    <Button variant="contained" startIcon={<FaReply />}>
                        Reply
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
