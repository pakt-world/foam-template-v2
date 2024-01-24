"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { PageEmpty } from "@/components/common/page-empty";
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import { OpenJobCard } from "@/components/jobs/job-cards/open-job";
import type { Bookmark } from "@/lib/types";

interface SavedJobsProps {
    isError: boolean;
    isLoading: boolean;
    jobs: Bookmark[];
    onRefresh?: () => void;
}

export const SavedJobs = ({ jobs, isError, isLoading, onRefresh }: SavedJobsProps): ReactElement | null => {
    if (isError) return <PageError />;
    if (isLoading) return <PageLoading color="#007C5B" />;
    if (!jobs.length)
        return (
            <PageEmpty
                label="Your saved jobs will appear here."
                className="h-full rounded-lg border border-line py-6"
            />
        );

    return (
        <div className="grid grid-cols-2 gap-4 overflow-y-auto pb-20">
            {jobs.map(({ _id: bookmarkId, data: { _id, paymentFee, name, tags, creator } }) => {
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
                        isBookmarked
                        bookmarkId={bookmarkId ?? _id}
                        onRefresh={onRefresh}
                    />
                );
            })}
        </div>
    );
};
