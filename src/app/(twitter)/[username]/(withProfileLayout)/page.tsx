"use client";

import CircularLoading from "@/components/misc/CircularLoading";
import NotFound from "@/app/not-found";
import NothingToShow from "@/components/misc/NothingToShow";
import { Box, Typography, Chip } from "@mui/material";

import ComplaintCard from "@/components/complaint/ComplaintCard";
import InfiniteScroll from "@/components/misc/InfiniteScroll";
import { useInfiniteComplaints } from "@/hooks/useInfiniteComplaints";
import { ComplaintProps } from "@/types/ComplaintProps";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export default function UserComplaints({
  params: { username },
}: {
  params: { username: string };
}) {
  const { token, isPending } = useContext(AuthContext);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteComplaints({
      filters: { userId: token?.id },
      enabled: !!token?.id,
    });

  const complaints: ComplaintProps[] =
    data?.pages.flatMap((page) => page.complaints) || [];

  if (isLoading || isPending) return <CircularLoading />;

  if (complaints.length === 0) return NothingToShow({ type: "general" });

  return (
    <>
      <Box sx={{ padding: 2 }}>
        <Box
          sx={{
            marginBottom: 3,
            padding: 2,
            backgroundColor: "var(--gov-white)",
            borderRadius: 2,
            border: "1px solid var(--border-color)",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Your Complaint Summary
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Chip
              label={`${complaints.length} Total Complaints`}
              color="primary"
              variant="outlined"
            />
            <Chip
              label={`${
                complaints.filter((c) => c.status === "SUBMITTED").length
              } Submitted`}
              color="default"
              variant="outlined"
            />
            <Chip
              label={`${
                complaints.filter((c) => c.status === "IN_PROGRESS").length
              } In Progress`}
              color="info"
              variant="outlined"
            />
            <Chip
              label={`${
                complaints.filter((c) => c.status === "RESOLVED").length
              } Resolved`}
              color="success"
              variant="outlined"
            />
          </Box>
        </Box>

        {/* Complaints List */}
        {complaints.length === 0 ? (
          <NothingToShow
            type="complaints"
            message="You haven't reported any complaints yet"
          />
        ) : (
          <InfiniteScroll
            hasNextPage={hasNextPage || false}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            loadingText="Loading more of your complaints..."
            endText="You've reached the end of your complaints"
          >
            {complaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                showActions={false} // Users can't modify their own complaints
              />
            ))}
          </InfiniteScroll>
        )}
      </Box>
    </>
  );
}
