"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { 
    Box, 
    Card, 
    CardContent, 
    TextField, 
    Button, 
    Typography, 
    InputAdornment,
    Alert,
    CircularProgress,
    Container
} from "@mui/material";
import { FaUserShield, FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import * as yup from "yup";
import Image from "next/image";

const validationSchema = yup.object({
    username: yup
        .string()
        .min(3, "Username should be of minimum 3 characters length.")
        .max(20, "Username should be of maximum 20 characters length.")
        .matches(/^[a-zA-Z0-9_]{1,14}[a-zA-Z0-9]$/, "Username is invalid")
        .required("Username is required."),
    password: yup
        .string()
        .min(8, "Password should be of minimum 8 characters length.")
        .max(100, "Password should be of maximum 100 characters length.")
        .required("Password is required."),
});

export default function AdminLoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            setError("");
            
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values)
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    setError(data.message || "Login failed");
                    setLoading(false);
                    return;
                }

                // Check if user has admin privileges
                if (data.user.role !== "ADMIN" && data.user.role !== "SUPER_ADMIN") {
                    setError("Access denied. Admin privileges required.");
                    setLoading(false);
                    return;
                }

                // Redirect to admin dashboard
                router.push("/admin");
            } catch (error) {
                setError("An error occurred during login. Please try again.");
                setLoading(false);
            }
        },
    });

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 4
                }}
            >
                <Card sx={{ width: '100%', maxWidth: 400 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <Image 
                                    src="/assets/favicon.png" 
                                    alt="Jharkhand Government" 
                                    width={60} 
                                    height={60} 
                                />
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                Admin Login
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Government of Jharkhand - Civic Reporting Platform
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                                <FaUserShield size={20} color="#1976d2" />
                                <Typography variant="body2" sx={{ ml: 1, fontWeight: 'bold' }}>
                                    Administrator Access Required
                                </Typography>
                            </Box>
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={formik.handleSubmit}>
                            <Box sx={{ mb: 3 }}>
                                <TextField
                                    fullWidth
                                    name="username"
                                    label="Username"
                                    placeholder="Enter your username"
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                    error={formik.touched.username && Boolean(formik.errors.username)}
                                    helperText={formik.touched.username && formik.errors.username}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <FaUser />
                                            </InputAdornment>
                                        ),
                                    }}
                                    disabled={loading}
                                />
                            </Box>

                            <Box sx={{ mb: 4 }}>
                                <TextField
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <FaLock />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Button
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    sx={{ minWidth: 'auto', p: 1 }}
                                                >
                                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                </Button>
                                            </InputAdornment>
                                        ),
                                    }}
                                    disabled={loading}
                                />
                            </Box>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{ 
                                    py: 1.5,
                                    fontWeight: 'bold',
                                    textTransform: 'none'
                                }}
                            >
                                {loading ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CircularProgress size={20} color="inherit" />
                                        Signing In...
                                    </Box>
                                ) : (
                                    'Sign In to Admin Dashboard'
                                )}
                            </Button>
                        </form>

                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                                Don't have admin access?{' '}
                                <Button 
                                    variant="text" 
                                    size="small"
                                    onClick={() => router.push('/')}
                                    sx={{ textTransform: 'none' }}
                                >
                                    Return to Homepage
                                </Button>
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}
