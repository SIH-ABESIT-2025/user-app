"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tooltip } from "@mui/material";
import { FaArrowRight } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

import CitizenAuthDialog from "@/components/dialog/CitizenAuthDialog";
import { logInAsTest } from "@/utilities/fetch";
import GlobalLoading from "@/components/misc/GlobalLoading";
import CustomSnackbar from "@/components/misc/CustomSnackbar";
import { SnackbarProps } from "@/types/SnackbarProps";

export default function RootPage() {
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
    const [isLoggingAsTest, setIsLoggingAsTest] = useState(false);
    const [snackbar, setSnackbar] = useState<SnackbarProps>({ message: "", severity: "success", open: false });

    const router = useRouter();

    const handleReportIssueClick = () => {
        setIsAuthDialogOpen(true);
    };
    const handleViewComplaintsClick = () => {
        router.push("/home");
    };
    const handleAuthDialogClose = () => {
        setIsAuthDialogOpen(false);
    };
    const handleTestLogin = async () => {
        setIsLoggingAsTest(true);
        const response = await logInAsTest();
        if (!response.success) {
            setIsLoggingAsTest(false);
            setSnackbar({ message: "Something went wrong! Please try again.", severity: "error", open: true });
            return;
        }
        router.push("/home");
    };

    if (isLoggingAsTest) return <GlobalLoading />;

    return (
        <>
            <main className="root">
                <div className="root-left">
                    <Image src="https://media.assettype.com/deccanherald%2F2025-02-27%2Fti2acv08%2FPTI12_27_2024_000188B.jpg?w=undefined&auto=format%2Ccompress&fit=max" alt="" fill />
                    <div className="root-left-logo">
                        <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Jharkhand_Rajakiya_Chihna.svg/1200px-Jharkhand_Rajakiya_Chihna.svg.png" alt="" width={140} height={140} />
                    </div>
                </div>
                <div className="root-right">
                    <Image src="/assets/favicon.png" alt="" width={40} height={40} />
                    <h1>Government of Jharkhand</h1>
                    <p style={{font:"small-caption"}}> Report civic issues, track their resolution, and contribute to building a better Jharkhand</p>
                     <div className="button-group">
                         <button className="btn" onClick={handleReportIssueClick}>
                             Report an Issue
                         </button>
                         <button className="btn btn-light" onClick={handleViewComplaintsClick}>
                             View Complaints
                         </button>
                     </div>
                </div>
            </main>
            
            <CitizenAuthDialog 
                open={isAuthDialogOpen} 
                handleClose={handleAuthDialogClose} 
            />
            
            {snackbar.open && (
                <CustomSnackbar message={snackbar.message} severity={snackbar.severity} setSnackbar={setSnackbar} />
            )}
        </>
    );
}
