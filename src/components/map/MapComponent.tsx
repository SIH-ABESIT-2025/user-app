"use client";

import { useEffect, useState, useRef } from "react";
import { Box, Typography, Chip, Avatar, Button, CircularProgress, Alert } from "@mui/material";
import { FaMapMarkerAlt, FaUser, FaClock, FaBuilding, FaEye } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

import { ComplaintProps } from "@/types/ComplaintProps";
import { getFileUrl } from "@/utilities/storage";

interface MapComponentProps {
    complaints: ComplaintProps[];
    userLocation?: { lat: number; lng: number };
    onLocationUpdate?: (location: { lat: number; lng: number }) => void;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case "SUBMITTED": return "#6c757d";
        case "UNDER_REVIEW": return "#ffc107";
        case "IN_PROGRESS": return "#17a2b8";
        case "RESOLVED": return "#28a745";
        case "REJECTED": return "#dc3545";
        case "CLOSED": return "#343a40";
        default: return "#6c757d";
    }
};

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case "LOW": return "#28a745";
        case "MEDIUM": return "#ffc107";
        case "HIGH": return "#fd7e14";
        case "URGENT": return "#dc3545";
        default: return "#6c757d";
    }
};

const getAvatarUrl = (photoUrl?: string) => {
    if (!photoUrl) return "/assets/default-avatar.svg";
    return getFileUrl(photoUrl);
};

