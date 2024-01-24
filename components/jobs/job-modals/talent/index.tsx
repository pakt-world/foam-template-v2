"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC, useState } from "react";
import Lottie from "lottie-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useGetJobById } from "@/lib/api/job";
import { isJobCancellation } from "@/lib/types";
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import warning from "@/lottiefiles/warning.json";
import { JobUpdates } from "./job-update";
import { ReviewClient } from "./review/review-client";
import { ReviewSuccess } from "./review/review-success";
import { ReviewJobCancellationRequest } from "./cancellation/review-job-cancellation-request";
import { RequestJobCancellation } from "./cancellation/request-job-cancellation";
import { JobCancellationRequested } from "./cancellation/job-cancellation-requested";

interface TalentJobModalProps {
    jobId: string;
    talentId: string;
    closeModal: () => void;
    extras?: string;
}

export const TalentJobModal: FC<TalentJobModalProps> = ({ jobId, talentId, closeModal, extras }) => {
    const query = useGetJobById({ jobId, extras });
    const [isRequestingJobCancellation, setIsRequestingJobCancellation] = useState(false);

    if (query.isError) return <PageError className="absolute inset-0" />;

    if (query.isLoading) return <PageLoading className="absolute inset-0" color="#007C5B" />;

    const job = query.data;

    if (isRequestingJobCancellation) {
        return (
            <RequestJobCancellation
                jobId={jobId}
                talentId={talentId}
                closeModal={() => {
                    setIsRequestingJobCancellation(false);
                }}
                cancelJobCancellationRequest={() => {
                    setIsRequestingJobCancellation(false);
                }}
                type="cancellation"
            />
        );
    }

    const jobCancellation = job.collections.find(isJobCancellation);

    const talentRequestedCancellation = jobCancellation?.creator._id === job.owner?._id; // problem here
    const clientRequestedCancellation = jobCancellation?.creator._id === job.creator._id;

    const talentHasReviewed = job.ratings?.some((review) => review.owner._id === job.owner?._id);
    const clientHasReviewed = job.ratings?.some((review) => review.owner._id === job.creator._id);

    if (job.status === "cancelled") {
        return (
            <div className="flex h-full flex-col items-center justify-center bg-red-50 text-red-500">
                <div className="flex w-[200px] items-center justify-center">
                    <Lottie animationData={warning} loop={false} />
                </div>
                <span>This Job has been cancelled</span>
            </div>
        );
    }

    if (jobCancellation && clientRequestedCancellation) {
        return (
            <ReviewJobCancellationRequest
                job={job}
                closeModal={() => {
                    setIsRequestingJobCancellation(false);
                }}
            />
        );
    }

    if (jobCancellation && talentRequestedCancellation) {
        return <JobCancellationRequested closeModal={closeModal} />;
    }

    if (clientHasReviewed && talentHasReviewed) {
        return <ReviewSuccess closeModal={closeModal} />;
    }

    if (clientHasReviewed && !talentHasReviewed) {
        return <ReviewClient job={job} closeModal={closeModal} />;
    }

    return (
        <JobUpdates
            job={job}
            requestJobCancellation={() => {
                setIsRequestingJobCancellation(true);
            }}
        />
    );
};
