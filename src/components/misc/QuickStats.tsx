import { useState, useEffect } from "react";
import { 
    Box, 
    Typography, 
    Card, 
    CardContent, 
    IconButton, 
    Collapse,
    Grid,
    Chip
} from "@mui/material";
import { 
    FaChevronDown, 
    FaChevronUp,
    FaExclamationTriangle,
    FaCheckCircle,
    FaClock,
    FaChartLine
} from "react-icons/fa";

export default function QuickStats() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [stats, setStats] = useState({
        totalComplaints: 0,
        resolvedToday: 0,
        pending: 0,
        avgResolutionTime: 0
    });

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    // Mock data - in real app, this would come from API
    useEffect(() => {
        // Simulate API call
        setStats({
            totalComplaints: 1247,
            resolvedToday: 23,
            pending: 156,
            avgResolutionTime: 3.2
        });
    }, []);

    return (
        <Card sx={{ 
            marginBottom: 2, 
            backgroundColor: 'var(--gov-white)',
            border: '1px solid var(--border-color)',
            borderRadius: 2
        }}>
            <CardContent sx={{ padding: 2 }}>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                }} onClick={handleToggle}>
                    <Typography variant="h6" sx={{ 
                        fontWeight: 'bold',
                        color: 'var(--gov-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}>
                        <FaChartLine />
                        Quick Stats
                    </Typography>
                    <IconButton size="small">
                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </IconButton>
                </Box>

                <Collapse in={isExpanded}>
                    <Box sx={{ marginTop: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Box sx={{ 
                                    textAlign: 'center',
                                    padding: 2,
                                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                                    borderRadius: 2,
                                    border: '1px solid rgba(0, 123, 255, 0.2)'
                                }}>
                                    <Typography variant="h4" sx={{ 
                                        fontWeight: 'bold',
                                        color: 'var(--gov-primary)'
                                    }}>
                                        {stats.totalComplaints.toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" sx={{ 
                                        color: 'var(--gov-primary)',
                                        fontWeight: 'bold'
                                    }}>
                                        Total Complaints
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={6}>
                                <Box sx={{ 
                                    textAlign: 'center',
                                    padding: 2,
                                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                                    borderRadius: 2,
                                    border: '1px solid rgba(40, 167, 69, 0.2)'
                                }}>
                                    <Typography variant="h4" sx={{ 
                                        fontWeight: 'bold',
                                        color: '#28a745'
                                    }}>
                                        {stats.resolvedToday}
                                    </Typography>
                                    <Typography variant="body2" sx={{ 
                                        color: '#28a745',
                                        fontWeight: 'bold'
                                    }}>
                                        Resolved Today
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={6}>
                                <Box sx={{ 
                                    textAlign: 'center',
                                    padding: 2,
                                    backgroundColor: 'rgba(255, 193, 7, 0.1)',
                                    borderRadius: 2,
                                    border: '1px solid rgba(255, 193, 7, 0.2)'
                                }}>
                                    <Typography variant="h4" sx={{ 
                                        fontWeight: 'bold',
                                        color: '#ffc107'
                                    }}>
                                        {stats.pending}
                                    </Typography>
                                    <Typography variant="body2" sx={{ 
                                        color: '#ffc107',
                                        fontWeight: 'bold'
                                    }}>
                                        Pending
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={6}>
                                <Box sx={{ 
                                    textAlign: 'center',
                                    padding: 2,
                                    backgroundColor: 'rgba(23, 162, 184, 0.1)',
                                    borderRadius: 2,
                                    border: '1px solid rgba(23, 162, 184, 0.2)'
                                }}>
                                    <Typography variant="h4" sx={{ 
                                        fontWeight: 'bold',
                                        color: '#17a2b8'
                                    }}>
                                        {stats.avgResolutionTime}
                                    </Typography>
                                    <Typography variant="body2" sx={{ 
                                        color: '#17a2b8',
                                        fontWeight: 'bold'
                                    }}>
                                        Avg. Days
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>

                        <Box sx={{ marginTop: 2, textAlign: 'center' }}>
                            <Chip 
                                label="Last updated: 2 minutes ago"
                                size="small"
                                sx={{ 
                                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                                    color: 'var(--gov-primary)',
                                    fontSize: '0.7rem'
                                }}
                            />
                        </Box>
                    </Box>
                </Collapse>
            </CardContent>
        </Card>
    );
}
