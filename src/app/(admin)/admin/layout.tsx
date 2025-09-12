"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Drawer, AppBar, Toolbar, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Avatar, IconButton, Menu, MenuItem, Badge } from "@mui/material";
import { 
    FaHome, 
    FaUsers, 
    FaClipboardList, 
    FaBuilding, 
    FaChartBar, 
    FaCog, 
    FaBell, 
    FaSignOutAlt,
    FaBars,
    FaUserShield,
    FaMapMarkedAlt,
    FaComments
} from "react-icons/fa";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthContext } from "@/contexts/AuthContext";
import useAuth from "@/hooks/useAuth";
import GlobalLoading from "@/components/misc/GlobalLoading";
import { logout } from "@/utilities/fetch";
import { getFullURL } from "@/utilities/misc/getFullURL";

const drawerWidth = 280;
const mobileDrawerWidth = 240;

const adminMenuItems = [
    { text: "Dashboard", icon: <FaHome />, path: "/admin" },
    { text: "Complaints", icon: <FaClipboardList />, path: "/admin/complaints" },
    { text: "Users", icon: <FaUsers />, path: "/admin/users" },
    { text: "Ministries", icon: <FaBuilding />, path: "/admin/ministries" },
    { text: "Analytics", icon: <FaChartBar />, path: "/admin/analytics" },
    { text: "Map View", icon: <FaMapMarkedAlt />, path: "/admin/map-view" },
    { text: "Messages", icon: <FaComments />, path: "/admin/messages" },
    { text: "Settings", icon: <FaCog />, path: "/admin/admin-settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    
    const auth = useAuth();
    const router = useRouter();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await logout();
        router.push("/");
    };

    const handleMenuClick = (path: string) => {
        router.push(path);
        setMobileOpen(false);
    };

    // Admin authentication removed - dashboard is now accessible without login
    // if (auth.isPending) {
    //     return <GlobalLoading />;
    // }

    // if (!auth.token || (auth.token.role !== "ADMIN" && auth.token.role !== "SUPER_ADMIN")) {
    //     router.replace("/admin-login");
    //     return <GlobalLoading />;
    // }

    const drawer = (
        <Box>
            <Toolbar>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FaUserShield size={24} color="#1976d2" />
                    <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
                        Admin Panel
                    </Typography>
                </Box>
            </Toolbar>
            <Divider />
            <List>
                {adminMenuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton onClick={() => handleMenuClick(item.path)}>
                            <ListItemIcon sx={{ color: 'text.secondary' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <ThemeProvider>
            <AuthContext.Provider value={auth}>
                <Box sx={{ display: 'flex' }}>
                    <AppBar
                        position="fixed"
                        sx={{
                            width: { 
                                xs: '100%',
                                sm: `calc(100% - ${drawerWidth}px)` 
                            },
                            ml: { 
                                xs: 0,
                                sm: `${drawerWidth}px` 
                            },
                            zIndex: (theme) => theme.zIndex.drawer + 1,
                        }}
                    >
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ 
                                    mr: 2, 
                                    display: { sm: 'none' } 
                                }}
                            >
                                <FaBars />
                            </IconButton>
                            <Typography 
                                variant="h6" 
                                noWrap 
                                component="div" 
                                sx={{ 
                                    flexGrow: 1,
                                    fontSize: { xs: '1rem', sm: '1.25rem' },
                                    display: { xs: 'none', sm: 'block' }
                                }}
                            >
                                Government of Jharkhand - Admin Dashboard
                            </Typography>
                            <Typography 
                                variant="h6" 
                                noWrap 
                                component="div" 
                                sx={{ 
                                    flexGrow: 1,
                                    fontSize: '1rem',
                                    display: { xs: 'block', sm: 'none' }
                                }}
                            >
                                Admin Dashboard
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <IconButton color="inherit">
                                    <Badge badgeContent={0} color="error">
                                        <FaBell />
                                    </Badge>
                                </IconButton>
                                <IconButton
                                    size="large"
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-controls="primary-search-account-menu"
                                    aria-haspopup="true"
                                    onClick={handleProfileMenuOpen}
                                    color="inherit"
                                >
                                    <Avatar
                                        src={auth.token?.photoUrl ? getFullURL(auth.token.photoUrl) : "/assets/default-avatar.svg"}
                                        alt={auth.token?.name || auth.token?.username}
                                        sx={{ width: 32, height: 32 }}
                                    />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorEl)}
                                    onClose={handleProfileMenuClose}
                                >
                                    <MenuItem onClick={handleProfileMenuClose}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <FaUserShield size={16} />
                                            <Typography variant="body2">
                                                {auth.token?.name || auth.token?.username}
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem onClick={handleLogout} disabled={isLoggingOut}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <FaSignOutAlt size={16} />
                                            <Typography variant="body2">
                                                {isLoggingOut ? "Logging out..." : "Logout"}
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </Toolbar>
                    </AppBar>
                    <Box
                        component="nav"
                        sx={{ 
                            width: { sm: drawerWidth }, 
                            flexShrink: { sm: 0 } 
                        }}
                        aria-label="mailbox folders"
                    >
                        <Drawer
                            variant="temporary"
                            open={mobileOpen}
                            onClose={handleDrawerToggle}
                            ModalProps={{
                                keepMounted: true,
                            }}
                            sx={{
                                display: { xs: 'block', sm: 'none' },
                                '& .MuiDrawer-paper': { 
                                    boxSizing: 'border-box', 
                                    width: mobileDrawerWidth,
                                    maxWidth: '80vw'
                                },
                            }}
                        >
                            {drawer}
                        </Drawer>
                        <Drawer
                            variant="permanent"
                            sx={{
                                display: { xs: 'none', sm: 'block' },
                                '& .MuiDrawer-paper': { 
                                    boxSizing: 'border-box', 
                                    width: drawerWidth 
                                },
                            }}
                            open
                        >
                            {drawer}
                        </Drawer>
                    </Box>
                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            p: { xs: 2, sm: 3 },
                            width: { 
                                xs: '100%',
                                sm: `calc(100% - ${drawerWidth}px)` 
                            },
                            mt: { xs: 7, sm: 8 },
                            minHeight: '100vh',
                            backgroundColor: '#f5f5f5'
                        }}
                    >
                        {children}
                    </Box>
                </Box>
            </AuthContext.Provider>
        </ThemeProvider>
    );
}
