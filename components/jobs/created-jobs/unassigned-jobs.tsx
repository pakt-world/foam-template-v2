"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type Job } from "@/lib/types";
import { UnAssignedJobCard } from "@/components/jobs/job-cards/unassigned-job";
import { paginate } from "@/lib/utils";
import { PageEmpty } from "@/components/common/page-empty";
import { Pagination } from "@/components/common/pagination";

interface UnassignedJobsProps {
    jobs: Job[];
}

export const UnassignedJobs: React.FC<UnassignedJobsProps> = ({ jobs }) => {
    const [currentPage, setCurrentPage] = React.useState(1);
    if (!jobs.length)
        return <PageEmpty label="No open jobs yet." className="h-[80vh] rounded-2xl border border-line" />;

    const ITEMS_PER_PAGE = 6;
    const TOTAL_PAGES = Math.ceil(jobs.length / ITEMS_PER_PAGE);
    const paginatedJobs = paginate(jobs, ITEMS_PER_PAGE, currentPage);

    return (
        <div className="flex h-full min-h-[80vh] flex-col">
            <div className="grid grid-cols-2 gap-4 overflow-y-auto pb-20">
                {paginatedJobs.map((job) => {
                    return <UnAssignedJobCard job={job} key={job._id} />;
                })}
            </div>
            <div className="mt-auto pt-4">
                <Pagination currentPage={currentPage} totalPages={TOTAL_PAGES} setCurrentPage={setCurrentPage} />
            </div>
        </div>
    );
};
