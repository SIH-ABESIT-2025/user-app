import { useState } from "react";
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
    Divider
} from "@mui/material";
import { 
    FaPhone, 
    FaEnvelope, 
    FaMapMarkerAlt, 
    FaClock, 
    FaChevronDown, 
    FaChevronUp,
    FaWhatsapp,
    FaGlobe
} from "react-icons/fa";

export default function HelplineInfo() {
    const [isExpanded, setIsExpanded] = useState(false);

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
                        <FaPhone />
                        Emergency Helplines
                    </Typography>
                    <IconButton size="small">
                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </IconButton>
                </Box>

                <Collapse in={isExpanded}>
                    <Box sx={{ marginTop: 2 }}>
                        <List dense>
                            <ListItem sx={{ padding: '8px 0' }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                    <FaPhone color="var(--gov-primary)" size={16} />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Emergency Services"
                                    secondary="108 (Ambulance), 100 (Police), 101 (Fire)"
                                    primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 'bold' }}
                                    secondaryTypographyProps={{ fontSize: '0.8rem' }}
                                />
                            </ListItem>

                            <ListItem sx={{ padding: '8px 0' }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                    <FaPhone color="var(--gov-primary)" size={16} />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Civic Issues Helpline"
                                    secondary="1800-XXX-XXXX (Toll Free)"
                                    primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 'bold' }}
                                    secondaryTypographyProps={{ fontSize: '0.8rem' }}
                                />
                            </ListItem>

                            <ListItem sx={{ padding: '8px 0' }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                    <FaWhatsapp color="var(--gov-primary)" size={16} />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="WhatsApp Support"
                                    secondary="+91-XXXXX-XXXXX"
                                    primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 'bold' }}
                                    secondaryTypographyProps={{ fontSize: '0.8rem' }}
                                />
                            </ListItem>

                            <Divider sx={{ margin: '8px 0' }} />

                            <ListItem sx={{ padding: '8px 0' }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                    <FaEnvelope color="var(--gov-primary)" size={16} />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Email Support"
                                    secondary="support@jharkhand.gov.in"
                                    primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 'bold' }}
                                    secondaryTypographyProps={{ fontSize: '0.8rem' }}
                                />
                            </ListItem>

                            <ListItem sx={{ padding: '8px 0' }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                    <FaClock color="var(--gov-primary)" size={16} />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Working Hours"
                                    secondary="Mon-Fri: 9:00 AM - 6:00 PM"
                                    primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 'bold' }}
                                    secondaryTypographyProps={{ fontSize: '0.8rem' }}
                                />
                            </ListItem>

                            <ListItem sx={{ padding: '8px 0' }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                    <FaMapMarkerAlt color="var(--gov-primary)" size={16} />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Headquarters"
                                    secondary="Ranchi, Jharkhand"
                                    primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 'bold' }}
                                    secondaryTypographyProps={{ fontSize: '0.8rem' }}
                                />
                            </ListItem>
                        </List>
                    </Box>
                </Collapse>
            </CardContent>
        </Card>
    );
}
