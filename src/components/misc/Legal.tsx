import { Box, Typography, Link } from "@mui/material";
import { FaExternalLinkAlt } from "react-icons/fa";

export default function Legal() {
    return (
        <Box sx={{ 
            padding: 2,
            backgroundColor: 'var(--gov-white)',
            border: '1px solid var(--border-color)',
            borderRadius: 2,
            marginTop: 2
        }}>
            <Typography variant="h6" sx={{ 
                fontWeight: 'bold',
                color: 'var(--gov-primary)',
                marginBottom: 2
            }}>
                Legal & Information
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link 
                    href="https://jharkhand.gov.in/terms" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        textDecoration: 'none',
                        color: 'var(--gov-primary)',
                        fontSize: '0.9rem',
                        '&:hover': { textDecoration: 'underline' }
                    }}
                >
                    Terms of Service <FaExternalLinkAlt size={12} />
                </Link>
                
                <Link 
                    href="https://jharkhand.gov.in/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        textDecoration: 'none',
                        color: 'var(--gov-primary)',
                        fontSize: '0.9rem',
                        '&:hover': { textDecoration: 'underline' }
                    }}
                >
                    Privacy Policy <FaExternalLinkAlt size={12} />
                </Link>
                
                <Link 
                    href="https://jharkhand.gov.in/accessibility" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        textDecoration: 'none',
                        color: 'var(--gov-primary)',
                        fontSize: '0.9rem',
                        '&:hover': { textDecoration: 'underline' }
                    }}
                >
                    Accessibility <FaExternalLinkAlt size={12} />
                </Link>
                
                <Link 
                    href="https://rti.jharkhand.gov.in" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        textDecoration: 'none',
                        color: 'var(--gov-primary)',
                        fontSize: '0.9rem',
                        '&:hover': { textDecoration: 'underline' }
                    }}
                >
                    RTI Portal <FaExternalLinkAlt size={12} />
                </Link>
            </Box>
            
            <Box sx={{ 
                marginTop: 2, 
                paddingTop: 2, 
                borderTop: '1px solid var(--border-color)',
                textAlign: 'center'
            }}>
                <Typography variant="body2" sx={{ 
                    color: 'var(--text-secondary)',
                    fontSize: '0.8rem'
                }}>
                    © 2024 Government of Jharkhand
                </Typography>
                <Typography variant="body2" sx={{ 
                    color: 'var(--text-secondary)',
                    fontSize: '0.8rem'
                }}>
                    All rights reserved
                </Typography>
            </Box>
        </Box>
    );
}
