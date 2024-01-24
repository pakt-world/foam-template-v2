/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type UseMutationResult, useMutation } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ApiError, axios } from "@/lib/axios";
import { toast } from "@/components/common/toaster";

interface createFeedPayload {
    owners?: string[];
    title: string;
    description: string;
    type: string;
    data: string;
    isPublic: boolean;
    meta?: Record<string, unknown>;
}

async function postFeed({
    owners,
    title,
    description,
    type,
    data,
    isPublic,
    meta,
}: createFeedPayload): Promise<createFeedPayload> {
    const res = await axios.post(`/feeds`, { owners, title, description, type, data, isPublic, meta });
    return res.data.data;
}

export function useCreateFeed(): UseMutationResult<unknown, ApiError, createFeedPayload, unknown> {
    return useMutation({
        mutationFn: postFeed,
        mutationKey: ["post-feed"],
        onError: (error: ApiError) => {
            toast.error(error?.response?.data.message ?? "An error occurred");
        },
    });
}
