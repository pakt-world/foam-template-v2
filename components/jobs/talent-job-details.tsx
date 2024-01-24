"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React from "react";
import { Button } from "pakt-ui";
import { Info } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Lottie from "lottie-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { isJobDeliverable, isJobApplicant } from "@/lib/types";
import { Spinner } from "@/components/common";
import { useApplyToOpenJob, useGetJobById } from "@/lib/api/job";
import { useDeclineInvite, useAcceptInvite } from "@/lib/api/invites";
import type { Job } from "@/lib/types";
import success from "@/lottiefiles/success.json";
import { Modal } from "@/components/common/headless-modal";
import { JobHeader, JobDescription, JobSkills, JobDeliverables } from "@/components/jobs/job-details";
import { NumericInput } from "@/components/common/numeric-input";

const jobApplicationSchema = z.object({
    message: z.string().nonempty("Message is required"),
    amount: z.coerce.number().min(100, { message: "Amount must be at least $100" }).nonnegative(),
});

type JobApplicationFormValues = z.infer<typeof jobApplicationSchema>;

interface TalentPrivateJobCtasProps {
    inviteId: string | null;
    hasBeenInvited: boolean;
    jobId: string;
    jobCreator: string;
}

// @ts-expect-error unused variable
const TalentPrivateJobCtas: React.FC<TalentPrivateJobCtasProps> = ({ inviteId, hasBeenInvited, jobId, jobCreator }) => {
    const router = useRouter();
    const acceptInvite = useAcceptInvite();
    const declineInvite = useDeclineInvite();

    if (inviteId == null || !hasBeenInvited) return null;

    return (
        <div className="mt-auto flex w-full items-center justify-end">
            <div className="flex w-full max-w-sm items-center gap-4">
                <Button
                    fullWidth
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                        declineInvite.mutate(
                            { id: inviteId },
                            {
                                onSuccess: () => {
                                    router.push("/overview");
                                },
                            },
                        );
                    }}
                >
                    {declineInvite.isLoading ? <Spinner /> : "Decline"}
                </Button>

                <Button
                    fullWidth
                    size="sm"
                    onClick={() => {
                        acceptInvite.mutate(
                            { id: inviteId },
                            {
                                onSuccess: () => {
                                    router.push("/jobs?jobs-type=accepted");
                                },
                            },
                        );
                    }}
                >
                    {acceptInvite.isLoading ? <Spinner /> : "Accept Invite"}
                </Button>
            </div>
        </div>
    );
};

interface TalentJobApplyModalProps {
    jobId: string;
    jobCreator: string;
}

const TalentJobApplyModal: React.FC<TalentJobApplyModalProps> = ({ jobId, jobCreator }) => {
    const jobQuery = useGetJobById({ jobId });
    const applyToOpenJob = useApplyToOpenJob({ jobCreator, jobId });
    const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);

    const form = useForm<JobApplicationFormValues>({
        resolver: zodResolver(jobApplicationSchema),
        defaultValues: {
            message: "",
        },
    });

    const onSubmit: SubmitHandler<JobApplicationFormValues> = ({ amount, message = "" }) => {
        applyToOpenJob.mutate(
            {
                jobId,
                amount,
                message,
            },
            {
                onSuccess: () => {
                    setShowSuccessMessage(true);
                    void jobQuery.refetch();
                },
            },
        );
    };

    if (showSuccessMessage) {
        return (
            <div className="flex w-full max-w-xl flex-col gap-4 rounded-2xl border bg-white p-6">
                <div className="flex flex-col items-center gap-1">
                    <div className="-mt-[4] max-w-[200px]">
                        <Lottie animationData={success} loop={false} />
                    </div>

                    <h2 className="text-2xl font-medium">Application Sent</h2>
                    <span className="text-body">You will get a notification if the client sends you a message</span>
                </div>
            </div>
        );
    }
    return (
        <div className="flex w-full max-w-xl flex-col gap-4 rounded-2xl border bg-white p-6">
            <div className="flex flex-col items-center gap-1">
                <h2 className="text-2xl font-medium">Propose Price</h2>
            </div>

            <form className="flex flex-col items-center gap-6" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex w-full flex-col gap-2">
                    <label htmlFor="due" className="text-title">
                        Enter Bid
                    </label>

                    <div className="hover:duration-200h-[45px] flex items-center gap-2 rounded-lg border border-line bg-[#FCFCFD] px-4 py-3 outline-none focus-within:border-secondary hover:border-secondary">
                        {/* <DollarIcon /> */}
                        <span className="text-body ">$</span>
                        <NumericInput
                            type="text"
                            {...form.register("amount")}
                            placeholder="e.g 1000"
                            className="h-full  bg-transparent text-sm text-body focus:outline-none"
                        />
                    </div>

                    {form.formState.errors.amount != null && (
                        <span className="text-sm text-red-500">{form.formState.errors.amount.message}</span>
                    )}
                </div>

                <div className="flex w-full flex-col gap-2">
                    <label htmlFor="due" className="text-title">
                        Message
                    </label>
                    <textarea
                        rows={3}
                        maxLength={150}
                        id="due"
                        {...form.register("message")}
                        placeholder="Describe why you're a good candidate"
                        className="w-full resize-none rounded-lg border border-line bg-[#FCFCFD] px-4 py-3 outline-none focus-within:border-secondary hover:border-secondary hover:duration-200"
                    />
                    <div className="-mt-1 ml-auto w-fit text-sm text-body">
                        {form.watch("message")?.length} / 150 characters
                    </div>

                    {form.formState.errors.message != null && (
                        <span className="text-sm text-red-500">{form.formState.errors.message.message}</span>
                    )}
                </div>

                <Button fullWidth>{applyToOpenJob.isLoading ? <Spinner /> : "Send Application"}</Button>
            </form>
        </div>
    );
};

