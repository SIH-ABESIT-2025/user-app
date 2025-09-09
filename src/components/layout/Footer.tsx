"use client";

import { useContext, useState } from "react";

import Link from "next/link";
import CitizenAuthDialog from "../dialog/CitizenAuthDialog";
import { AuthContext } from "@/contexts/AuthContext";
import Image from "next/image";
import { Button } from "@mui/material";

export default function Footer() {
  const { token, isPending } = useContext(AuthContext);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  if (isPending) return null;

  const handleOpenAuth = () => {
    setIsAuthDialogOpen(true);
  };

  if (!token)
    return (
      <footer className="footer " style={{ zIndex: 30 }}>
        <div>
          <Image
            src={
              "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Jharkhand_Rajakiya_Chihna.svg/1200px-Jharkhand_Rajakiya_Chihna.svg.png"
            }
            alt="Jharkhand Rajakiya Chihna"
            width={50}
            height={50}
          />
        </div>
        <div className="footer-div">
          <h1>Help Build a Better Jharkhand</h1>
          <p>Report civic issues and track their resolution in real-time.</p>
        </div>
        <div>
          <p className="btn btn-light" onClick={handleOpenAuth}>
            Create an Account
          </p>
        </div>
        <CitizenAuthDialog
          open={isAuthDialogOpen}
          handleClose={() => setIsAuthDialogOpen(false)}
        />
      </footer>
    );

  return null;
}
