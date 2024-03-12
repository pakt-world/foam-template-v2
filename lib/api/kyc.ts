/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type UseMutationResult, useMutation } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ApiError, axios } from "@/lib/axios";
import { toast } from "@/components/common/toaster";

const appBaseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL;

interface KycProps {
	status: string;
	verification: {
		id: string;
		url: string;
		vendorData: string;
		host: string;
		status: string;
		sessionToken: string;
	};
}

async function postKycSession(): Promise<KycProps> {
	const res = await axios.post(`/user-verification/veriff/session/new`, {
		callBackUrl: appBaseUrl,
	});
	return res.data.data;
}

export function useCreateKycSession(): UseMutationResult<
	KycProps,
	ApiError,
	unknown,
	unknown
> {
	return useMutation({
		mutationFn: postKycSession,
		mutationKey: ["kyc"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}
