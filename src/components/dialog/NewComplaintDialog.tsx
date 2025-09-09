import { useEffect, useState } from "react";
import { Dialog } from "@mui/material";

import { NewComplaintDialogProps } from "@/types/DialogProps";
import NewComplaint from "../complaint/NewComplaint";

export default function NewComplaintDialog({ open, handleNewComplaintClose, token }: NewComplaintDialogProps) {
    const [isSubmitted, setIsSubmited] = useState(false);

    const handleSubmit = () => {
        setIsSubmited(!isSubmitted);
    };

    useEffect(() => {
        handleNewComplaintClose();
    }, [isSubmitted]);

    return (
        <Dialog className="dialog" open={open} onClose={handleNewComplaintClose} maxWidth={"md"} fullWidth>
            <div className="new-complaint-wrapper">
                <NewComplaint token={token} handleSubmit={handleSubmit} />
            </div>
        </Dialog>
    );
}
