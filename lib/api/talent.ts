/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import {
	useQuery,
	type QueryKey,
	type UseQueryOptions,
	type UseQueryResult,
} from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { axios, type ApiError } from "@/lib/axios";
import { type Review, type User } from "@/lib/types";
import { toast } from "@/components/common/toaster";

// Talent Fetch

type GetTalentFetchDetailsError = ApiError<null>;

interface talentFetchParams {
	page: number;
	limit: number;
	filter: Record<string, unknown>;
}
interface talentListResponse {
	data: User[];
	pages: number;
	page: number;
	limit: number;
	total: number;
}
interface reviewResponse {
	data: Review[];
	page: number;
	count: number;
}

async function getTalent({
	limit = 20,
	page = 1,
	filter,
}: talentFetchParams): Promise<talentListResponse> {
	const res = await axios.get(`/account/user`, {
		params: {
			page,
			limit,
			...filter,
		},
	});
	return res.data.data;
}

async function getTalentById(id: string): Promise<User> {
	const talent = await axios.get(`/account/user/${id}`);
	return talent.data.data;
}

async function getTalentReview(
	userId: string,
	page: string,
	limit: string,
): Promise<reviewResponse> {
	const review = await axios.get(
		`/reviews?userId=${userId}&page=${page}&limit=${limit}`,
	);
	return review.data.data;
}

export const useGetTalents = ({
	limit,
	page,
	filter,
}: talentFetchParams): UseQueryResult<
	talentListResponse,
	GetTalentFetchDetailsError
> => {
	const getQueryKey: QueryKey = [
		`talents_${limit}_${page}_${JSON.stringify(filter)}`,
	];
	const options: UseQueryOptions<
		talentListResponse,
		GetTalentFetchDetailsError
	> = {
		queryFn: async () => {
			return getTalent({ limit, page, filter });
		},
		queryKey: getQueryKey,
		onError: (error) => {
			toast.error(
				error.response?.data.message ??
					"An error fetching talents occurred",
			);
		},
		enabled: true,
	};

	return useQuery(getQueryKey, options);
};

export const useGetTalentById = (
	id: string,
	enabled: boolean = false,
): UseQueryResult<
	{
		talent: User;
	},
	GetTalentFetchDetailsError
> => {
	const getQueryIdKey = [`talent_id_${id}`];
	return useQuery({
		queryFn: async () => {
			const talent = await getTalentById(id);
			return { talent };
		},
		queryKey: getQueryIdKey,
		onError: (error: GetTalentFetchDetailsError) => {
			toast.error(
				error.response?.data.message ??
					"An error fetching talents occurred",
			);
		},
		enabled,
	});
};

export const useGetTalentReviewById = (
	id: string,
	page: string,
	limit: string,
	enabled = false,
): UseQueryResult<reviewResponse, GetTalentFetchDetailsError> => {
	const getQueryIdReview = [`talent_review_${id}_${page}_${limit}`];
	return useQuery({
		queryFn: async () => {
			const review = await getTalentReview(id, page, limit);
			return review;
		},
		queryKey: getQueryIdReview,
		onError: (error: GetTalentFetchDetailsError) => {
			toast.error(
				error.response?.data.message ??
					"An error fetching talents occurred",
			);
		},
		enabled,
	});
};
