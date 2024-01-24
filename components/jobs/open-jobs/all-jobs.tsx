"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React, { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { PageEmpty } from "@/components/common/page-empty";
import { Pagination } from "@/components/common/pagination";
import { OpenJobCard } from "@/components/jobs/job-cards/open-job";
import type { Job } from "@/lib/types";
import { paginate } from "@/lib/utils";
import { PageLoading } from "@/components/common/page-loading";

interface AllJobsProps {
    jobs: Job[];
    onRefresh?: () => void;
    loading?: boolean;
}

export const AllJobs = ({ jobs, onRefresh, loading }: AllJobsProps): ReactElement | null => {
    const itemsPerPage = 6;
    const [currentPage, setCurrentPage] = React.useState(1);
    const totalPages = Math.ceil(jobs.length / itemsPerPage);
    const paginatedJobs = paginate(jobs, itemsPerPage, currentPage);

    if (loading) return <PageLoading className="h-[85vh] rounded-2xl border border-line" color="#007C5B" />;
    if (!jobs.length)
        return <PageEmpty label="No open jobs yet." className="h-[70vh] rounded-2xl border border-line" />;

    return (
        <div className="xh-full flex min-h-[70vh] flex-col gap-2 pb-2">
            <div className="grid grid-cols-2 gap-4 overflow-y-auto ">
                {paginatedJobs.map(({ _id, paymentFee, name, tags, creator, isBookmarked, bookmarkId }) => {
                    return (
                        <OpenJobCard
                            id={_id}
                            key={_id}
                            price={paymentFee}
                            title={name}
                            skills={tags}
                            creator={{
                                _id: creator._id,
                                paktScore: creator.score,
                                avatar: creator.profileImage?.url,
                                name: `${creator.firstName} ${creator.lastName}`,
                            }}
                            isBookmarked={isBookmarked}
                            bookmarkId={bookmarkId ?? ""}
                            onRefresh={onRefresh}
                        />
                    );
                })}
            </div>
            <div className="mt-auto">
                <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
            </div>
        </div>
    );
};
