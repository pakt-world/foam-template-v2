"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import type { Job } from "@/lib/types";
import { TalentJobCard } from "@/components/jobs/home/accepted/talent-card";
import { paginate } from "@/lib/utils";
import { PageEmpty } from "@/components/common/page-empty";
import { Pagination } from "@/components/common/pagination";

interface CompletedJobsProps {
	jobs: Job[];
}

export const TalentCompletedJobs = ({
	jobs,
}: CompletedJobsProps): ReactElement => {
	const [currentPage, setCurrentPage] = useState(1);

	if (!jobs.length)
		return (
			<PageEmpty
				label="Your completed jobs will appear here."
				className="h-[80vh] rounded-lg border border-line"
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
						creator,
						collections,
						status,
						ratings,
						owner,
					}) => {
						const talentHasReviewed = ratings?.some(
							(review) => review.owner._id === owner?._id,
						);
						const clientHasReviewed = ratings?.some(
							(review) => review.owner._id === creator._id,
						);

						return (
							<TalentJobCard
								jobId={_id}
								status={status}
								key={_id}
								price={paymentFee}
								title={name}
								isCompleted={
									(talentHasReviewed && clientHasReviewed) ??
									status === "cancelled"
								}
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
								client={{
									id: creator._id,
									paktScore: creator.score,
									avatar: creator.profileImage?.url,
									name: `${creator.firstName} ${creator.lastName}`,
								}}
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
