'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Typography, Card, CardContent, Alert, CircularProgress } from '@mui/material';
import useAuth from '@/hooks/useAuth';

export default function TestAdminAuth() {
    const [testResults, setTestResults] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const auth = useAuth();
    const router = useRouter();

    const addResult = (message: string) => {
        setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    const testAdminAuth = async () => {
        setIsLoading(true);
        setTestResults([]);
        
        try {
            // Test 1: Check if user is logged in
            addResult('Testing authentication status...');
            if (!auth.token) {
                addResult('❌ No authentication token found');
                return;
            }
            addResult('✅ Authentication token found');

            // Test 2: Check user role
            addResult('Testing user role...');
            if (auth.token.role !== 'ADMIN' && auth.token.role !== 'SUPER_ADMIN') {
                addResult(`❌ Invalid role: ${auth.token.role}. Expected ADMIN or SUPER_ADMIN`);
                return;
            }
            addResult(`✅ Valid admin role: ${auth.token.role}`);

            // Test 3: Test admin API access
            addResult('Testing admin API access...');
            const response = await fetch('/api/admin/dashboard/complaints');
            if (!response.ok) {
                addResult(`❌ Admin API access failed: ${response.status} ${response.statusText}`);
                return;
            }
            addResult('✅ Admin API access successful');

            // Test 4: Test admin dashboard access
            addResult('Testing admin dashboard access...');
            const dashboardResponse = await fetch('/api/admin/dashboard/users');
            if (!dashboardResponse.ok) {
                addResult(`❌ Admin dashboard API failed: ${dashboardResponse.status} ${dashboardResponse.statusText}`);
                return;
            }
            addResult('✅ Admin dashboard API access successful');

            addResult('🎉 All admin authentication tests passed!');
            
        } catch (error) {
            addResult(`❌ Test failed with error: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    const testUnauthorizedAccess = async () => {
        setIsLoading(true);
        setTestResults([]);
        
        try {
            addResult('Testing unauthorized access to admin routes...');
            
            // Test accessing admin routes without proper authentication
            const response = await fetch('/api/admin/complaints');
            if (response.status === 401) {
                addResult('✅ Unauthorized access properly blocked (401)');
            } else if (response.status === 200) {
                addResult('❌ Unauthorized access allowed (200) - Security issue!');
            } else {
                addResult(`⚠️ Unexpected response: ${response.status}`);
            }
            
        } catch (error) {
            addResult(`❌ Test failed with error: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    const clearResults = () => {
        setTestResults([]);
    };

    if (auth.isPending) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom>
                Admin Authentication Test
            </Typography>
            
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Current Authentication Status
                    </Typography>
                    {auth.token ? (
                        <Box>
                            <Typography>✅ Logged in as: {auth.token.username}</Typography>
                            <Typography>Role: {auth.token.role}</Typography>
                            <Typography>Active: {auth.token.isActive ? 'Yes' : 'No'}</Typography>
                        </Box>
                    ) : (
                        <Typography color="error">❌ Not logged in</Typography>
                    )}
                </CardContent>
            </Card>

            <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                <Button
                    variant="contained"
                    onClick={testAdminAuth}
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} /> : null}
                >
                    Test Admin Auth
                </Button>
                
                <Button
                    variant="outlined"
                    onClick={testUnauthorizedAccess}
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} /> : null}
                >
                    Test Unauthorized Access
                </Button>
                
                <Button
                    variant="text"
                    onClick={clearResults}
                    disabled={isLoading}
                >
                    Clear Results
                </Button>
            </Box>

            {testResults.length > 0 && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Test Results
                        </Typography>
                        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                            {testResults.map((result, index) => (
                                <Typography
                                    key={index}
                                    variant="body2"
                                    sx={{
                                        fontFamily: 'monospace',
                                        mb: 0.5,
                                        color: result.includes('❌') ? 'error.main' : 
                                               result.includes('✅') ? 'success.main' : 
                                               result.includes('⚠️') ? 'warning.main' : 'text.primary'
                                    }}
                                >
                                    {result}
                                </Typography>
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            )}

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                    variant="contained"
                    onClick={() => router.push('/admin')}
                    disabled={!auth.token || (auth.token.role !== 'ADMIN' && auth.token.role !== 'SUPER_ADMIN')}
                >
                    Go to Admin Dashboard
                </Button>
                
                <Button
                    variant="outlined"
                    onClick={() => router.push('/admin-login')}
                >
                    Go to Admin Login
                </Button>
                
                <Button
                    variant="text"
                    onClick={() => router.push('/')}
                >
                    Back to Home
                </Button>
            </Box>
        </Box>
    );
}
