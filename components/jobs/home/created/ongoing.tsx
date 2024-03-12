"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { isReviewChangeRequest, type Job } from "@/lib/types";
import { ClientJobCard } from "@/components/jobs/home/created/client-card";
import { paginate } from "@/lib/utils";
import { PageEmpty } from "@/components/common/page-empty";
import { Pagination } from "@/components/common/pagination";

interface OngoingJobsProps {
	jobs: Job[];
}

export const OngoingJobs: React.FC<OngoingJobsProps> = ({ jobs }) => {
	const [currentPage, setCurrentPage] = React.useState(1);
	if (!jobs.length)
		return (
			<PageEmpty
				label="Your ongoing jobs will appear here."
				className="h-[80vh] rounded-2xl border border-line"
			/>
		);

	const ITEMS_PER_PAGE = 6;
	const TOTAL_PAGES = Math.ceil(jobs.length / ITEMS_PER_PAGE);
	const paginatedJobs = paginate(jobs, ITEMS_PER_PAGE, currentPage);

	return (
		<div className="flex h-full min-h-[80vh] flex-col">
			<div className="grid grid-cols-2 gap-4 overflow-y-auto pb-20">
				{paginatedJobs.map(
					({
						_id,
						paymentFee,
						name,
						collections,
						owner,
						progress,
					}) => {
						const reviewRequestChange = collections.find(
							isReviewChangeRequest,
						);
						return (
							<ClientJobCard
								totalDeliverables={
									collections.filter(
										(collection) =>
											collection.type === "deliverable",
									).length
								}
								completedDeliverables={
									collections.filter(
										(collection) =>
											collection.type === "deliverable" &&
											collection.progress === 100,
									).length
								}
								reviewRequestChange={reviewRequestChange}
								jobId={_id}
								key={_id}
								price={paymentFee}
								title={name}
								talent={{
									id: owner?._id ?? "",
									paktScore: owner?.score ?? 0,
									avatar: owner?.profileImage?.url,
									name: `${owner?.firstName} ${owner?.lastName}`,
								}}
								jobProgress={progress}
							/>
						);
					},
				)}
			</div>
			<div className="mt-auto pt-4">
				<Pagination
					currentPage={currentPage}
					totalPages={TOTAL_PAGES}
					setCurrentPage={setCurrentPage}
				/>
			</div>
		</div>
	);
};
