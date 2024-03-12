/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import {
	type UseMutationResult,
	useMutation,
	useQuery,
	type UseQueryResult,
} from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ApiError, axios } from "@/lib/axios";
import { toast } from "@/components/common/toaster";
// import { useCreateFeed } from "./feed";

// Get Invites
interface getInviteParams {
	page?: number;
	limit?: number;
	filter?: Record<string, unknown>;
}

interface GetInviteResponse {
	data: Array<{
		status: "pending" | "accepted" | "rejected";
		_id: string;
		createdAt: string;
		data: {
			_id: string;
			name: string;
			isPrivate: boolean;
			escrowPaid: boolean;
			deliveryDate: string;
			description: string;
			paymentFee: number;
			creator: {
				_id: string;
				firstName: string;
				lastName: string;
				score: number;
				profileImage?: {
					url: string;
				};
				profile: {
					bio: {
						title: string;
						description: string;
					};
					talent: {
						tags: string[];
					};
				};
			};
		};
	}>;
	page: number;
	limit: number;
	total: number;
	pages: number;
}

async function getInvites({
	page = 1,
	limit = 10,
	filter,
}: getInviteParams): Promise<GetInviteResponse> {
	const res = await axios.get("/invite", {
		params: {
			page,
			limit,
			...filter,
		},
	});
	return res.data.data;
}

export const useGetInvites = ({
	page,
	limit,
	filter,
}: getInviteParams): UseQueryResult<GetInviteResponse, ApiError> => {
	return useQuery({
		queryFn: async () => getInvites({ page, limit, filter }),
		queryKey: [`get_invites_${page}_${limit}_${JSON.stringify(filter)}`],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
};

// Accept Invite

interface AcceptInviteResponse {
	meta: string;
	message: string;
}

async function acceptInvite({
	id,
}: {
	id: string;
}): Promise<AcceptInviteResponse> {
	const res = await axios.post(`/invite/${id}/accept`);
	return res.data.data;
}

export function useAcceptInvite(): UseMutationResult<
	AcceptInviteResponse,
	ApiError,
	unknown
> {
	// const createFeed = useCreateFeed();
	// @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
	return useMutation({
		mutationFn: acceptInvite,
		mutationKey: ["invite-call-action"],
		onSuccess: () => {
			// create feed for accept invite
			// createFeed.mutate({
			//   owners: [jobCreator],
			//   title: 'Invite Accepted',
			//   description: 'Invite Accepted',
			//   data: jobId,
			//   type: FEED_TYPES.JOB_INVITATION_ACCEPTED,
			//   isPublic: false,
			// });
			toast.success("Invite Accepted successfully");
		},
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}

// Decline Invite

interface DeclineInviteResponse {
	meta: string;
	message: string;
}

async function declineInvite({
	id,
}: {
	id: string;
}): Promise<DeclineInviteResponse> {
	const res = await axios.post(`/invite/${id}/decline`);
	return res.data.data;
}

// interface DeclineInviteParams {
//     JobCreator: string;
//     jobId: string;
// }

// export function useDeclineInvite({ jobCreator, jobId }: DeclineInviteParams): UseMutationResult<
//     DeclineInviteResponse,
//     ApiError,
//     {
//         id: string;
//     },
//     unknown
// > {
export function useDeclineInvite(): UseMutationResult<
	DeclineInviteResponse,
	ApiError,
	{ id: string },
	unknown
> {
	// const createFeed = useCreateFeed();
	return useMutation({
		mutationFn: declineInvite,
		mutationKey: ["invite-call-action"],
		onSuccess: () => {
			// create feed for decline invite
			// createFeed.mutate({
			//   owners: [jobCreator],
			//   title: 'Invite Declined',
			//   description: 'Invite Declined',
			//   data: jobId,
			//   type: FEED_TYPES.JOB_INVITATION_DECLINED,
			//   isPublic: false,
			// });
			toast.success("Invite Declined successfully");
		},
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}
