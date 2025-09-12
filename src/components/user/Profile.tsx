"use client";

import Link from "next/link";
import { useContext, useState } from "react";
import { FaArrowLeft, FaRegEnvelope } from "react-icons/fa";
import { Avatar } from "@mui/material";

import { AuthContext } from "@/contexts/AuthContext";
import { UserProps } from "@/types/UserProps";
import TweetArrayLength from "../tweet/TweetArrayLength";
import Follow from "./Follow";
import { getFullURL } from "@/utilities/misc/getFullURL";
import PreviewDialog from "../dialog/PreviewDialog";
import { SnackbarProps } from "@/types/SnackbarProps";
import CustomSnackbar from "../misc/CustomSnackbar";
import NewMessageDialog from "../dialog/NewMessageDialog";

export default function Profile({ profile }: { profile: UserProps }) {
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [preview, setPreview] = useState({ open: false, url: "" });
  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    message: "",
    severity: "success",
    open: false,
  });

  const { token } = useContext(AuthContext);

  const handleImageClick = (e: any) => {
    const clickedElement = e.target;
    if (clickedElement.alt === "profile-photo") {
      handlePreviewClick(
        profile.photoUrl ? profile.photoUrl : "/assets/default-avatar.svg"
      );
    }
  };

  const handlePreviewClick = (url: string) => {
    setPreview({ open: true, url });
  };
  const handlePreviewClose = () => {
    setPreview({ open: false, url: "" });
  };

  const handleNewMessageClick = () => {
    if (!token) {
      return setSnackbar({
        message: "You need to login first to message someone.",
        severity: "info",
        open: true,
      });
    }
    setIsNewMessageOpen(true);
  };

  return (
    <>
      <div className="back-to">
        <Link className="icon-hoverable" href="/home">
          <FaArrowLeft />
        </Link>
        <div className="top">
          <span className="top-title">{profile.username}</span>
        </div>
      </div>
      <div className="profile" style={{ padding: "1em" }}>
        <div
          className="profile-header-simple"
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "flex-start",
            justifyItems: "start",
          }}
        >
          <div>
            <Avatar
              className="div-link avatar"
              onClick={handleImageClick}
              sx={{ width: 125, height: 125 }}
              alt="profile-photo"
              src={
                profile.photoUrl
                  ? getFullURL(profile.photoUrl)
                  : "/assets/default-avatar.svg"
              }
            />
            <div className="profile-actions" style={{ marginTop: "2rem" }}>
              {token?.username === profile.username ? (
                <Link
                  href={`/${profile.username}/edit`}
                  className="btn btn-white edit-profile-section"
                >
                  Edit profile
                </Link>
              ) : (
                <div className="edit-profile-section flex">
                  <button
                    className="btn btn-white icon-hoverable new-message"
                    onClick={handleNewMessageClick}
                  >
                    <FaRegEnvelope />
                  </button>
                  <Follow profile={profile} />
                </div>
              )}
            </div>
          </div>
          <div className="profile-info">
            <div className="profile-info-main">
              <h1>{profile.name !== "" ? profile.name : profile.username}</h1>
              <div className="text-muted">@{profile.username}</div>
            </div>
            {profile.description && (
              <div className="profile-info-desc">{profile.description}</div>
            )}
          </div>
        </div>
      </div>
      <PreviewDialog
        open={preview.open}
        handlePreviewClose={handlePreviewClose}
        url={preview.url}
      />
      {token && isNewMessageOpen && (
        <NewMessageDialog
          handleNewMessageClose={() => setIsNewMessageOpen(false)}
          open={isNewMessageOpen}
          token={token}
          recipient={profile.username}
        />
      )}
      {snackbar.open && (
        <CustomSnackbar
          message={snackbar.message}
          severity={snackbar.severity}
          setSnackbar={setSnackbar}
        />
      )}
    </>
  );
}
