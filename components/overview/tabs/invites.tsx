"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useGetInvites } from "@/lib/api/invites";
import { PageEmpty } from "@/components/common/page-empty";
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import { JobFeedCard } from "../feeds/cards/job/feed";

export const Invites = (): ReactElement => {
	const query = useGetInvites({ filter: { status: "pending" } });

	if (query.isLoading)
		return (
			<PageLoading
				className="h-[65vh] rounded-2xl border border-line"
				color="#007C5B"
			/>
		);

	if (query.isError)
		return (
			<PageError className="h-[65vh] rounded-2xl border border-red-200" />
		);

	const invites = query.data.data;

	if (invites.length === 0)
		return (
			<PageEmpty
				className="h-[65vh] rounded-2xl border border-line"
				label="Your Invites will appear here"
			/>
		);

	return (
		<div className="flex w-full flex-col gap-5 rounded-2xl border border-line bg-white p-4">
			{invites.map(({ _id: inviteId, data }) => {
				const { creator, name, _id: jobId, paymentFee } = data;
				// console.log("feed--", inviteId);
				return (
					<JobFeedCard
						id={jobId}
						title={name}
						jobId={jobId}
						key={inviteId}
						type="job-invite-pending"
						inviteId={inviteId}
						amount={String(paymentFee)}
						inviter={{
							_id: creator?._id,
							score: creator?.score,
							avatar: creator?.profileImage?.url,
							name: `${creator?.firstName} ${creator?.lastName}`,
						}}
						bookmarkId=""
						close={() => {}}
					/>
				);
			})}
		</div>
	);
};
