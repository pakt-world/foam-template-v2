/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMutation, type UseMutationResult, type UseQueryResult, useQuery } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             	Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { axios, type ApiError } from "@/lib/axios";
import { toast } from "@/components/common/toaster";

// UPDATE Connection Preference

interface UpdateConnectionPreferenceParams {
    skills?: string[];
    minimumScore?: number;
    minimumSkills?: number;
}

interface UpdateConnectionPreferenceResponse {
    skills: string[];
    minimumScore: number;
    minimumSkills: number;
}

async function postUpdateConnectionPreference(
    params: UpdateConnectionPreferenceParams,
): Promise<UpdateConnectionPreferenceResponse> {
    const res = await axios.patch(`/account/connection-preference`, params);
    return res.data.data;
}

export function useUpdateConnectionPreference(): UseMutationResult<
    UpdateConnectionPreferenceResponse,
    ApiError,
    UpdateConnectionPreferenceParams,
    unknown
> {
    return useMutation({
        mutationFn: postUpdateConnectionPreference,
        mutationKey: ["update-connection-preference"],
        onError: (error: ApiError) => {
            toast.error(error?.response?.data.message ?? "An error occurred");
        },
        onSuccess: () => {
            toast.success("Connection preference updated successfully");
        },
    });
}

// GET Connection Preference

interface GetConnectionPreferenceResponse {
    skills: string[];
    minimumScore: number;
    minimumSkills: number;
}

async function getConnectionPreference(): Promise<GetConnectionPreferenceResponse> {
    const res = await axios.get(`/account/connection-preference`);
    return res.data.data;
}

export function useGetConnectionPreference(): UseQueryResult<GetConnectionPreferenceResponse, ApiError> {
    return useQuery({
        queryFn: getConnectionPreference,
        queryKey: ["get-connection-preference"],
        onError: (error: ApiError) => {
            toast.error(error?.response?.data.message ?? "An error occurred");
        },
    });
}
