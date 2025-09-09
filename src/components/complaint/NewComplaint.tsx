import { useState, useEffect } from "react";
import { TextField, Avatar, FormControl, InputLabel, Select, MenuItem, Chip, Box, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { FaRegImage, FaRegFileVideo, FaRegFileAudio, FaMapMarkerAlt } from "react-icons/fa";
import { MdAttachFile } from "react-icons/md";

import CircularLoading from "../misc/CircularLoading";
import { createComplaint, getMinistries } from "@/utilities/fetch";
import { UserProps } from "@/types/UserProps";
import { ComplaintFormData, MinistryProps, ComplaintPriority } from "@/types/ComplaintProps";
import MediaUploader from "../misc/MediaUploader";
import { getFullURL } from "@/utilities/misc/getFullURL";
import { uploadFile } from "@/utilities/storage";
import ProgressCircle from "../misc/ProgressCircle";

interface NewComplaintProps {
    token: UserProps;
    handleSubmit?: () => void;
}

export default function NewComplaint({ token, handleSubmit }: NewComplaintProps) {
    const [showMediaUploader, setShowMediaUploader] = useState(false);
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [count, setCount] = useState(0);
    const [location, setLocation] = useState<string>("");
    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
    const [isGettingLocation, setIsGettingLocation] = useState(false);

    const queryClient = useQueryClient();

    // Fetch ministries
    const { data: ministries, isLoading: ministriesLoading } = useQuery({
        queryKey: ["ministries"],
        queryFn: getMinistries,
    });

    const mutation = useMutation({
        mutationFn: createComplaint,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["complaints"] });
        },
        onError: (error) => console.log(error),
    });

    const handleMediaChange = (files: File[]) => {
        setMediaFiles(files);
    };

    const clearLocation = () => {
        setLocation("");
        setCoordinates(null);
    };

    const getLocationByIP = async () => {
        setIsGettingLocation(true);
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            if (data.city && data.region) {
                const ipLocation = `${data.city}, ${data.region}, ${data.country_name}`;
                setLocation(ipLocation);
                // Note: IP-based location doesn't provide exact coordinates
                setCoordinates(null);
            } else {
                throw new Error('Unable to determine location from IP');
            }
        } catch (error) {
            console.error("Error getting IP location:", error);
            alert("Unable to get your approximate location. Please enter it manually.");
        } finally {
            setIsGettingLocation(false);
        }
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            setIsGettingLocation(true);
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const coords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setCoordinates(coords);
                    
                    // Reverse geocoding to get address
                    try {
                        const response = await fetch(
                            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.lat}&longitude=${coords.lng}&localityLanguage=en`
                        );
                        const data = await response.json();
                        
                        if (data.localityInfo && data.localityInfo.administrative) {
                            const address = data.localityInfo.administrative
                                .map((admin: any) => admin.name)
                                .filter((name: string) => name)
                                .join(', ');
                            setLocation(address);
                        } else if (data.city || data.principalSubdivision) {
                            setLocation(`${data.city || ''}, ${data.principalSubdivision || ''}`.trim().replace(/^,\s*|,\s*$/g, ''));
                        } else {
                            // Fallback to a more readable coordinate format
                            setLocation(`Lat: ${coords.lat.toFixed(4)}, Lng: ${coords.lng.toFixed(4)}`);
                        }
                    } catch (error) {
                        console.error("Error getting address:", error);
                        // Fallback to coordinates if reverse geocoding fails
                        setLocation(`Lat: ${coords.lat.toFixed(4)}, Lng: ${coords.lng.toFixed(4)}`);
                    } finally {
                        setIsGettingLocation(false);
                    }
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setIsGettingLocation(false);
                    
                    let errorMessage = "Unable to get your location. ";
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage += "Location access was denied. Please enable location permissions and try again.";
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage += "Location information is unavailable. Please check your device's location settings or enter location manually.";
                            break;
                        case error.TIMEOUT:
                            errorMessage += "Location request timed out. Please try again or enter location manually.";
                            break;
                        default:
                            errorMessage += "Please enter the location manually.";
                            break;
                    }
                    getLocationByIP()
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000 // 5 minutes
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const validationSchema = yup.object({
        title: yup
            .string()
            .min(10, "Title should be at least 10 characters long.")
            .max(200, "Title should be of maximum 200 characters length.")
            .required("Title is required."),
        description: yup
            .string()
            .min(20, "Description should be at least 20 characters long.")
            .max(2000, "Description should be of maximum 2000 characters length.")
            .required("Description is required."),
        location: yup
            .string()
            .max(200, "Location should be of maximum 200 characters length."),
        ministryId: yup
            .string()
            .required("Please select a ministry/department."),
        priority: yup
            .string()
            .oneOf(["LOW", "MEDIUM", "HIGH", "URGENT"])
            .required("Priority is required."),
    });

    const formik = useFormik<ComplaintFormData>({
        initialValues: {
            title: "",
            description: "",
            location: "",
            priority: "MEDIUM" as ComplaintPriority,
            ministryId: "",
            attachments: [],
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                // Upload media files
                const uploadedAttachments: any[] = [];
                for (const file of mediaFiles) {
                    const attachmentData = await uploadFile(file);
                    if (attachmentData) {
                        uploadedAttachments.push(attachmentData);
                    }
                }

                const complaintData = {
                    ...values,
                    location: location || undefined,
                    latitude: coordinates?.lat,
                    longitude: coordinates?.lng,
                    attachments: uploadedAttachments,
                };

                mutation.mutate(JSON.stringify(complaintData));
                resetForm();
                setCount(0);
                setMediaFiles([]);
                setLocation("");
                setCoordinates(null);
                setShowMediaUploader(false);
                if (handleSubmit) handleSubmit();
            } catch (error) {
                console.error("Error submitting complaint:", error);
            }
        },
    });

    const customHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fieldName = e.target.name;
        if (fieldName === "description") {
            setCount(e.target.value.length);
        }
        formik.handleChange(e);
    };

    const priorityColors = {
        LOW: "#28a745",
        MEDIUM: "#ffc107",
        HIGH: "#fd7e14",
        URGENT: "#dc3545",
    };

    if (formik.isSubmitting || ministriesLoading) {
        return <CircularLoading />;
    }

    return (
        <div className="new-complaint-form">
            <div className="complaint-header">
                <Avatar
                    className="avatar div-link"
                    sx={{ width: 50, height: 50 }}
                    alt=""
                    src={token.photoUrl ? getFullURL(token.photoUrl) : "/assets/egg.jpg"}
                />
                <div className="complaint-title">
                    <h2>Report a Civic Issue</h2>
                    <p>Help us improve your community by reporting issues</p>
                </div>
            </div>

            <form onSubmit={formik.handleSubmit}>
                <div className="input-group">
                    <TextField
                        label="Issue Title"
                        placeholder="Brief description of the issue (e.g., Pothole on Main Street)"
                        fullWidth
                        name="title"
                        value={formik.values.title}
                        onChange={customHandleChange}
                        error={formik.touched.title && Boolean(formik.errors.title)}
                        helperText={formik.touched.title && formik.errors.title}
                        sx={{ marginBottom: 2 }}
                    />
                </div>

                <div className="input-group">
                    <TextField
                        label="Detailed Description"
                        placeholder="Provide detailed information about the issue, including when you noticed it, its impact, and any other relevant details..."
                        multiline
                        minRows={4}
                        fullWidth
                        name="description"
                        value={formik.values.description}
                        onChange={customHandleChange}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={formik.touched.description && formik.errors.description}
                        sx={{ marginBottom: 2 }}
                    />
                    <ProgressCircle maxChars={2000} count={count} />
                </div>

                <div className="input-group">
                    <TextField
                        label="Location (Optional)"
                        placeholder="Enter the exact location or landmark"
                        fullWidth
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        sx={{ marginBottom: 2 }}
                        helperText={
                            coordinates 
                                ? "GPS location detected successfully" 
                                : location 
                                    ? "Approximate location detected" 
                                    : "Use GPS for exact location or IP for approximate location"
                        }
                    />
                    <Box sx={{ display: 'flex', gap: 1, marginBottom: 2, flexWrap: 'wrap' }}>
                        <button
                            type="button"
                            onClick={getCurrentLocation}
                            className="btn btn-light"
                            disabled={isGettingLocation}
                        >
                            <FaMapMarkerAlt /> 
                            {isGettingLocation ? "Detecting..." : "GPS Location"}
                        </button>
                        {/* <button
                            type="button"
                            onClick={getLocationByIP}
                            className="btn btn-outline-secondary"
                            disabled={isGettingLocation}
                            style={{ flex: '1', minWidth: '150px' }}
                        >
                            📍 Approximate Location
                        </button> */}
                    </Box>
                    {location && (
                        <Box sx={{ marginBottom: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 1 }}>
                                <Chip
                                    label={coordinates ? "GPS Location" : "Approximate Location"}
                                    color={coordinates ? "success" : "info"}
                                    variant="outlined"
                                    size="small"
                                />
                                <button
                                    type="button"
                                    onClick={clearLocation}
                                    className="btn btn-sm btn-outline-secondary"
                                    style={{ fontSize: '0.75rem', padding: '2px 8px' }}
                                >
                                    Clear
                                </button>
                            </Box>
                            {coordinates && (
                                <Typography variant="caption" color="text.secondary">
                                    Coordinates: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
                                </Typography>
                            )}
                        </Box>
                    )}
                </div>

                <div className="input-group">
                    <FormControl fullWidth sx={{ marginBottom: 2 }}>
                        <InputLabel>Ministry/Department</InputLabel>
                        <Select
                            name="ministryId"
                            value={formik.values.ministryId}
                            onChange={formik.handleChange}
                            error={formik.touched.ministryId && Boolean(formik.errors.ministryId)}
                            label="Ministry/Department"
                        >
                            {ministries?.map((ministry: MinistryProps) => (
                                <MenuItem key={ministry.id} value={ministry.id}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {ministry.icon && <span>{ministry.icon}</span>}
                                        <span>{ministry.name}</span>
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                <div className="input-group">
                    <FormControl fullWidth sx={{ marginBottom: 2 }}>
                        <InputLabel>Priority Level</InputLabel>
                        <Select
                            name="priority"
                            value={formik.values.priority}
                            onChange={formik.handleChange}
                            error={formik.touched.priority && Boolean(formik.errors.priority)}
                            label="Priority Level"
                        >
                            <MenuItem value="LOW">
                                <Chip label="Low" size="small" style={{ backgroundColor: priorityColors.LOW, color: 'white' }} />
                            </MenuItem>
                            <MenuItem value="MEDIUM">
                                <Chip label="Medium" size="small" style={{ backgroundColor: priorityColors.MEDIUM, color: 'white' }} />
                            </MenuItem>
                            <MenuItem value="HIGH">
                                <Chip label="High" size="small" style={{ backgroundColor: priorityColors.HIGH, color: 'white' }} />
                            </MenuItem>
                            <MenuItem value="URGENT">
                                <Chip label="Urgent" size="small" style={{ backgroundColor: priorityColors.URGENT, color: 'white' }} />
                            </MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <div className="input-group">
                    <Typography variant="subtitle2" sx={{ marginBottom: 1 }}>
                        Attach Media (Optional)
                    </Typography>
                    <div className="media-upload-buttons">
                        <button
                            type="button"
                            onClick={() => setShowMediaUploader(true)}
                            className="btn btn-light"
                            style={{ marginRight: 8 }}
                        >
                            <FaRegImage /> Photos
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowMediaUploader(true)}
                            className="btn btn-light"
                            style={{ marginRight: 8 }}
                        >
                            <FaRegFileVideo /> Videos
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowMediaUploader(true)}
                            className="btn btn-light"
                            style={{ marginRight: 8 }}
                        >
                            <FaRegFileAudio /> Audio
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowMediaUploader(true)}
                            className="btn btn-light"
                        >
                            <MdAttachFile /> Documents
                        </button>
                    </div>
                    {mediaFiles.length > 0 && (
                        <Box sx={{ marginTop: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                {mediaFiles.length} file(s) selected
                            </Typography>
                        </Box>
                    )}
                </div>

                <div className="input-additions">
                    <button
                        className={`btn ${formik.isValid ? "" : "disabled"}`}
                        disabled={!formik.isValid || mutation.isPending}
                        type="submit"
                    >
                        {mutation.isPending ? "Submitting..." : "Submit Complaint"}
                    </button>
                </div>

                {showMediaUploader && (
                    <MediaUploader
                        handleMediaChange={handleMediaChange}
                        onClose={() => setShowMediaUploader(false)}
                        acceptedTypes={["image/*", "video/*", "audio/*", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]}
                    />
                )}
            </form>
        </div>
    );
}
