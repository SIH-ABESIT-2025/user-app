"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper, Alert, Collapse, IconButton } from '@mui/material';
import { FaChevronDown, FaChevronUp, FaRefresh, FaBug } from 'react-icons/fa';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
    showDetails: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            showDetails: false
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null,
            showDetails: false
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        
        this.setState({
            error,
            errorInfo
        });

        // Call the onError callback if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }

        // Log to external service in production
        if (process.env.NODE_ENV === 'production') {
            // Here you would typically send to an error reporting service
            console.error('Production error:', {
                error: error.message,
                stack: error.stack,
                componentStack: errorInfo.componentStack,
                timestamp: new Date().toISOString()
            });
        }
    }

    handleRetry = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            showDetails: false
        });
    };

    toggleDetails = () => {
        this.setState(prevState => ({
            showDetails: !prevState.showDetails
        }));
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <FaBug size={24} color="#d32f2f" style={{ marginRight: 12 }} />
                            <Typography variant="h5" color="error" sx={{ fontWeight: 'bold' }}>
                                Something went wrong
                            </Typography>
                        </Box>

                        <Alert severity="error" sx={{ mb: 2 }}>
                            An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
                        </Alert>

                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {this.state.error?.message || 'An unknown error occurred'}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <Button
                                variant="contained"
                                startIcon={<FaRefresh />}
                                onClick={this.handleRetry}
                                color="primary"
                            >
                                Try Again
                            </Button>
                            
                            <Button
                                variant="outlined"
                                onClick={() => window.location.reload()}
                                color="secondary"
                            >
                                Refresh Page
                            </Button>

                            <Button
                                variant="text"
                                endIcon={this.state.showDetails ? <FaChevronUp /> : <FaChevronDown />}
                                onClick={this.toggleDetails}
                                size="small"
                            >
                                {this.state.showDetails ? 'Hide' : 'Show'} Details
                            </Button>
                        </Box>

                        <Collapse in={this.state.showDetails}>
                            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                                    Error Details
                                </Typography>
                                
                                {this.state.error && (
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                            Error Message:
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                fontFamily: 'monospace', 
                                                bgcolor: 'grey.100', 
                                                p: 1, 
                                                borderRadius: 1,
                                                wordBreak: 'break-word'
                                            }}
                                        >
                                            {this.state.error.message}
                                        </Typography>
                                    </Box>
                                )}

                                {this.state.error?.stack && (
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                            Stack Trace:
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                fontFamily: 'monospace', 
                                                bgcolor: 'grey.100', 
                                                p: 1, 
                                                borderRadius: 1,
                                                fontSize: '0.75rem',
                                                whiteSpace: 'pre-wrap',
                                                wordBreak: 'break-word',
                                                maxHeight: 200,
                                                overflow: 'auto'
                                            }}
                                        >
                                            {this.state.error.stack}
                                        </Typography>
                                    </Box>
                                )}

                                {this.state.errorInfo?.componentStack && (
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                            Component Stack:
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                fontFamily: 'monospace', 
                                                bgcolor: 'grey.100', 
                                                p: 1, 
                                                borderRadius: 1,
                                                fontSize: '0.75rem',
                                                whiteSpace: 'pre-wrap',
                                                wordBreak: 'break-word',
                                                maxHeight: 200,
                                                overflow: 'auto'
                                            }}
                                        >
                                            {this.state.errorInfo.componentStack}
                                        </Typography>
                                    </Box>
                                )}

                                <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                                    <Typography variant="body2" color="info.contrastText">
                                        <strong>Debug Information:</strong><br />
                                        • Timestamp: {new Date().toISOString()}<br />
                                        • User Agent: {navigator.userAgent}<br />
                                        • URL: {window.location.href}<br />
                                        • Error ID: {Math.random().toString(36).substr(2, 9)}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Collapse>
                    </Paper>
                </Box>
            );
        }

        return this.props.children;
    }
}
