import { useInfiniteQuery } from "@tanstack/react-query";
import { getComplaintsPage } from "@/utilities/fetch";
import { ComplaintProps } from "@/types/ComplaintProps";

interface UseInfiniteComplaintsProps {
    filters?: {
        ministryId?: string;
        status?: string;
        priority?: string;
        userId?: string;
    };
    enabled?: boolean;
}

interface ComplaintsPageData {
    complaints: ComplaintProps[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export const useInfiniteComplaints = ({ filters = {}, enabled = true }: UseInfiniteComplaintsProps) => {
    return useInfiniteQuery<ComplaintsPageData>({
        queryKey: ["complaints", "infinite", filters],
        queryFn: ({ pageParam = 1 }) => getComplaintsPage({ pageParam, filters }),
        getNextPageParam: (lastPage) => {
            const { pagination } = lastPage;
            return pagination.page < pagination.pages ? pagination.page + 1 : undefined;
        },
        enabled,
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
    });
};
