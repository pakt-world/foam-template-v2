/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import {
    type UseMutationResult,
    type UseQueryResult,
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
    type UseInfiniteQueryResult,
} from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ApiError, axios } from "@/lib/axios";
import { toast } from "@/components/common/toaster";
import { type DataFeedResponse } from "../types";

interface GetFeedsResponse {
    data: DataFeedResponse[] | [];
    limit: number;
    page: number;
    pages: number;
    total: number;
}

interface timelineFetchParams {
    page: number;
    limit: number;
    filter: Record<string, unknown>;
}

async function getTimelineFeeds({ page, limit, filter }: timelineFetchParams): Promise<GetFeedsResponse> {
    const res = await axios.get(`/feeds`, {
        params: {
            page,
            limit,
            ...filter,
        },
    });
    return res.data.data;
}

export const useGetTimeline = ({
    page,
    limit,
    filter,
}: timelineFetchParams): UseInfiniteQueryResult<[] | DataFeedResponse[], unknown> => {
    return useInfiniteQuery(
        [`get-timeline_${page}_${limit}`],
        async ({ pageParam = 1 }) => (await getTimelineFeeds({ page: pageParam, limit, filter })).data,
        {
            getNextPageParam: (_, pages) => pages.length + 1,
            enabled: true,
        },
    );
    // return useQuery({
    //   queryFn: async () => await getTimelineFeeds({ page, limit, filter }),
    //   queryKey: [`get-timeline_${page}_${limit}`],
    //   onError: (error: ApiError) => {
    //     toast.error(error?.response?.data.message || 'An error occurred');
    //   },
    //   onSuccess: (data: GetFeedsResponse) => {
    //     return data;
    //   },
    //   enabled: false,
    // });
};

// ===

interface CreatorData {
    _id: string;
    firstName: string;
    lastName: string;
    score: number;
    profileImage?: { url: string };
}

interface GetTimelineResponse {
    data: CreatorData[];
}

async function getLeaderBoard(): Promise<GetTimelineResponse> {
    const res = await axios.get(`/account/user?limit=10&sort=score&range=1,100`);
    return res.data.data;
}

export const useGetLeaderBoard = (): UseQueryResult<GetTimelineResponse, ApiError> => {
    return useQuery({
        queryFn: async () => getLeaderBoard(),
        queryKey: ["get-leader-board"],
        onError: (error: ApiError) => {
            toast.error(error?.response?.data.message ?? "An error occurred");
        },
        onSuccess: (data: GetTimelineResponse) => {
            return data;
        },
    });
};

// ===

async function dismissFeed(id: string): Promise<void> {
    const res = await axios.put(`/feeds/${id}/dismiss`);
    return res.data.data;
}

export function useDismissFeed(): UseMutationResult<void, ApiError, string, unknown> {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: dismissFeed,
        mutationKey: ["dismiss-feed-by-id"],
        onSuccess: async () => {
            await queryClient.refetchQueries([`get-timeline_1_10`], {
                stale: true,
            });
            toast.success("Feed Dismissed successfully");
        },
        onError: (error: ApiError) => {
            toast.error(error?.response?.data.message ?? "An error occurred");
        },
    });
}

// ===

async function dismissAllFeed(): Promise<void> {
    const res = await axios.put(`/feeds/dismiss/all`);
    return res.data.data;
}

export function useDismissAllFeed(): UseMutationResult<void, ApiError, void, unknown> {
    return useMutation({
        mutationFn: dismissAllFeed,
        mutationKey: ["dismiss-all-feed"],
        onSuccess: () => {
            toast.success("All Feeds Dismissed successfully");
        },
        onError: (error: ApiError) => {
            toast.error(error?.response?.data.message ?? "An error occurred");
        },
    });
}
