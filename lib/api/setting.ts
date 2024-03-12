/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type UseQueryResult, useQuery } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ApiError, axios } from "@/lib/axios";
import { toast } from "@/components/common/toaster";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchSystemSettings(): Promise<any> {
	const res = await axios.get(`/settings`);
	return res.data.data;
}

export const useGetSetting = (): UseQueryResult<void, ApiError> => {
	return useQuery({
		queryFn: async () => {
			const response = await fetchSystemSettings();
			return response;
		},
		queryKey: [`get-system-setting`],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: (data) => {
			return data;
		},
	});
};
