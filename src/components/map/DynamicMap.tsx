"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Box, Typography, CircularProgress } from "@mui/material";

import { ComplaintProps } from "@/types/ComplaintProps";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

// Dynamically import the map component with no SSR
const MapComponent = dynamic(() => import("./MapComponent"), { 
    ssr: false,
    loading: () => (
        <Box sx={{ 
            height: "100vh", 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center",
            flexDirection: "column",
            gap: 2
        }}>
            <CircularProgress size={60} />
            <Typography variant="h6" color="text.secondary">
                Loading map...
            </Typography>
        </Box>
    )
});

interface DynamicMapProps {
    complaints: ComplaintProps[];
    userLocation?: { lat: number; lng: number };
    onLocationUpdate?: (location: { lat: number; lng: number }) => void;
}

export default function DynamicMap({ complaints, userLocation, onLocationUpdate }: DynamicMapProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
            <Box sx={{ 
                height: "100vh", 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center",
                flexDirection: "column",
                gap: 2
            }}>
                <CircularProgress size={60} />
                <Typography variant="h6" color="text.secondary">
                    Initializing map...
                </Typography>
            </Box>
        );
    }

    return (
        <MapComponent 
            complaints={complaints}
            userLocation={userLocation}
            onLocationUpdate={onLocationUpdate}
        />
    );
}
