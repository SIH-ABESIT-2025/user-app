import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { 
    Dialog, 
    DialogContent, 
    DialogTitle, 
    TextField, 
    InputAdornment, 
    Tabs, 
    Tab, 
    Box,
    Typography,
    Divider,
    Button
} from "@mui/material";
import Image from "next/image";
import * as yup from "yup";

import { CitizenAuthDialogProps } from "@/types/DialogProps";
import { checkUserExists, createUser, logIn } from "@/utilities/fetch";
import CircularLoading from "../misc/CircularLoading";
import CustomSnackbar from "../misc/CustomSnackbar";
import { SnackbarProps } from "@/types/SnackbarProps";
import { AuthContext } from "@/contexts/AuthContext";

export default function CitizenAuthDialog({ open, handleClose }: CitizenAuthDialogProps) {
    const [snackbar, setSnackbar] = useState<SnackbarProps>({ message: "", severity: "success", open: false });
    const [tabValue, setTabValue] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();
    const { refreshToken } = useContext(AuthContext);

    // Registration validation schema
    const registrationSchema = yup.object({
        username: yup
            .string()
            .min(3, "Username should be of minimum 3 characters length.")
            .max(20, "Username should be of maximum 20 characters length.")
            .matches(/^[a-zA-Z0-9_]{1,14}[a-zA-Z0-9]$/, "Username is invalid")
            .required("Username is required.")
            .test("checkUserExists", "User already exists.", async (value) => {
                if (value) {
                    const response = await checkUserExists(value);
                    if (response.success) return false;
                }
                return true;
            }),
        password: yup
            .string()
            .min(8, "Password should be of minimum 8 characters length.")
            .max(100, "Password should be of maximum 100 characters length.")
            .required("Password is required."),
        phoneNumber: yup
            .string()
            .matches(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number")
            .required("Phone number is required."),
        email: yup
            .string()
            .email("Please enter a valid email address")
            .required("Email is required."),
    });

    // Login validation schema
    const loginSchema = yup.object({
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

    // Registration form
    const registrationFormik = useFormik({
        initialValues: {
            username: "",
            password: "",
            phoneNumber: "",
            email: "",
        },
        validationSchema: registrationSchema,
        onSubmit: async (values, { resetForm }) => {
            setIsSubmitting(true);
            try {
                const response = await createUser(JSON.stringify(values));
                if (!response.success) {
                    setSnackbar({
                        message: "Registration failed. Please try again.",
                        severity: "error",
                        open: true,
                    });
                    return;
                }
                resetForm();
                handleClose();
                // Refresh the authentication context
                await refreshToken();
                router.push("/home");
            } catch (error) {
                setSnackbar({
                    message: "Something went wrong. Please try again.",
                    severity: "error",
                    open: true,
                });
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    // Login form
    const loginFormik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: loginSchema,
        onSubmit: async (values, { resetForm }) => {
            setIsSubmitting(true);
            try {
                const response = await logIn(JSON.stringify(values));
                if (!response.success) {
                    setSnackbar({ 
                        message: response.message || "Login failed. Please check your credentials.", 
                        severity: "error", 
                        open: true 
                    });
                    return;
                }
                resetForm();
                handleClose();
                // Refresh the authentication context
                await refreshToken();
                router.push("/home");
            } catch (error) {
                setSnackbar({
                    message: "Something went wrong. Please try again.",
                    severity: "error",
                    open: true,
                });
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        // Reset forms when switching tabs
        registrationFormik.resetForm();
        loginFormik.resetForm();
    };

    const handleCloseDialog = () => {
        setTabValue(0);
        registrationFormik.resetForm();
        loginFormik.resetForm();
        handleClose();
    };

    return (
        <Dialog 
            className="dialog" 
            open={open} 
            onClose={handleCloseDialog}
            maxWidth="sm"
            fullWidth
        >
            <Image className="dialog-icon" src="/assets/favicon.png" alt="Jharkhand Government" width={50} height={50} />
            <DialogTitle className="title">
                <Box sx={{ textAlign: "center", marginBottom: 2 }}>
                    <Typography variant="h4" sx={{ color: "var(--gov-primary)", fontWeight: "bold" }}>
                        Government of Jharkhand
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Civic Issue Reporting System
                    </Typography>
                </Box>
            </DialogTitle>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} centered>
                    <Tab label="Register as Citizen" />
                    <Tab label="Sign In" />
                </Tabs>
            </Box>

            <DialogContent sx={{ padding: 3 }}>
                {/* Registration Form */}
                {tabValue === 0 && (
                    <form onSubmit={registrationFormik.handleSubmit}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Typography variant="h6" sx={{ color: "var(--gov-primary)", marginBottom: 1 }}>
                                Citizen Registration
                            </Typography>
                            
                            <TextField
                                required
                                fullWidth
                                name="username"
                                label="Username"
                                placeholder="Choose a username"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">@</InputAdornment>,
                                }}
                                value={registrationFormik.values.username}
                                onChange={registrationFormik.handleChange}
                                error={registrationFormik.touched.username && Boolean(registrationFormik.errors.username)}
                                helperText={registrationFormik.touched.username && registrationFormik.errors.username}
                            />

                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                placeholder="Create a strong password"
                                value={registrationFormik.values.password}
                                onChange={registrationFormik.handleChange}
                                error={registrationFormik.touched.password && Boolean(registrationFormik.errors.password)}
                                helperText={registrationFormik.touched.password && registrationFormik.errors.password}
                            />

                            <TextField
                                required
                                fullWidth
                                name="phoneNumber"
                                label="Mobile Number"
                                placeholder="Enter 10-digit mobile number"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                                }}
                                value={registrationFormik.values.phoneNumber}
                                onChange={registrationFormik.handleChange}
                                error={registrationFormik.touched.phoneNumber && Boolean(registrationFormik.errors.phoneNumber)}
                                helperText={registrationFormik.touched.phoneNumber && registrationFormik.errors.phoneNumber}
                            />

                            <TextField
                                required
                                fullWidth
                                name="email"
                                label="Email Address"
                                placeholder="Enter your email address"
                                type="email"
                                value={registrationFormik.values.email}
                                onChange={registrationFormik.handleChange}
                                error={registrationFormik.touched.email && Boolean(registrationFormik.errors.email)}
                                helperText={registrationFormik.touched.email && registrationFormik.errors.email}
                            />
                        </Box>
                    </form>
                )}

                {/* Login Form */}
                {tabValue === 1 && (
                    <form onSubmit={loginFormik.handleSubmit}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Typography variant="h6" sx={{ color: "var(--gov-primary)", marginBottom: 1 }}>
                                Citizen Sign In
                            </Typography>

                            <TextField
                                required
                                fullWidth
                                name="username"
                                label="Username"
                                placeholder="Enter your username"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">@</InputAdornment>,
                                }}
                                value={loginFormik.values.username}
                                onChange={loginFormik.handleChange}
                                error={loginFormik.touched.username && Boolean(loginFormik.errors.username)}
                                helperText={loginFormik.touched.username && loginFormik.errors.username}
                                autoFocus
                            />

                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                placeholder="Enter your password"
                                value={loginFormik.values.password}
                                onChange={loginFormik.handleChange}
                                error={loginFormik.touched.password && Boolean(loginFormik.errors.password)}
                                helperText={loginFormik.touched.password && loginFormik.errors.password}
                            />
                        </Box>
                    </form>
                )}
            </DialogContent>

            {/* Action Buttons */}
            <Box sx={{ padding: 3, paddingTop: 0 }}>
                {isSubmitting ? (
                    <CircularLoading />
                ) : (
                    <Button
                        className={`btn btn-dark ${tabValue === 0 ? (!registrationFormik.isValid || !registrationFormik.dirty) : (!loginFormik.isValid || !loginFormik.dirty) ? "disabled" : ""}`}
                        type="submit"
                        disabled={tabValue === 0 ? (!registrationFormik.isValid || !registrationFormik.dirty) : (!loginFormik.isValid || !loginFormik.dirty)}
                        onClick={(e) => {
                            e.preventDefault();
                            if (tabValue === 0) {
                                registrationFormik.handleSubmit();
                            } else {
                                loginFormik.handleSubmit();
                            }
                        }}
                        fullWidth
                        size="large"
                    >
                        {tabValue === 0 ? "Register as Citizen" : "Sign In"}
                    </Button>
                )}
            </Box>

            {snackbar.open && (
                <CustomSnackbar 
                    message={snackbar.message} 
                    severity={snackbar.severity} 
                    setSnackbar={setSnackbar} 
                />
            )}
        </Dialog>
    );
}
