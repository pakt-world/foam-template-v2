"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import { ChevronLeft, Star } from "lucide-react";
import { Button } from "pakt-ui";
import Rating from "react-rating";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useDeclineReviewChange, useAcceptReviewChange } from "@/lib/api/job";
import { Spinner } from "@/components/common";
import { type Job, isReviewChangeRequest, isJobDeliverable } from "@/lib/types";
import { AfroProfile } from "@/components/common/afro-profile";

interface ReviewChangeRequestedProps {
    job: Job;
    closeModal?: () => void;
}

export const ReviewChangeRequested: FC<ReviewChangeRequestedProps> = ({ closeModal, job }) => {
    const acceptMutation = useAcceptReviewChange({ jobId: job._id, recipientId: String(job.owner?._id) });
    const declineMutation = useDeclineReviewChange({ jobId: job._id, recipientId: String(job.owner?._id) });

    const reviewChangeRequest = job.collections.find(isReviewChangeRequest);
    const talent = job.owner;
    const clientReview = job.ratings?.find((review) => review.owner._id === job.creator._id);

    const deliverableIds = job.collections.filter(isJobDeliverable).map((deliverable) => deliverable._id);

    return (
        <>
            <div className="bg-primary-gradient px-4 py-6 text-2xl font-bold text-white">
                <div className="flex items-center gap-2">
                    <button onClick={closeModal} type="button" aria-label="Back">
                        <ChevronLeft />
                    </button>
                    <span>Request To Improve</span>
                </div>
            </div>
            <div className="flex h-full flex-col gap-6 px-4 py-4">
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-medium">Job Description</h3>
                    <div className="flex flex-col gap-1 rounded-xl border border-blue-300 bg-[#C9F0FF] p-3">
                        <h3 className="text-sm font-medium text-title">{job.name}</h3>
                        <p className="text-sm">{job.description}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-medium">Talent Comment</h3>
                    <div className="flex flex-col gap-1 rounded-xl  border border-yellow-dark bg-[#FEF4E3] p-3">
                        <p className="text-lg text-body">{reviewChangeRequest?.description}</p>

                        <div className="flex items-center gap-2">
                            <AfroProfile
                                score={talent?.score ?? 0}
                                size="md"
                                src={talent?.profileImage?.url}
                                url={`/talents/${talent?._id}`}
                            />

                            <div className="flex flex-col gap-1">
                                <span className="text-base font-medium leading-none text-title">{`${talent?.firstName} ${talent?.lastName}`}</span>
                                <span className="text-sm capitalize leading-none">{talent?.profile.bio.title}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-slate-50 p-3">
                    <div className="flex w-full items-center justify-between">
                        <h3 className="text-sm font-medium text-title">Your review</h3>

                        {/*  @ts-expect-error --- */}
                        <Rating
                            readonly
                            initialRating={clientReview?.rating ?? 0}
                            fullSymbol={<Star fill="#15D28E" color="#15D28E" />}
                            emptySymbol={<Star fill="transparent" color="#15D28E" />}
                        />
                    </div>
                    <p className="text-body">{clientReview?.review}</p>
                </div>

                <div className="ml-auto mt-auto flex w-full max-w-[70%] items-center gap-3">
                    <Button
                        fullWidth
                        onClick={() => {
                            declineMutation.mutate({
                                reviewChangeRequestId: reviewChangeRequest?._id ?? "",
                            });
                        }}
                        variant="secondary"
                    >
                        {declineMutation.isLoading ? <Spinner size={20} /> : "Decline Request"}
                    </Button>
                    <div className="w-full rounded-xl border border-green-400">
                        <Button
                            fullWidth
                            onClick={() => {
                                acceptMutation.mutate({
                                    jobId: job._id,
                                    reviewId: clientReview?._id ?? "",
                                    requestId: reviewChangeRequest?._id ?? "",
                                    deliverableIds: [...deliverableIds, job._id],
                                });
                            }}
                        >
                            {acceptMutation.isLoading ? <Spinner size={20} /> : "Reopen Job"}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};
