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

interface OngoingJobsProps {
	jobs: Job[];
}

export const TalentOngoingJobs = ({ jobs }: OngoingJobsProps): ReactElement => {
	const [currentPage, setCurrentPage] = useState(1);

	if (!jobs.length)
		return (
			<PageEmpty
				label="Your ongoing jobs will appear here."
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
					}) => {
						return (
							<TalentJobCard
								status={status}
								jobId={_id}
								key={_id}
								price={paymentFee}
								title={name}
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