export default function MapComponent({ complaints, userLocation, onLocationUpdate }: MapComponentProps) {
    const router = useRouter();
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    // Initialize map when component mounts
    useEffect(() => {
        if (typeof window !== 'undefined' && mapRef.current && !mapInstanceRef.current) {
            // Dynamically import Leaflet
            import('leaflet').then((L) => {
                // Fix for default markers
                delete (L.Icon.Default.prototype as any)._getIconUrl;
                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                });

                // Ensure the map container has proper dimensions
                if (mapRef.current) {
                    mapRef.current.style.height = '100%';
                    mapRef.current.style.width = '100%';
                    mapRef.current.style.position = 'relative';
                }

                // Create map with proper options
                const map = L.map(mapRef.current!, {
                    center: [23.6102, 85.2799],
                    zoom: 13,
                    zoomControl: true,
                    attributionControl: true,
                    preferCanvas: false
                });
                
                // Add tile layer with proper options
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    maxZoom: 19,
                    tileSize: 256,
                    zoomOffset: 0
                }).addTo(map);

                // Force map to invalidate size after a short delay
                setTimeout(() => {
                    if (map) {
                        map.invalidateSize();
                    }
                }, 100);

                mapInstanceRef.current = map;
                setIsMapLoaded(true);
            });
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Update map center when user location changes
    useEffect(() => {
        if (mapInstanceRef.current && userLocation) {
            mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 13);
        }
    }, [userLocation]);

    // Handle window resize to fix map display
    useEffect(() => {
        const handleResize = () => {
            if (mapInstanceRef.current) {
                setTimeout(() => {
                    mapInstanceRef.current.invalidateSize();
                }, 100);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Update markers when complaints change
    useEffect(() => {
        if (!mapInstanceRef.current || !isMapLoaded) return;

        // Clear existing markers
        markersRef.current.forEach(marker => {
            mapInstanceRef.current.removeLayer(marker);
        });
        markersRef.current = [];

        // Add user location marker
        if (userLocation) {
            import('leaflet').then((L) => {
                const userIcon = L.divIcon({
                    className: 'custom-user-marker',
                    html: `<div style="
                        width: 20px; 
                        height: 20px; 
                        background: #007bff; 
                        border: 3px solid white; 
                        border-radius: 50%; 
                        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    "></div>`,
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                });

                const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
                    .addTo(mapInstanceRef.current)
                    .bindPopup(`
                        <div style="text-align: center; min-width: 150px;">
                            <h6 style="font-weight: bold; color: var(--gov-primary); margin: 0 0 8px 0;">Your Location</h6>
                            <p style="margin: 0; color: #6c757d; font-size: 12px;">${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}</p>
                        </div>
                    `);
                
                markersRef.current.push(userMarker);
            });
        }

        // Add complaint markers
        const complaintsWithLocation = complaints.filter(complaint => 
            complaint.latitude && complaint.longitude
        );

        complaintsWithLocation.forEach(complaint => {
            import('leaflet').then((L) => {
                const statusColor = getStatusColor(complaint.status);
                const complaintIcon = L.divIcon({
                    className: 'custom-complaint-marker',
                    html: `<div style="
                        width: 25px; 
                        height: 25px; 
                        background: ${statusColor}; 
                        border: 2px solid white; 
                        border-radius: 50%; 
                        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 12px;
                        font-weight: bold;
                    ">!</div>`,
                    iconSize: [25, 25],
                    iconAnchor: [12, 12]
                });

                const popupContent = `
                    <div style="padding: 8px; max-width: 300px; min-width: 250px;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                            <img src="${getAvatarUrl(complaint.user.photoUrl)}" 
                                 style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" 
                                 alt="${complaint.user.name || complaint.user.username}" />
                            <div style="flex: 1;">
                                <div style="font-weight: bold; font-size: 14px; line-height: 1.2; margin-bottom: 4px;">
                                    ${complaint.title}
                                </div>
                                <div style="color: #6c757d; font-size: 12px;">
                                    ${complaint.user.name || complaint.user.username}
                                </div>
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 12px; font-size: 13px; line-height: 1.4; 
                                    display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; 
                                    overflow: hidden;">
                            ${complaint.description}
                        </div>
                        
                        <div style="display: flex; gap: 4px; margin-bottom: 12px; flex-wrap: wrap;">
                            <span style="background: ${statusColor}; color: white; padding: 2px 6px; 
                                        border-radius: 12px; font-size: 11px; font-weight: bold;">
                                ${complaint.status.replace('_', ' ')}
                            </span>
                            <span style="background: ${getPriorityColor(complaint.priority)}; color: white; padding: 2px 6px; 
                                        border-radius: 12px; font-size: 11px; font-weight: bold;">
                                ${complaint.priority}
                            </span>
                        </div>
                        
                        <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 8px; font-size: 12px; color: #6c757d;">
                            <span>🏢</span> ${complaint.ministry.name}
                        </div>
                        
                        <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 8px; font-size: 12px; color: #6c757d;">
                            <span>🕒</span> ${formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })}
                        </div>
                        
                        ${complaint.location ? `
                            <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 12px; font-size: 12px; color: #6c757d;">
                                <span>📍</span> ${complaint.location}
                            </div>
                        ` : ''}
                        
                        <button onclick="window.open('/complaints/${complaint.id}', '_blank')" 
                                style="width: 100%; background: var(--gov-primary); color: white; border: none; 
                                       padding: 8px; border-radius: 4px; font-size: 12px; cursor: pointer; 
                                       font-weight: bold;">
                            👁️ View Details
                        </button>
                    </div>
                `;

                const complaintMarker = L.marker([complaint.latitude!, complaint.longitude!], { icon: complaintIcon })
                    .addTo(mapInstanceRef.current)
                    .bindPopup(popupContent);
                
                markersRef.current.push(complaintMarker);
            });
        });
    }, [complaints, userLocation, isMapLoaded]);

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            setIsLocating(true);
            setLocationError(null);
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    
                    if (mapInstanceRef.current) {
                        mapInstanceRef.current.setView([coords.lat, coords.lng], 13);
                    }
                    onLocationUpdate?.(coords);
                    setIsLocating(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setIsLocating(false);
                    
                    let errorMessage = "Unable to get your location. ";
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage += "Location access was denied. Please enable location permissions.";
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage += "Location information is unavailable. Please check your device's location settings.";
                            break;
                        case error.TIMEOUT:
                            errorMessage += "Location request timed out. Please try again.";
                            break;
                        default:
                            errorMessage += "Please try again.";
                            break;
                    }
                    setLocationError(errorMessage);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000
                }
            );
        } else {
            setLocationError("Geolocation is not supported by this browser.");
        }
    };

    // Filter complaints that have valid coordinates
    const complaintsWithLocation = (complaints || []).filter(complaint => 
        complaint.latitude && complaint.longitude
    );

    return (
        <Box sx={{ height: "100vh", position: "relative" }}>
            {/* Map Controls */}
            <Box sx={{ 
                position: "absolute", 
                top: 16, 
                left: 16, 
                zIndex: 1000,
                display: "flex",
                flexDirection: "column",
                gap: 1
            }}>
                <Button
                    variant="contained"
                    onClick={getCurrentLocation}
                    disabled={isLocating}
                    startIcon={isLocating ? <CircularProgress size={16} /> : <FaMapMarkerAlt />}
                    sx={{ 
                        backgroundColor: "var(--gov-primary)",
                        "&:hover": { backgroundColor: "var(--gov-primary-dark)" }
                    }}
                >
                    {isLocating ? "Locating..." : "My Location"}
                </Button>
                
                <Chip
                    label={`${complaintsWithLocation.length} complaints on map`}
                    color="primary"
                    variant="outlined"
                    sx={{ backgroundColor: "white", fontWeight: 600 }}
                />
            </Box>

            {/* Location Error Alert */}
            {locationError && (
                <Box sx={{ 
                    position: "absolute", 
                    top: 16, 
                    right: 16, 
                    zIndex: 1000,
                    maxWidth: 300
                }}>
                    <Alert 
                        severity="error" 
                        onClose={() => setLocationError(null)}
                        sx={{ backgroundColor: "white" }}
                    >
                        {locationError}
                    </Alert>
                </Box>
            )}

            {/* Map Container */}
            <div 
                ref={mapRef} 
                style={{ 
                    height: "100%", 
                    width: "100%",
                    zIndex: 1,
                    position: "relative",
                    overflow: "hidden"
                }} 
            />
        </Box>
    );
}
