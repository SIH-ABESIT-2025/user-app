"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import { FaUserShield, FaHome } from "react-icons/fa";
import Image from "next/image";

export default function AuthErrorPage() {
    const router = useRouter();

    useEffect(() => {
        // Auto-redirect to admin login after 3 seconds
        const timer = setTimeout(() => {
            router.push("/admin-login");
        }, 3000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                p: 2
            }}
        >
            <Card sx={{ maxWidth: 500, width: '100%' }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box sx={{ mb: 3 }}>
                        <Image 
                            src="/assets/favicon.png" 
                            alt="Jharkhand Government" 
                            width={80} 
                            height={80} 
                        />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                        <FaUserShield size={24} color="#d32f2f" />
                        <Typography variant="h4" sx={{ ml: 1, fontWeight: 'bold', color: 'error.main' }}>
                            Access Denied
                        </Typography>
                    </Box>
                    
                    <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
                        You are not authorized to view this page.
                    </Typography>
                    
                    <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                        Admin privileges are required to access this area. You will be redirected to the admin login page automatically.
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            startIcon={<FaUserShield />}
                            onClick={() => router.push("/admin-login")}
                            sx={{ textTransform: 'none' }}
                        >
                            Go to Admin Login
                        </Button>
                        
                        <Button
                            variant="outlined"
                            startIcon={<FaHome />}
                            onClick={() => router.push("/")}
                            sx={{ textTransform: 'none' }}
                        >
                            Return to Homepage
                        </Button>
                    </Box>
                    
                    <Typography variant="caption" sx={{ mt: 2, display: 'block', color: 'text.secondary' }}>
                        Redirecting automatically in 3 seconds...
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}
