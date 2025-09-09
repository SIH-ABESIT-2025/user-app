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
    Divider,
    Link
} from "@mui/material";
import { 
    FaChevronDown, 
    FaChevronUp,
    FaGlobe,
    FaFileAlt,
    FaNewspaper,
    FaDownload,
    FaInfoCircle,
    FaUsers,
    FaChartBar
} from "react-icons/fa";

export default function GovernmentLinks() {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    const governmentLinks = [
        {
            title: "Official Website",
            url: "https://jharkhand.gov.in",
            icon: <FaGlobe />,
            description: "Main government portal"
        },
        {
            title: "Chief Minister's Office",
            url: "https://cm.jharkhand.gov.in",
            icon: <FaUsers />,
            description: "CM's official website"
        },
        {
            title: "Department Directory",
            url: "https://jharkhand.gov.in/departments",
            icon: <FaFileAlt />,
            description: "All government departments"
        },
        {
            title: "Public Grievances",
            url: "https://pgportal.gov.in",
            icon: <FaInfoCircle />,
            description: "Central grievance portal"
        },
        {
            title: "RTI Portal",
            url: "https://rti.jharkhand.gov.in",
            icon: <FaFileAlt />,
            description: "Right to Information"
        },
        {
            title: "Budget & Finance",
            url: "https://finance.jharkhand.gov.in",
            icon: <FaChartBar />,
            description: "Financial information"
        },
        {
            title: "Press Releases",
            url: "https://jharkhand.gov.in/press",
            icon: <FaNewspaper />,
            description: "Latest announcements"
        },
        {
            title: "Forms & Downloads",
            url: "https://jharkhand.gov.in/forms",
            icon: <FaDownload />,
            description: "Government forms"
        }
    ];

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
                        <FaGlobe />
                        Government Resources
                    </Typography>
                    <IconButton size="small">
                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </IconButton>
                </Box>

                <Collapse in={isExpanded}>
                    <Box sx={{ marginTop: 2 }}>
                        <List dense>
                            {governmentLinks.map((link, index) => (
                                <ListItem key={index} sx={{ padding: '8px 0' }}>
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                        {link.icon}
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={
                                            <Link 
                                                href={link.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                sx={{ 
                                                    textDecoration: 'none',
                                                    color: 'var(--gov-primary)',
                                                    fontSize: '0.9rem',
                                                    fontWeight: 'bold',
                                                    '&:hover': {
                                                        textDecoration: 'underline'
                                                    }
                                                }}
                                            >
                                                {link.title}
                                            </Link>
                                        }
                                        secondary={link.description}
                                        secondaryTypographyProps={{ fontSize: '0.8rem' }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Collapse>
            </CardContent>
        </Card>
    );
}
