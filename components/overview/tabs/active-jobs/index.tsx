"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMemo, type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useUserState } from "@/lib/store/account";
import { PageEmpty } from "../../../common/page-empty";
import { PageLoading } from "../../../common/page-loading";
import { PageError } from "../../../common/page-error";
import { useGetJobs } from "@/lib/api/job";
import { type Job } from "@/lib/types";
import { ActiveJobCard } from "./active-job-card";

const talentAndClientHasReviewed = (job: Job): boolean | undefined => {
	return (
		job.ratings?.some((review) => review.owner._id === job.owner?._id) &&
		job.ratings?.some((review) => review.owner._id === job.creator?._id)
	);
};

export const ActiveJobs = (): ReactElement => {
	const { _id: loggedInUser } = useUserState();
	const {
		data: jobAssignedData,
		isFetched: assignedFetched,
		isFetching: assignedFetching,
		isError: assignedError,
	} = useGetJobs({ category: "assigned" });
	const {
		data: jobCreatedData,
		isFetched,
		isFetching,
		isError,
	} = useGetJobs({ category: "created" });
	const jobDataJoined = [
		...(jobAssignedData?.data ?? []),
		...(jobCreatedData?.data ?? []),
	];

	const ongoingJobs = jobDataJoined.filter(
		(job) =>
			job.payoutStatus !== "completed" &&
			job.inviteAccepted &&
			!talentAndClientHasReviewed(job) &&
			job.status !== "cancelled",
	);
	const jobData = ongoingJobs.filter((f) => f.inviteAccepted);

	jobData.sort(
		(a, b) =>
			new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
	);

	const activeJobs = useMemo(
		() =>
			(jobData || []).map((job, i) => {
				const deliverableTotal = job?.collections.filter(
					(f) => f.type === "deliverable",
				).length;
				const deliverableTotalCompleted = job?.collections.filter(
					(f) => f.type === "deliverable" && f.progress === 100,
				).length;
				const currentProgress = parseInt(
					String(
						(deliverableTotalCompleted * 100) / deliverableTotal,
					),
					10,
				);
				const deliverableCountPercentage = {
					total: deliverableTotal,
					progress: Math.floor(currentProgress),
				};
				return (
					<ActiveJobCard
						key={i}
						id={job._id}
						// bookmarkId=""
						// bookmarked={false}
						progress={deliverableCountPercentage}
						creator={{
							_id: job.creator._id,
							name: `${job?.creator?.firstName} ${job?.creator?.lastName}`,
							avatar: job?.creator?.profileImage?.url ?? "",
							score: job?.creator.score,
						}}
						talent={{
							_id: job?.owner ? job?.owner._id : "",
							name: `${job?.owner?.firstName} ${job?.owner?.lastName}`,
							avatar: job?.owner?.profileImage?.url ?? "",
							score: job?.owner ? job?.owner.score : 0,
						}}
						description={job.description}
						title={job.name}
						isCreator={job.creator._id === loggedInUser}
						// jobId={job._id}
						jobProgress={job.progress}
					/>
				);
			}),
		[jobData, loggedInUser],
	);
	if ((!isFetched || !assignedFetched) && (isFetching || assignedFetching))
		return (
			<PageLoading
				className="h-[65vh] rounded-2xl border border-line"
				color="#007C5B"
			/>
		);
	if (isError || assignedError)
		return (
			<PageError className="h-[85vh] rounded-2xl border border-red-200" />
		);
	if (activeJobs.length === 0)
		return (
			<PageEmpty
				className="h-[65vh] rounded-2xl border border-line"
				label="Your Active Jobs will appear here"
			/>
		);

	return (
		<div className="flex w-full flex-col gap-5 rounded-2xl border border-line bg-white p-4">
			{activeJobs}
		</div>
	);
};
