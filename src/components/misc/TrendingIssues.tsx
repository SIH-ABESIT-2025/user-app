import { useState, useEffect } from "react";
import { 
    Box, 
    Typography, 
    Card, 
    CardContent, 
    IconButton, 
    Collapse,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip
} from "@mui/material";
import { 
    FaChevronDown, 
    FaChevronUp,
    FaFire,
    FaRoad,
    FaWater,
    FaLightbulb,
    FaTrash,
    FaBuilding
} from "react-icons/fa";

export default function TrendingIssues() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [trendingIssues, setTrendingIssues] = useState([
        { id: 1, issue: "Road Repairs", count: 45, icon: <FaRoad />, color: "#ff6b6b" },
        { id: 2, issue: "Water Supply", count: 32, icon: <FaWater />, color: "#4ecdc4" },
        { id: 3, issue: "Street Lighting", count: 28, icon: <FaLightbulb />, color: "#ffe66d" },
        { id: 4, issue: "Waste Management", count: 24, icon: <FaTrash />, color: "#95e1d3" },
        { id: 5, issue: "Building Permits", count: 18, icon: <FaBuilding />, color: "#a8e6cf" }
    ]);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

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
                        <FaFire />
                        Trending Issues
                    </Typography>
                    <IconButton size="small">
                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </IconButton>
                </Box>

                <Collapse in={isExpanded}>
                    <Box sx={{ marginTop: 2 }}>
                        <List dense>
                            {trendingIssues.map((issue, index) => (
                                <ListItem key={issue.id} sx={{ padding: '8px 0' }}>
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                        <Box sx={{ color: issue.color }}>
                                            {issue.icon}
                                        </Box>
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={issue.issue}
                                        primaryTypographyProps={{ 
                                            fontSize: '0.9rem', 
                                            fontWeight: 'bold' 
                                        }}
                                    />
                                    <Chip 
                                        label={issue.count}
                                        size="small"
                                        sx={{ 
                                            backgroundColor: issue.color,
                                            color: 'white',
                                            fontWeight: 'bold',
                                            fontSize: '0.7rem'
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>

                        <Box sx={{ 
                            marginTop: 2, 
                            padding: 2, 
                            backgroundColor: 'rgba(0, 123, 255, 0.05)',
                            borderRadius: 2,
                            border: '1px solid rgba(0, 123, 255, 0.1)'
                        }}>
                            <Typography variant="body2" sx={{ 
                                color: 'var(--gov-primary)',
                                fontWeight: 'bold',
                                textAlign: 'center'
                            }}>
                                💡 Tip: Click on any issue to see related complaints
                            </Typography>
                        </Box>
                    </Box>
                </Collapse>
            </CardContent>
        </Card>
    );
}
