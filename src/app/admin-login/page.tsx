'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    Container,
    Paper,
    InputAdornment,
    IconButton,
    Divider
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AdminPanelSettings from '@mui/icons-material/AdminPanelSettings';
import LoginIcon from '@mui/icons-material/Login';
import Image from 'next/image';

import useAuth from '@/hooks/useAuth';

const validationSchema = yup.object({
    username: yup
        .string()
        .min(3, 'Username should be of minimum 3 characters length.')
        .max(20, 'Username should be of maximum 20 characters length.')
        .matches(/^[a-zA-Z0-9_]{1,14}[a-zA-Z0-9]$/, 'Username is invalid')
        .required('Username is required.'),
    password: yup
        .string()
        .min(8, 'Password should be of minimum 8 characters length.')
        .max(100, 'Password should be of maximum 100 characters length.')
        .required('Password is required.'),
});

export default function AdminLoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const auth = useAuth();
    const router = useRouter();

    // Admin authentication removed - redirect to admin dashboard
    useEffect(() => {
        // Always redirect to admin dashboard since auth is disabled
        router.replace('/admin');
    }, [router]);

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm }) => {
            setIsLoading(true);
            setError('');
            setSuccess('');

            try {
                const response = await fetch('/api/auth/admin-login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });

                const data = await response.json();
                
                if (!data.success) {
                    setError(data.message || 'Login failed. Please check your credentials.');
                    return;
                }

                setSuccess('Login successful! Redirecting to admin dashboard...');
                setTimeout(() => {
                    router.replace('/admin');
                }, 1000);
            } catch (error) {
                console.error('Login error:', error);
                setError('An unexpected error occurred. Please try again.');
            } finally {
                setIsLoading(false);
            }
        },
    });

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    if (auth.isPending) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                bgcolor="#f5f5f5"
            >
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4,
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={24}
                    sx={{
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    }}
                >
                    <Box
                        sx={{
                            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                            color: 'white',
                            p: 4,
                            textAlign: 'center',
                        }}
                    >
                        <AdminPanelSettings sx={{ fontSize: 60, mb: 2 }} />
                        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                            Admin Login
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                            Jharkhand Civic Reporting Platform
                        </Typography>
                    </Box>

                    <CardContent sx={{ p: 4 }}>
                        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
                            {error && (
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    {error}
                                </Alert>
                            )}
                            
                            {success && (
                                <Alert severity="success" sx={{ mb: 3 }}>
                                    {success}
                                </Alert>
                            )}

                            <TextField
                                fullWidth
                                id="username"
                                name="username"
                                label="Username"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.username && Boolean(formik.errors.username)}
                                helperText={formik.touched.username && formik.errors.username}
                                disabled={isLoading}
                                sx={{ mb: 3 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AdminPanelSettings color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                id="password"
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                                disabled={isLoading}
                                sx={{ mb: 3 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LoginIcon color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                                disabled={isLoading}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={isLoading}
                                sx={{
                                    py: 1.5,
                                    mb: 3,
                                    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                                    },
                                }}
                                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                            >
                                {isLoading ? 'Signing In...' : 'Sign In to Admin Panel'}
                            </Button>

                            <Divider sx={{ my: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Default Admin Credentials
                                </Typography>
                            </Divider>

                            <Box sx={{ textAlign: 'center', mb: 2 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    <strong>Super Admin:</strong> admin / admin123
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Ministry Staff:</strong> ministry_staff / staff123
                                </Typography>
                            </Box>

                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => router.push('/')}
                                disabled={isLoading}
                                sx={{ mt: 2 }}
                            >
                                Back to Home
                            </Button>
                        </Box>
                    </CardContent>
                </Paper>
            </Container>
        </Box>
    );
}
