"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    TextField,
    Button,
    Switch,
    FormControlLabel,
    Divider,
    Alert,
    Snackbar
} from "@mui/material";
import {
    FaSave,
    FaCog,
    FaDatabase,
    FaShieldAlt,
    FaBell,
    FaGlobe
} from "react-icons/fa";

interface SystemSettings {
    siteName: string;
    siteDescription: string;
    maintenanceMode: boolean;
    allowRegistration: boolean;
    requireEmailVerification: boolean;
    maxFileSize: number;
    allowedFileTypes: string;
    notificationEmail: string;
    supportEmail: string;
}

export default function AdminSettings() {
    const [settings, setSettings] = useState<SystemSettings>({
        siteName: "Government of Jharkhand",
        siteDescription: "Civic Issue Reporting Platform",
        maintenanceMode: false,
        allowRegistration: true,
        requireEmailVerification: false,
        maxFileSize: 10,
        allowedFileTypes: "jpg,jpeg,png,gif,pdf,doc,docx",
        notificationEmail: "notifications@jharkhand.gov.in",
        supportEmail: "support@jharkhand.gov.in"
    });
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            // In a real app, this would fetch from the database
            // For now, we'll use the default settings
            console.log("Fetching settings...");
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            // In a real app, this would save to the database
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            
            setSnackbar({
                open: true,
                message: "Settings saved successfully!",
                severity: "success"
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Failed to save settings",
                severity: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: keyof SystemSettings) => (event: any) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                System Settings
            </Typography>

            <Grid container spacing={3}>
                {/* General Settings */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <FaGlobe size={24} color="#1976d2" />
                                <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                                    General Settings
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Site Name"
                                        value={settings.siteName}
                                        onChange={handleChange('siteName')}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Site Description"
                                        multiline
                                        rows={3}
                                        value={settings.siteDescription}
                                        onChange={handleChange('siteDescription')}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={settings.maintenanceMode}
                                                onChange={handleChange('maintenanceMode')}
                                            />
                                        }
                                        label="Maintenance Mode"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* User Settings */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <FaShieldAlt size={24} color="#2e7d32" />
                                <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                                    User Settings
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={settings.allowRegistration}
                                                onChange={handleChange('allowRegistration')}
                                            />
                                        }
                                        label="Allow New User Registration"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={settings.requireEmailVerification}
                                                onChange={handleChange('requireEmailVerification')}
                                            />
                                        }
                                        label="Require Email Verification"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* File Upload Settings */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <FaDatabase size={24} color="#ed6c02" />
                                <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                                    File Upload Settings
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Max File Size (MB)"
                                        type="number"
                                        value={settings.maxFileSize}
                                        onChange={handleChange('maxFileSize')}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Allowed File Types"
                                        value={settings.allowedFileTypes}
                                        onChange={handleChange('allowedFileTypes')}
                                        helperText="Comma-separated file extensions (e.g., jpg,png,pdf)"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Email Settings */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <FaBell size={24} color="#9c27b0" />
                                <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                                    Email Settings
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Notification Email"
                                        type="email"
                                        value={settings.notificationEmail}
                                        onChange={handleChange('notificationEmail')}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Support Email"
                                        type="email"
                                        value={settings.supportEmail}
                                        onChange={handleChange('supportEmail')}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* System Information */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <FaCog size={24} color="#6c757d" />
                                <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                                    System Information
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={3}>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Version:</strong> 1.0.0
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Database:</strong> PostgreSQL
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Framework:</strong> Next.js 14
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Save Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                    variant="contained"
                    startIcon={<FaSave />}
                    onClick={handleSave}
                    disabled={loading}
                    size="large"
                >
                    {loading ? "Saving..." : "Save Settings"}
                </Button>
            </Box>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert 
                    onClose={() => setSnackbar({ ...snackbar, open: false })} 
                    severity={snackbar.severity}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
