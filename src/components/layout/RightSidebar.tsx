"use client";

import { useContext, useState } from "react";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import { FaPlus } from "react-icons/fa";

import { AuthContext } from "@/contexts/AuthContext";
import Search from "../misc/Search";
import WhoToFollow from "../misc/WhoToFollow";
import Legal from "../misc/Legal";
import CitizenAuthDialog from "../dialog/CitizenAuthDialog";

export default function RightSidebar() {
  const { token, isPending } = useContext(AuthContext);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);


  const handleReportIssue = () => {
    setIsAuthDialogOpen(true);
  };

  return (
    <aside className="right-sidebar">
      <div className="fixed">
        {/* Search */}
        <Search />

        {/* Guest user reminder */}
        {!isPending && !token && (
          <Card
            sx={{
              marginBottom: 2,
              backgroundColor: "var(--gov-primary)",
              color: "white",
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ padding: 3, textAlign: "center" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  marginBottom: 1,
                  color: "white",
                }}
              >
                Help Build a Better Jharkhand
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  marginBottom: 2,
                  color: "rgba(255, 255, 255, 0.9)",
                }}
              >
                Report civic issues and track their resolution in real-time.
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<FaPlus />}
                  onClick={handleReportIssue}
                  sx={{
                    backgroundColor: "white",
                    color: "var(--gov-primary)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                    },
                  }}
                >
                  Report Issue
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Legal */}
        <Legal />
      </div>

      {/* Auth Dialog */}
      <CitizenAuthDialog
        open={isAuthDialogOpen}
        handleClose={() => setIsAuthDialogOpen(false)}
      />
    </aside>
  );
}
