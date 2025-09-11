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
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

import { ComplaintProps } from "@/types/ComplaintProps";
import { getComplaint } from "@/utilities/fetch";
import { getFullURL } from "@/utilities/misc/getFullURL";
import { getFileUrl } from "@/utilities/storage";
import MediaDisplay from "@/components/misc/MediaDisplay";

export default function ComplaintDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [complaint, setComplaint] = useState<ComplaintProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return "#6c757d";
      case "UNDER_REVIEW":
        return "#ffc107";
      case "IN_PROGRESS":
        return "#17a2b8";
      case "RESOLVED":
        return "#28a745";
      case "REJECTED":
        return "#dc3545";
      case "CLOSED":
        return "#343a40";
      default:
        return "#6c757d";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "LOW":
        return "#28a745";
      case "MEDIUM":
        return "#ffc107";
      case "HIGH":
        return "#fd7e14";
      case "URGENT":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  const formatStatus = (status: string) => {
    return status
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getAvatarUrl = (photoUrl?: string) => {
    if (!photoUrl) return "/assets/egg.jpg";
    return getFileUrl(photoUrl);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 2 }}>
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<FaArrowLeft />}
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  if (!complaint) {
    return (
      <Box sx={{ padding: 2 }}>
        <Alert severity="warning" sx={{ marginBottom: 2 }}>
          Complaint not found
        </Alert>
        <Button
          variant="outlined"
          startIcon={<FaArrowLeft />}
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: 2,
        width: "-webkit-fill-available",
      }}
    >
      {/* Header */}
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 3 }}
      >
        <a className="icon-hoverable" onClick={router.back}>
          <FaArrowLeft />
        </a>

        <Typography variant="h4" component="h1">
          Complaint Details
        </Typography>
      </Box>

      {/* Main Complaint Card */}
      <Card sx={{ marginBottom: 3 }}>
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
              <Typography variant="h5" component="h2" gutterBottom>
                {complaint.title}
              </Typography>
              <Chip
                label={complaint.complaintNumber}
                size="small"
                variant="outlined"
                color="primary"
              />
            </Box>
          }
          subheader={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
                marginTop: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <FaUser size={14} />
                <Typography variant="body2" color="text.secondary">
                  {complaint.user.name || complaint.user.username}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <FaClock size={14} />
                <Typography variant="body2" color="text.secondary">
                  {formatDistanceToNow(new Date(complaint.createdAt), {
                    addSuffix: true,
                  })}
                </Typography>
              </Box>
            </Box>
          }
        />
        <CardContent>
          <Typography
            variant="body1"
            paragraph
            sx={{ fontSize: "1.1rem", lineHeight: 1.6 }}
          >
            {complaint.description}
          </Typography>

          <Divider sx={{ marginY: 2 }} />

          {/* Status and Priority */}
          <Box
            sx={{ display: "flex", flexWrap: "wrap", gap: 1, marginBottom: 2 }}
          >
            <Chip
              label={formatStatus(complaint.status)}
              size="medium"
              style={{
                backgroundColor: getStatusColor(complaint.status),
                color: "white",
              }}
            />
            <Chip
              label={complaint.priority}
              size="medium"
              style={{
                backgroundColor: getPriorityColor(complaint.priority),
                color: "white",
              }}
            />
            <Chip
              icon={<FaBuilding />}
              label={complaint.ministry.name}
              size="medium"
              variant="outlined"
              color="primary"
            />
          </Box>

          {/* Location */}
          {complaint.location && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                marginBottom: 2,
              }}
            >
              <FaMapMarkerAlt size={16} color="#6c757d" />
              <Typography variant="body1" color="text.secondary">
                {complaint.location}
              </Typography>
            </Box>
          )}

          {/* Attachments */}
          {complaint.attachments.length > 0 && (
            <Box sx={{ marginBottom: 2 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <FaPaperclip />
                Attachments ({complaint.attachments.length})
              </Typography>
              <MediaDisplay
                attachments={complaint.attachments}
                showAll={true}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Updates Timeline */}
      {complaint.updates.length > 0 && (
        <Card>
          <CardHeader
            title={
              <Typography
                variant="h6"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <FaHistory />
                Status Updates
              </Typography>
            }
          />
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {complaint.updates.map((update, index) => (
                <Box key={index} sx={{ display: "flex", gap: 2 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: getStatusColor(update.status),
                      marginTop: 1,
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        marginBottom: 0.5,
                      }}
                    >
                      <Chip
                        label={formatStatus(update.status)}
                        size="small"
                        style={{
                          backgroundColor: getStatusColor(update.status),
                          color: "white",
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {formatDistanceToNow(new Date(update.createdAt), {
                          addSuffix: true,
                        })}
                      </Typography>
                    </Box>
                    <Typography variant="body2">{update.message}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Comments Section */}
      {complaint.comments.length > 0 && (
        <Card sx={{ marginTop: 3 }}>
          <CardHeader
            title={
              <Typography
                variant="h6"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <FaComment />
                Comments ({complaint.comments.length})
              </Typography>
            }
          />
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {complaint.comments.map((comment, index) => (
                <Box key={index} sx={{ display: "flex", gap: 2 }}>
                  <Avatar
                    src={getAvatarUrl(comment.author.photoUrl)}
                    alt={comment.author.name || comment.author.username}
                    sx={{ width: 32, height: 32 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        marginBottom: 0.5,
                      }}
                    >
                      <Typography variant="subtitle2">
                        {comment.author.name || comment.author.username}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </Typography>
                    </Box>
                    <Typography variant="body2">{comment.content}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
