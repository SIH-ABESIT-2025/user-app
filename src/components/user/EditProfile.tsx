import { useRef, useState } from "react";
import { useFormik } from "formik";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, TextField, Box, Typography, Card, CardContent } from "@mui/material";
import { MdOutlineAddAPhoto } from "react-icons/md";
import { FaUser, FaMapMarkerAlt, FaGlobe, FaPhone, FaEnvelope } from "react-icons/fa";
import * as yup from "yup";
import Image from "next/image";

import { UserProps } from "@/types/UserProps";
import CircularLoading from "../misc/CircularLoading";
import { uploadFile } from "@/utilities/storage";
import { editUser } from "@/utilities/fetch";
import { getFullURL } from "@/utilities/misc/getFullURL";
import CustomSnackbar from "../misc/CustomSnackbar";
import { SnackbarProps } from "@/types/SnackbarProps";

export default function EditProfile({ profile, refreshToken }: { profile: UserProps; refreshToken: () => void }) {
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [snackbar, setSnackbar] = useState<SnackbarProps>({ message: "", severity: "success", open: false });

    const photoUploadInputRef = useRef<HTMLInputElement>(null);

    const queryClient = useQueryClient();

    const handlePhotoChange = (event: any) => {
        const file = event.target.files[0];
        setPhotoPreview(URL.createObjectURL(file));
        setPhotoFile(file);
    };
    const handlePhotoClick = () => {
        photoUploadInputRef.current?.click();
    };

    const validationSchema = yup.object({
        name: yup.string().max(50, "Name should be of maximum 50 characters length."),
        description: yup.string().max(160, "Bio should be of maximum 160 characters length."),
        location: yup.string().max(30, "Location should be of maximum 30 characters length."),
        website: yup.string().max(30, "Website should be of maximum 30 characters length."),
        photoUrl: yup.string(),
    });

    const formik = useFormik({
        initialValues: {
            name: profile.name ?? "",
            description: profile.description ?? "",
            location: profile.location ?? "",
            website: profile.website ?? "",
            photoUrl: profile.photoUrl ?? "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            if (photoFile) {
                const path: string | void = await uploadFile(photoFile);
                if (!path) throw new Error("Photo upload failed.");
                values.photoUrl = path;
            }
            const jsonValues = JSON.stringify(values);
            const response = await editUser(jsonValues, profile.username);
            if (!response.success) {
                return setSnackbar({
                    message: "Something went wrong while updating profile. Please try again.",
                    severity: "error",
                    open: true,
                });
            }
            setSnackbar({
                message: "Your profile has been updated successfully.",
                severity: "success",
                open: true,
            });
            refreshToken();
            queryClient.invalidateQueries(["users", profile.username]);
        },
    });


    return (
        <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 2 }}>
            {/* Profile Header */}
            <Card sx={{ marginBottom: 3, padding: 3 }}>
                <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3
                }}>
                    <Box sx={{ position: 'relative' }}>
                        <Avatar
                            sx={{ 
                                width: 120, 
                                height: 120,
                                border: '4px solid var(--gov-primary)',
                                boxShadow: 2
                            }}
                            alt="Profile Picture"
                            src={
                                photoPreview ? photoPreview : profile.photoUrl ? getFullURL(profile.photoUrl) : "/assets/default-avatar.svg"
                            }
                        />
                        <button 
                            className="icon-hoverable add-photo" 
                            onClick={handlePhotoClick}
                            style={{ 
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                background: 'var(--gov-primary)',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                padding: 8,
                                borderRadius: '50%',
                                width: 36,
                                height: 36,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <MdOutlineAddAPhoto size={16} />
                        </button>
                        <input
                            ref={photoUploadInputRef}
                            type="file"
                            style={{ display: "none" }}
                            onChange={handlePhotoChange}
                            accept="image/*"
                        />
                    </Box>
                    
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'var(--gov-primary)' }}>
                            {profile.name || profile.username}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            @{profile.username}
                        </Typography>
                    </Box>
                </Box>
            </Card>
            {/* Profile Information Form */}
            <Card sx={{ marginBottom: 3 }}>
                <CardContent sx={{ padding: 3 }}>
                    <Typography variant="h5" sx={{ 
                        fontWeight: 'bold', 
                        marginBottom: 3,
                        color: 'var(--gov-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}>
                        <FaUser />
                        Edit Citizen Profile
                    </Typography>
                    
                    <form onSubmit={formik.handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <TextField
                                fullWidth
                                name="name"
                                label="Full Name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                                InputProps={{
                                    startAdornment: <FaUser style={{ marginRight: 8, color: 'var(--gov-primary)' }} />
                                }}
                            />
                            
                            <TextField
                                fullWidth
                                name="description"
                                label="Bio / About You"
                                multiline
                                minRows={3}
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                error={formik.touched.description && Boolean(formik.errors.description)}
                                helperText={formik.touched.description && formik.errors.description}
                                placeholder="Tell us about yourself, your interests, or how you contribute to the community..."
                            />
                            
                            <TextField
                                fullWidth
                                name="location"
                                label="Location"
                                value={formik.values.location}
                                onChange={formik.handleChange}
                                error={formik.touched.location && Boolean(formik.errors.location)}
                                helperText={formik.touched.location && formik.errors.location}
                                InputProps={{
                                    startAdornment: <FaMapMarkerAlt style={{ marginRight: 8, color: 'var(--gov-primary)' }} />
                                }}
                                placeholder="City, District, Jharkhand"
                            />
                            
                            <TextField
                                fullWidth
                                name="website"
                                label="Website / Social Media"
                                value={formik.values.website}
                                onChange={formik.handleChange}
                                error={formik.touched.website && Boolean(formik.errors.website)}
                                helperText={formik.touched.website && formik.errors.website}
                                InputProps={{
                                    startAdornment: <FaGlobe style={{ marginRight: 8, color: 'var(--gov-primary)' }} />
                                }}
                                placeholder="https://your-website.com"
                            />
                            
                            {/* Read-only contact information */}
                            <Box sx={{ 
                                padding: 2, 
                                backgroundColor: 'rgba(0, 123, 255, 0.05)',
                                borderRadius: 2,
                                border: '1px solid rgba(0, 123, 255, 0.1)'
                            }}>
                                <Typography variant="h6" sx={{ 
                                    marginBottom: 2,
                                    color: 'var(--gov-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                    <FaPhone />
                                    Contact Information
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <FaPhone size={14} color="var(--gov-primary)" />
                                        <Typography variant="body2">
                                            <strong>Phone:</strong> {profile.phoneNumber}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <FaEnvelope size={14} color="var(--gov-primary)" />
                                        <Typography variant="body2">
                                            <strong>Email:</strong> {profile.email}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ marginTop: 1, display: 'block' }}>
                                    Contact information cannot be changed here. Contact support if you need to update these details.
                                </Typography>
                            </Box>
                            
                            {formik.isSubmitting ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
                                    <CircularLoading />
                                </Box>
                            ) : (
                                <button
                                    className={`btn btn-dark save ${formik.isValid ? "" : "disabled"}`}
                                    disabled={!formik.isValid}
                                    type="submit"
                                    style={{
                                        backgroundColor: 'var(--gov-primary)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '12px 24px',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        cursor: formik.isValid ? 'pointer' : 'not-allowed',
                                        opacity: formik.isValid ? 1 : 0.6,
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Update Profile
                                </button>
                            )}
                        </Box>
                    </form>
                </CardContent>
            </Card>
            {snackbar.open && (
                <CustomSnackbar message={snackbar.message} severity={snackbar.severity} setSnackbar={setSnackbar} />
            )}
        </Box>
    );
}
