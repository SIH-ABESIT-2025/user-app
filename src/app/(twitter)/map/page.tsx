"use client";

import { useContext, useState, useEffect } from "react";
import { Box, Typography, Alert, CircularProgress } from "@mui/material";

import { useInfiniteComplaints } from "@/hooks/useInfiniteComplaints";
import DynamicMap from "@/components/map/DynamicMap";
import { AuthContext } from "@/contexts/AuthContext";

export default function MapPage() {
    const { token, isPending } = useContext(AuthContext);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>();

    const {
        data,
        isLoading,
        isError,
        error
    } = useInfiniteComplaints({ 
        filters: {} // Get all complaints for the map
    });

    // Get user location on component mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.log("Location not available:", error);
                    // Don't show error, just use default location
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 300000
                }
            );
        }
    }, []);

    if (isPending || isLoading) {
        return (
            <Box sx={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                height: "100vh",
                flexDirection: "column",
                gap: 2
            }}>
                <CircularProgress size={60} />
                <Typography variant="h6" color="text.secondary">
                    Loading complaints map...
                </Typography>
            </Box>
        );
    }

    if (isError) {
        return (
            <Box sx={{ padding: 3 }}>
                <Alert severity="error" sx={{ marginBottom: 2 }}>
                    Failed to load complaints: {(error as Error)?.message || "Unknown error"}
                </Alert>
            </Box>
        );
    }

    // Flatten all pages of complaints
    const complaints = data?.pages.flatMap(page => page.complaints) || [];
    const complaintsWithLocation = complaints.filter(complaint => 
        complaint.latitude && complaint.longitude
    );

    return (
        <Box sx={{ height: "100vh", position: "relative" }}>

            {/* Map Container */}
            <Box sx={{ 
                height: "100vh", 
            }}>
                <DynamicMap 
                    complaints={complaints}
                    userLocation={userLocation}
                    onLocationUpdate={setUserLocation}
                />
            </Box>
        </Box>
    );
}