interface TalentOpenJobCtasProps {
    jobId: string;
    jobCreator: string;
    inviteId: string | null;
    hasAlreadyApplied: boolean;
    hasBeenInvited: boolean;
}

const TalentOpenJobCtas: React.FC<TalentOpenJobCtasProps> = ({
    jobId,
    jobCreator,
    hasBeenInvited,
    inviteId,
    hasAlreadyApplied,
}) => {
    const [isApplyModalOpen, setIsApplyModalOpen] = React.useState(false);
    if (hasBeenInvited)
        return (
            <TalentPrivateJobCtas
                inviteId={inviteId}
                hasBeenInvited={hasBeenInvited}
                jobId={jobId}
                jobCreator={jobCreator}
            />
        );

    return (
        <div className="ml-auto w-full max-w-[200px]">
            {!hasAlreadyApplied && (
                <Button
                    fullWidth
                    onClick={() => {
                        setIsApplyModalOpen(true);
                    }}
                >
                    Apply
                </Button>
            )}

            <Modal
                isOpen={isApplyModalOpen}
                closeModal={() => {
                    setIsApplyModalOpen(false);
                }}
            >
                <TalentJobApplyModal jobId={jobId} jobCreator={jobCreator} />
            </Modal>
        </div>
    );
};

interface TalentJobDetailsProps {
    job: Job;
    userId: string;
}

export const TalentJobDetails: React.FC<TalentJobDetailsProps> = ({ job, userId }) => {
    const searchParams = useSearchParams();
    const inviteId = job?.invite?._id ?? searchParams.get("invite-id");
    const JOB_TYPE: "private" | "open" = job.isPrivate ? "private" : "open";

    const jobApplicants = job.collections.filter(isJobApplicant);

    const hasAlreadyApplied = jobApplicants.some((applicant) => applicant.creator._id === userId);
    const hasBeenInvited = Boolean(String(job?.invite?.receiver._id) === String(userId));
    const CTAS = {
        open: TalentOpenJobCtas,
        private: TalentPrivateJobCtas,
    };

    const jobIsAssignedToAnotherTalent = job?.owner != null && job?.owner._id !== userId;

    const JobCtas = CTAS[JOB_TYPE];

    return (
        <div className="flex h-full gap-6">
            <div className="scrollbar-hide flex h-full grow flex-col overflow-y-auto pb-20">
                <JobHeader
                    title={job.name}
                    price={job.paymentFee}
                    dueDate={job.deliveryDate}
                    creator={{
                        _id: job?.creator?._id ?? "",
                        score: job?.creator?.score ?? 0,
                        avatar: job?.creator?.profileImage?.url,
                        name: `${job?.creator?.firstName} ${job?.creator?.lastName.slice(0, 1)}.`,
                    }}
                />

                <div className="flex w-full grow flex-col rounded-b-xl border border-t-0 border-line bg-white p-6">
                    <JobSkills skills={job.tags ?? []} />
                    <JobDescription description={job.description} />
                    <JobDeliverables
                        deliverables={job.collections.filter(isJobDeliverable).map((collection) => collection.name)}
                    />

                    {hasAlreadyApplied && (
                        <div className="my-3 flex w-full items-center gap-2 rounded-lg border border-blue-300 bg-blue-50 p-4 text-blue-500">
                            <Info size={20} />
                            <span className="text-center text-body">You have already applied to this job</span>
                        </div>
                    )}

                    {!job.inviteAccepted && !jobIsAssignedToAnotherTalent && (
                        <JobCtas
                            jobId={job._id}
                            inviteId={inviteId}
                            hasBeenInvited={hasBeenInvited}
                            hasAlreadyApplied={hasAlreadyApplied}
                            jobCreator={job.creator._id}
                        />
                    )}

                    {job.inviteAccepted && !jobIsAssignedToAnotherTalent && (
                        <div className="my-3 flex w-full items-center gap-2 rounded-lg border border-green-300 bg-green-50 p-4 text-green-500">
                            <Info size={20} />
                            <span className="text-center text-green-500">
                                You have already accepted this Job invite.
                            </span>
                        </div>
                    )}

                    {jobIsAssignedToAnotherTalent && (
                        <div className="my-3 flex w-full items-center gap-2 rounded-lg border border-red-300 bg-red-50 p-4 text-red-500">
                            <Info size={20} />
                            <span className="text-center text-red-500">
                                This job is already assigned to another talent. You can apply to other jobs.
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex h-full w-fit basis-[270px] flex-col items-center gap-7" />
        </div>
    );
};
