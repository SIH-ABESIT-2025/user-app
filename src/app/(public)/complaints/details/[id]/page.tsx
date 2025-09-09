"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Chip,
  Box,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaClock,
  FaUser,
  FaBuilding,
  FaPaperclip,
  FaComment,
  FaHistory,
  FaSignInAlt,
  FaPlus,
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

import { ComplaintProps } from "@/types/ComplaintProps";
import { getComplaint } from "@/utilities/fetch";
import { supabase } from "@/utilities/storage";
import MediaDisplay from "@/components/misc/MediaDisplay";
import CitizenAuthDialog from "@/components/dialog/CitizenAuthDialog";

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
  if (!photoUrl) return "/assets/egg.jpg";
  if (photoUrl.includes('supabase') || photoUrl.startsWith('http')) {
    return photoUrl;
  }
  try {
    const { data } = supabase.storage.from("primary").getPublicUrl(photoUrl);
    return data.publicUrl;
  } catch (error) {
    console.error('Error getting avatar URL:', error);
    return "/assets/egg.jpg";
  }
};

export default function PublicComplaintDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [complaint, setComplaint] = useState<ComplaintProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const data = await getComplaint(params.id as string);
        setComplaint(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load complaint"
        );
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchComplaint();
    }
  }, [params.id]);

  const handleBack = () => {
    router.back();
  };

  const handleSignIn = () => {
    setIsAuthDialogOpen(true);
  };

  const handleReportIssue = () => {
    setIsAuthDialogOpen(true);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading complaint details...
        </Typography>
      </Box>
    );
  }

  if (error || !complaint) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
        {/* Header */}
        <Box sx={{ 
          backgroundColor: "var(--gov-primary)", 
          color: "white", 
          padding: 2,
          position: "sticky",
          top: 0,
          zIndex: 1000
        }}>
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            maxWidth: "1200px",
            margin: "0 auto"
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Image src="/assets/favicon.png" alt="Jharkhand Government" width={40} height={40} />
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Government of Jharkhand
              </Typography>
            </Box>
            <Button 
              variant="outlined" 
              startIcon={<FaSignInAlt />}
              sx={{ 
                color: "white", 
                borderColor: "white",
                "&:hover": { borderColor: "white", backgroundColor: "rgba(255,255,255,0.1)" }
              }}
              onClick={handleSignIn}
            >
              Sign In
            </Button>
          </Box>
        </Box>

        <Box sx={{ padding: 3, maxWidth: "1200px", margin: "0 auto" }}>
          <Alert severity="error">
            {error || "Complaint not found"}
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* Header */}
      <Box sx={{ 
        backgroundColor: "var(--gov-primary)", 
        color: "white", 
        padding: 2,
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton 
              onClick={handleBack}
              sx={{ color: "white" }}
            >
              <FaArrowLeft />
            </IconButton>
            <Image src="/assets/favicon.png" alt="Jharkhand Government" width={40} height={40} />
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Government of Jharkhand
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button 
              variant="outlined" 
              startIcon={<FaSignInAlt />}
              sx={{ 
                color: "white", 
                borderColor: "white",
                "&:hover": { borderColor: "white", backgroundColor: "rgba(255,255,255,0.1)" }
              }}
              onClick={handleSignIn}
            >
              Sign In
            </Button>
            <Button 
              variant="contained" 
              startIcon={<FaPlus />}
              sx={{ 
                backgroundColor: "white", 
                color: "var(--gov-primary)",
                "&:hover": { backgroundColor: "#f0f0f0" }
              }}
              onClick={handleReportIssue}
            >
              Report Issue
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ padding: 3, maxWidth: "1200px", margin: "0 auto" }}>
        {/* Info Alert */}
        <Alert 
          severity="info" 
          sx={{ marginBottom: 3 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={handleSignIn}
              startIcon={<FaSignInAlt />}
            >
              Sign In
            </Button>
          }
        >
          You're viewing this complaint as a guest. Sign in to comment, track updates, or report new issues.
        </Alert>

        {/* Complaint Details */}
        <Card sx={{ marginBottom: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <CardHeader
            avatar={
              <Avatar 
                src={getAvatarUrl(complaint.user.photoUrl)}
                alt={complaint.user.name || complaint.user.username}
                sx={{ width: 56, height: 56 }}
              />
            }
            title={
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                  {complaint.title}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {complaint.user.name || complaint.user.username}
                </Typography>
              </Box>
            }
            action={
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip
                  label={complaint.status.replace('_', ' ')}
                  sx={{ 
                    backgroundColor: getStatusColor(complaint.status),
                    color: "white",
                    fontWeight: "bold"
                  }}
                />
                <Chip
                  label={complaint.priority}
                  sx={{ 
                    backgroundColor: getPriorityColor(complaint.priority),
                    color: "white",
                    fontWeight: "bold"
                  }}
                />
              </Box>
            }
          />
          
          <CardContent>
            <Typography variant="body1" sx={{ marginBottom: 3, fontSize: "1.1rem", lineHeight: 1.6 }}>
              {complaint.description}
            </Typography>

            {/* Complaint Info */}
            <Box sx={{ display: "flex", gap: 3, marginBottom: 3, flexWrap: "wrap" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FaBuilding color="var(--gov-primary)" />
                <Typography variant="body2" color="text.secondary">
                  <strong>Ministry:</strong> {complaint.ministry.name}
                </Typography>
              </Box>
              
              {complaint.location && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <FaMapMarkerAlt color="var(--gov-primary)" />
                  <Typography variant="body2" color="text.secondary">
                    <strong>Location:</strong> {complaint.location}
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FaClock color="var(--gov-primary)" />
                <Typography variant="body2" color="text.secondary">
                  <strong>Reported:</strong> {formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })}
                </Typography>
              </Box>
            </Box>

            {/* Attachments */}
            {complaint.attachments && complaint.attachments.length > 0 && (
              <Box sx={{ marginBottom: 3 }}>
                <Typography variant="h6" sx={{ marginBottom: 2, display: "flex", alignItems: "center", gap: 1 }}>
                  <FaPaperclip color="var(--gov-primary)" />
                  Attachments ({complaint.attachments.length})
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <MediaDisplay
                    attachments={complaint.attachments}
                    showAll={true}
                  />
                </Box>
              </Box>
            )}

            <Divider sx={{ marginY: 3 }} />

            {/* Status Updates */}
            {complaint.updates && complaint.updates.length > 0 && (
              <Box sx={{ marginBottom: 3 }}>
                <Typography variant="h6" sx={{ marginBottom: 2, display: "flex", alignItems: "center", gap: 1 }}>
                  <FaHistory color="var(--gov-primary)" />
                  Status Updates
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {complaint.updates.map((update, index) => (
                    <Card key={index} variant="outlined">
                      <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 1 }}>
                          <Chip
                            label={update.status.replace('_', ' ')}
                            size="small"
                            sx={{ 
                              backgroundColor: getStatusColor(update.status),
                              color: "white",
                              fontWeight: "bold"
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {update.message}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            )}

            {/* Comments Section - Login Required */}
            <Box sx={{ 
              backgroundColor: "#f8f9fa", 
              padding: 3, 
              borderRadius: 2,
              border: "2px dashed #dee2e6"
            }}>
              <Box sx={{ textAlign: "center" }}>
                <FaComment size={48} color="#6c757d" style={{ marginBottom: "1rem" }} />
                <Typography variant="h6" sx={{ marginBottom: 1, color: "#6c757d" }}>
                  Comments and Discussions
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
                  Sign in to view and participate in discussions about this complaint
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<FaSignInAlt />}
                  onClick={handleSignIn}
                  sx={{ 
                    backgroundColor: "var(--gov-primary)",
                    "&:hover": { backgroundColor: "var(--gov-primary-dark)" }
                  }}
                >
                  Sign In to View Comments
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Auth Dialog */}
      <CitizenAuthDialog 
        open={isAuthDialogOpen} 
        handleClose={() => setIsAuthDialogOpen(false)} 
      />
    </Box>
  );
}
