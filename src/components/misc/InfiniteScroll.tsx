import { useEffect, useRef, useCallback } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

interface InfiniteScrollProps {
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    children: React.ReactNode;
    loadingText?: string;
    endText?: string;
}

export default function InfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    children,
    loadingText = "Loading more complaints...",
    endText = "You've reached the end of the list"
}: InfiniteScrollProps) {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [target] = entries;
            if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        },
        [hasNextPage, isFetchingNextPage, fetchNextPage]
    );

    useEffect(() => {
        const element = loadMoreRef.current;
        if (!element) return;

        observerRef.current = new IntersectionObserver(handleObserver, {
            threshold: 0.1,
            rootMargin: "100px",
        });

        observerRef.current.observe(element);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [handleObserver]);

    return (
        <Box>
            {children}
            
            {/* Load more trigger */}
            <div ref={loadMoreRef} style={{ height: "20px" }} />
            
            {/* Loading indicator */}
            {isFetchingNextPage && (
                <Box sx={{ 
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center", 
                    padding: 3,
                    gap: 2
                }}>
                    <CircularProgress size={24} />
                    <Typography variant="body2" color="text.secondary">
                        {loadingText}
                    </Typography>
                </Box>
            )}
            
            {/* End of list indicator */}
            {!hasNextPage && (
                <Box sx={{ 
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center", 
                    padding: 3
                }}>
                    <Typography variant="body2" color="text.secondary">
                        {endText}
                    </Typography>
                </Box>
            )}
        </Box>
    );
}
