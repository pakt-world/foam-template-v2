"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState, type FC } from "react";
import { Button, Checkbox } from "pakt-ui";
import { ChevronLeft } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Spinner } from "@/components/common";
import { useRequestJobCancellation } from "@/lib/api/job";
import { JobCancellationSuccessRequested } from "./job-cancellation-success-requested";

const JOB_CANCEL_REASONS = ["Talent is not responsive", "Unforeseeable Circumstances"];

interface RequestJobCancellationProps {
    jobId: string;
    closeModal: () => void;
    cancelJobCancellationRequest: () => void;
    talentId: string;
    type: string;
}

export const RequestJobCancellation: FC<RequestJobCancellationProps> = ({
    jobId,
    cancelJobCancellationRequest,
    closeModal,
    talentId,
    type,
}) => {
    const requestJobCancellationMutation = useRequestJobCancellation({ talentId });

    const [isSuccess, setIsSuccess] = useState(false);
    const [reason, setReason] = useState("");
    const [reasonNotInOptions, setReasonNotInOptions] = useState(false);
    const [explanation, setExplanation] = useState("");

    if (isSuccess) {
        return <JobCancellationSuccessRequested closeModal={closeModal} />;
    }

    return (
        <>
            <div className="flex items-center justify-between bg-primary-gradient px-4 py-6 text-3xl font-bold text-white">
                <div className="flex items-center gap-2">
                    <button onClick={cancelJobCancellationRequest} type="button" aria-label="Back">
                        <ChevronLeft />
                    </button>
                    <span>Cancel Job</span>
                </div>
            </div>

            <div className="flex h-full grow flex-col gap-6 px-4 py-6">
                <div className="rounded-2xl  border border-yellow-dark bg-[#FEF4E3] p-4">
                    The talent will need to accept for the cancellation to be effective.
                </div>

                <div className="flex flex-col gap-2">
                    <h2>
                        Reason for cancellation <span className="text-red-500">*</span>
                    </h2>
                    <div className="flex flex-col gap-3">
                        {JOB_CANCEL_REASONS.map((option) => (
                            <label key={option} className="flex items-center gap-2">
                                <Checkbox
                                    checked={reason === option}
                                    onCheckedChange={() => {
                                        setReason(option);
                                        setReasonNotInOptions(false);
                                    }}
                                />
                                <span className="text-[#575767]">{option}</span>
                            </label>
                        ))}

                        <label className="flex items-center gap-2">
                            <Checkbox
                                checked={reasonNotInOptions}
                                onCheckedChange={() => {
                                    if (!reasonNotInOptions) {
                                        setReason("");
                                    }
                                    setReasonNotInOptions(true);
                                }}
                            />
                            <span className="text-[#575767]">Other</span>
                        </label>

                        {reasonNotInOptions && (
                            <textarea
                                rows={2}
                                value={reason}
                                placeholder="Write your reason..."
                                onChange={(e) => {
                                    setReason(e.target.value);
                                }}
                                className="w-full grow resize-none rounded-lg border border-line bg-gray-50 p-2 placeholder:text-sm focus:outline-none"
                            />
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="rounded-2xl  border border-yellow-dark bg-[#FEF4E3] p-4">
                        Payment for any deliverable is at the sole discretion of the talent. Talent will review client
                        but Client cannot review talent.
                    </div>

                    <div className="flex flex-col gap-1">
                        <h3>Explanation</h3>
                        <div>
                            <textarea
                                rows={5}
                                value={explanation}
                                placeholder="Write your explanation..."
                                onChange={(e) => {
                                    setExplanation(e.target.value);
                                }}
                                className="w-full grow resize-none rounded-lg border border-line bg-gray-50 p-2 placeholder:text-sm focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-auto">
                    <Button
                        fullWidth
                        disabled={
                            requestJobCancellationMutation.isLoading || reason.length === 0 || explanation.length === 0
                        }
                        onClick={() => {
                            requestJobCancellationMutation.mutate(
                                {
                                    type,
                                    jobId,
                                    reason,
                                    explanation,
                                },
                                {
                                    onSuccess: () => {
                                        setIsSuccess(true);
                                    },
                                },
                            );
                        }}
                    >
                        {requestJobCancellationMutation.isLoading ? <Spinner size={20} /> : "Request Cancellation"}
                    </Button>
                </div>
            </div>
        </>
    );
};
