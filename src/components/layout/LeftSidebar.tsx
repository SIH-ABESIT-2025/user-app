"use client";

import Link from "next/link";
import { useContext, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, Menu, MenuItem } from "@mui/material";
import { FaHome, FaBell, FaUser, FaCog, FaEllipsisH, FaExclamationTriangle, FaClipboardList, FaMap } from "react-icons/fa";
import { AiFillTwitterCircle } from "react-icons/ai";

import NewComplaintDialog from "../dialog/NewComplaintDialog";
import LogOutDialog from "../dialog/LogOutDialog";
import { logout } from "@/utilities/fetch";
import { AuthContext } from "@/contexts/AuthContext";
import { getFullURL } from "@/utilities/misc/getFullURL";
import UnreadNotificationsBadge from "../misc/UnreadNotificationsBadge";
import Image from "next/image";

export default function LeftSidebar() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isNewComplaintOpen, setIsNewComplaintOpen] = useState(false);
    const [isLogOutOpen, setIsLogOutOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const { token } = useContext(AuthContext);

    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await logout();
        router.push("/");
    };

    const handleAnchorClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget);
    };
    const handleAnchorClose = () => {
        setAnchorEl(null);
    };
    const handleNewComplaintClick = () => {
        setIsNewComplaintOpen(true);
    };
    const handleNewComplaintClose = () => {
        setIsNewComplaintOpen(false);
    };
    const handleLogOutClick = () => {
        handleAnchorClose();
        setIsLogOutOpen(true);
    };
    const handleLogOutClose = () => {
        setIsLogOutOpen(false);
    };

    return (
        <>
            <aside className="left-sidebar">
                <div className="fixed">
                    <Link href="/home" className="gov-logo" >
                        <Image src="/assets/favicon.png" alt="Government of Jharkhand" width={50} height={50} />
                    </Link>
                    <nav>
                        <ul>
                            <li>
                                <Link href="/home">
                                    <div className={`nav-link ${pathname.startsWith("/home") ? "active" : ""}`}>
                                        <FaHome /> <span className="nav-title">Dashboard</span>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link href="/map">
                                    <div className={`nav-link ${pathname.startsWith("/map") ? "active" : ""}`}>
                                        <FaMap /> <span className="nav-title">Map View</span>
                                    </div>
                                </Link>
                            </li>
                            {token && (
                                <li>
                                    <Link href={`/${token.username}`}>
                                        <div
                                            className={`nav-link ${
                                                pathname.startsWith(`/${token.username}`) ? "active" : ""
                                            }`}
                                        >
                                            <FaUser /> <span className="nav-title">Profile</span>
                                        </div>
                                    </Link>
                                </li>
                            )}
                            <li>
                                <Link href="/settings">
                                    <div className={`nav-link ${pathname.startsWith("/settings") ? "active" : ""}`}>
                                        <FaCog /> <span className="nav-title">Settings</span>
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    {token && (
                        <>
                            <button onClick={handleNewComplaintClick} className="btn btn-report">
                                Report Issue
                            </button>
                            <button onClick={handleAnchorClick} className="side-profile">
                                <div>
                                    <Avatar
                                        className="avatar"
                                        alt=""
                                        src={token.photoUrl ? getFullURL(token.photoUrl) : "/assets/egg.jpg"}
                                    />
                                </div>
                                <div>
                                    <div className="token-name">
                                        {token.name !== "" ? token.name : token.username}
                                        {token.isPremium && (
                                            <span className="blue-tick" data-blue="Verified Blue">
                                                <AiFillTwitterCircle />
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-muted token-username">@{token.username}</div>
                                </div>
                                <div className="three-dots">
                                    <FaEllipsisH />
                                </div>
                            </button>
                            <Menu
                                anchorEl={anchorEl}
                                onClose={handleAnchorClose}
                                open={Boolean(anchorEl)}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                }}
                                transformOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                }}
                            >
                                <MenuItem onClick={handleAnchorClose}>
                                    <Link href={`/${token.username}`}>Profile</Link>
                                </MenuItem>
                                <MenuItem onClick={handleAnchorClose}>
                                    <Link href={`/${token.username}/edit`}>Edit Profile</Link>
                                </MenuItem>
                                <MenuItem onClick={handleAnchorClose}>
                                    <Link href="/settings">Settings</Link>
                                </MenuItem>
                                <MenuItem onClick={handleLogOutClick}>Log Out</MenuItem>
                            </Menu>
                        </>
                    )}
                </div>
            </aside>
            {token && (
                <>
                    <NewComplaintDialog open={isNewComplaintOpen} handleNewComplaintClose={handleNewComplaintClose} token={token} />
                    <LogOutDialog
                        open={isLogOutOpen}
                        handleLogOutClose={handleLogOutClose}
                        logout={handleLogout}
                        isLoggingOut={isLoggingOut}
                    />
                </>
            )}
        </>
    );
}
