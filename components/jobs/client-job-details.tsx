"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React, { type ReactElement } from "react";
import { Button } from "pakt-ui";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { isJobDeliverable } from "@/lib/types";
import { Spinner } from "@/components/common";
import { useDeleteJob, useCancelJobInvite } from "@/lib/api/job";
import type { Job } from "@/lib/types";
import { Modal } from "@/components/common/headless-modal";
import { JobHeader, JobDescription, JobSkills, JobDeliverables } from "@/components/jobs/job-details";

// CLIENT JOB DETAILS

interface ClientPrivateJobCtasProps {
    jobId: string;
    openDeleteModal: () => void;
    skills?: string[];
}

const ClientPrivateJobCtas: React.FC<ClientPrivateJobCtasProps> = ({ jobId, skills = [], openDeleteModal }) => {
    const router = useRouter();

    return (
        <div className="mt-auto flex w-full items-center justify-between gap-4">
            <div className="w-full max-w-[160px] rounded-xl border border-red-400">
                <Button fullWidth variant="danger" onClick={openDeleteModal} size="sm">
                    Delete Job
                </Button>
            </div>

            <div className="flex w-full max-w-sm items-center gap-2">
                <Button
                    fullWidth
                    variant="outline"
                    onClick={() => {
                        router.push(`/jobs/${jobId}/edit`);
                    }}
                >
                    Edit Job
                </Button>
                <Button
                    fullWidth
                    onClick={() => {
                        router.push(
                            `/talents${skills != null && skills?.length > 0 ? `?skills=${skills?.join(",")}` : ""}`,
                        );
                    }}
                >
                    Find Talent
                </Button>
            </div>
        </div>
    );
};

interface ClientOpenJobCtasProps {
    jobId: string;
    openDeleteModal: () => void;
}

const ClientOpenJobCtas: React.FC<ClientOpenJobCtasProps> = ({ jobId, openDeleteModal }) => {
    const router = useRouter();

    return (
        <div className="mt-auto flex w-full items-center justify-between gap-4">
            <div className="w-full max-w-[160px] rounded-xl border border-red-400">
                <Button fullWidth variant="danger" onClick={openDeleteModal}>
                    Delete Job
                </Button>
            </div>

            <div className="flex w-full max-w-sm items-center gap-2">
                <Button
                    fullWidth
                    variant="outline"
                    onClick={() => {
                        router.push(`/jobs/${jobId}/edit`);
                    }}
                >
                    Edit Job
                </Button>
                <Button
                    fullWidth
                    onClick={() => {
                        router.push(`/jobs/${jobId}/applicants`);
                    }}
                >
                    View Applicants
                </Button>
            </div>
        </div>
    );
};

interface ClientDeleteJobModalProps {
    jobId: string;
    title: string;
    setModalOpen: (state: boolean) => void;
}

// @ts-expect-error --- Unused variable
const DeleteJobModal: React.FC<ClientDeleteJobModalProps> = ({ jobId, title, setModalOpen }) => {
    const deleteJobMutation = useDeleteJob();
    const router = useRouter();

    return (
        <div className="flex w-full max-w-xl flex-col gap-4 rounded-2xl border bg-white p-6">
            <div className="flex flex-col items-center gap-4">
                <h2 className="text-2xl font-medium">Delete Job</h2>
                <span className="text-center text-body">
                    This action is irreversible. Once you delete the Job, all of its content and data will be
                    permanently erased.
                </span>
                <span className="font-bold text-body">Are you sure you want to proceed with the deletion?</span>
            </div>
            <div className="mt-auto flex w-full flex-row items-center justify-between gap-2">
                <Button
                    fullWidth
                    variant="secondary"
                    onClick={() => {
                        setModalOpen(false);
                    }}
                >
                    No, Cancel
                </Button>
                <div className="w-full rounded-xl border border-red-400">
                    <Button
                        fullWidth
                        variant="danger"
                        onClick={() => {
                            deleteJobMutation.mutate(
                                { id: jobId },

                                {
                                    onSuccess: () => {
                                        router.push("/jobs");
                                    },
                                },
                            );
                        }}
                        disabled={deleteJobMutation.isLoading}
                    >
                        {deleteJobMutation.isLoading ? <Spinner /> : "Yes, Proceed"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

interface ClientJobDetailsProps {
    job: Job;
}

export function ClientJobDetails({ job }: ClientJobDetailsProps): ReactElement {
    const cancelInvite = useCancelJobInvite();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const JOB_TYPE: "private" | "open" = job.isPrivate ? "private" : "open";

    const CTAS = {
        open: ClientOpenJobCtas,
        private: ClientPrivateJobCtas,
    };

    const JobCtas = CTAS[JOB_TYPE];

    return (
        <div className="flex h-full gap-6">
            <div className="scrollbar-hide flex h-full grow flex-col overflow-y-auto pb-20">
                <JobHeader
                    title={job.name}
                    price={job.paymentFee}
                    dueDate={job.deliveryDate}
                    creator={{
                        _id: job?.owner?._id ?? "",
                        score: job?.owner?.score ?? 0,
                        avatar: job?.owner?.profileImage?.url,
                        name: `${job?.owner?.firstName} ${job?.owner?.lastName.slice(0, 1)}.`,
                    }}
                />
                <div className="flex w-full grow flex-col rounded-b-xl border border-t-0 border-line bg-white p-6">
                    <JobSkills skills={job.tags ?? []} />
                    <JobDescription description={job.description} />

                    <JobDeliverables
                        deliverables={job.collections.filter(isJobDeliverable).map((collection) => collection.name)}
                    />

                    {job.invite == null && (
                        <JobCtas
                            jobId={job._id}
                            skills={job.tagsData}
                            openDeleteModal={() => {
                                setIsDeleteModalOpen(true);
                            }}
                        />
                    )}

                    {job.invite != null && (
                        <div className="my-3 flex w-full items-center justify-between gap-2 rounded-2xl border border-blue-300 bg-blue-50 p-4 text-blue-500">
                            <div className="flex items-center gap-2">
                                <Info size={20} />
                                <span>Awaiting Talent Response</span>
                            </div>

                            <button
                                className="flex h-[35px] w-[130px] items-center justify-center rounded-lg border border-red-500 bg-red-50 text-sm text-red-500"
                                onClick={() => {
                                    cancelInvite.mutate({ inviteId: job.invite?._id ?? "" }, {});
                                }}
                                type="button"
                            >
                                {cancelInvite.isLoading ? <Spinner size={16} /> : "Cancel Invite"}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex  h-full w-fit basis-[270px] flex-col items-center gap-7" />
            <Modal
                isOpen={isDeleteModalOpen}
                closeModal={() => {
                    setIsDeleteModalOpen(false);
                }}
            >
                <DeleteJobModal jobId={job._id} title={job.name} setModalOpen={setIsDeleteModalOpen} />
            </Modal>
        </div>
    );
}
