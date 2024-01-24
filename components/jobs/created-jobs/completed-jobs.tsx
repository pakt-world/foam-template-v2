"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type Job } from "@/lib/types";
import { ClientJobCard } from "@/components/jobs/job-cards/client-job";
import { paginate } from "@/lib/utils";
import { PageEmpty } from "@/components/common/page-empty";
import { Pagination } from "@/components/common/pagination";

interface CompletedJobsProps {
    jobs: Job[];
}

export const CompletedJobs: React.FC<CompletedJobsProps> = ({ jobs }) => {
    const [currentPage, setCurrentPage] = React.useState(1);
    if (!jobs.length)
        return (
            <PageEmpty
                label="Your completed jobs will appear here."
                className="h-[80vh] rounded-2xl border border-line"
            />
        );

    const ITEMS_PER_PAGE = 6;
    const TOTAL_PAGES = Math.ceil(jobs.length / ITEMS_PER_PAGE);
    const paginatedJobs = paginate(jobs, ITEMS_PER_PAGE, currentPage);

    return (
        <div className="flex h-full min-h-[80vh] flex-col">
            <div className="grid grid-cols-2 gap-4 overflow-y-auto pb-20">
                {paginatedJobs.map(({ _id, paymentFee, name, collections, status, owner, creator, ratings }) => {
                    const talentHasReviewed = ratings?.some((review) => review.owner._id === owner?._id);
                    const clientHasReviewed = ratings?.some((review) => review.owner._id === creator._id);

                    return (
                        <ClientJobCard
                            jobId={_id}
                            isCancelled={status === "cancelled"}
                            isCompleted={(talentHasReviewed && clientHasReviewed) ?? status === "cancelled"}
                            totalDeliverables={
                                collections.filter((collection) => collection.type === "deliverable").length
                            }
                            completedDeliverables={
                                collections.filter(
                                    (collection) => collection.type === "deliverable" && collection.progress === 100,
                                ).length
                            }
                            key={_id}
                            price={paymentFee}
                            title={name}
                            talent={{
                                id: owner?._id ?? "",
                                paktScore: owner?.score ?? 0,
                                avatar: owner?.profileImage?.url,
                                name: `${owner?.firstName} ${owner?.lastName}`,
                            }}
                        />
                    );
                })}
            </div>
            <div className="mt-auto pt-4">
                <Pagination currentPage={currentPage} totalPages={TOTAL_PAGES} setCurrentPage={setCurrentPage} />
            </div>
        </div>
    );
};
