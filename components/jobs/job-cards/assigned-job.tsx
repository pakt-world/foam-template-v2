"use client";
import React from "react";
import { Button } from "pakt-ui";
import { JobCancellation, JobStatus, ReviewChangeRequest } from "@/lib/types";
import { useRouter } from "next/navigation";
import { SideModal } from "@/components/common/side-modal";
import { AfroProfile } from "@/components/common/afro-profile";
import { ClientJobModal } from "@/components/jobs/job-modals/client";
import { TalentJobModal } from "@/components/jobs/job-modals/talent";
import { DeliverableProgressBar } from "@/components/common/deliverable-progress-bar";

interface ClientJobCardProps {
    jobId: string;
    title: string;
    price: number;
    status: JobStatus;
    isCompleted?: boolean;
    isCancelled?: boolean;
    totalDeliverables: number;
    completedDeliverables: number;
    talent: {
        id: string;
        name: string;
        avatar?: string;
        paktScore: number;
    };
    reviewRequestChange?: ReviewChangeRequest;
}

export const ClientJobCard: React.FC<ClientJobCardProps> = ({
    talent,
    price,
    title,
    jobId,
    status,
    isCancelled,
    totalDeliverables,
    completedDeliverables,
    isCompleted,
    reviewRequestChange,
}) => {
    const router = useRouter();
    const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState(false);
    const progress = Math.floor((completedDeliverables / totalDeliverables) * 100);

    return (
        <div className="flex w-full grow flex-col gap-1 rounded-3xl border border-line bg-white p-4 pt-0">
            <div className="flex w-full gap-4">
                <div className="-ml-3">
                    <AfroProfile
                        score={talent.paktScore}
                        size="2md"
                        src={talent.avatar}
                        url={`/talents/${talent.id}`}
                    />
                </div>
                <div className="-ml-3 flex grow flex-col gap-2 pt-4">
                    <div className="flex items-center justify-between gap-2">
                        {<span className="text-lg font-bold text-body">{talent.name}</span>}
                        <span className="inline-flex rounded-full bg-[#B2E9AA66] px-3 text-base text-title">
                            ${price}
                        </span>
                    </div>
                    <div className="flex grow items-center break-words text-2xl text-title">{title}</div>
                </div>
            </div>
            <div className="mt-auto flex w-full items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    {!isCompleted && (
                        <Button size="xs" variant="secondary" onClick={() => setIsUpdateModalOpen(true)}>
                            {status === "completed" ? (reviewRequestChange ? "View Request" : "Review") : "See Updates"}
                        </Button>
                    )}
                    <Button
                        size="xs"
                        variant="outline"
                        onClick={() => {
                            router.push(`/messages?userId=${talent.id}`);
                        }}
                    >
                        Message Talent
                    </Button>
                </div>

                {
                    <DeliverableProgressBar
                        isCancelled={isCancelled}
                        percentageProgress={progress}
                        totalDeliverables={totalDeliverables}
                        className="w-full max-w-none"
                    />
                }

                <SideModal
                    isOpen={isUpdateModalOpen}
                    onOpenChange={() => setIsUpdateModalOpen(false)}
                    className="flex flex-col"
                >
                    <ClientJobModal jobId={jobId} talentId={talent.id} closeModal={() => setIsUpdateModalOpen(false)} />
                </SideModal>
            </div>
        </div>
    );
};

interface TalentJobCardProps {
    jobId: string;
    title: string;
    price: number;
    status: JobStatus;
    isCompleted?: boolean;
    totalDeliverables: number;
    completedDeliverables: number;
    client: {
        id: string;
        name: string;
        avatar?: string;
        paktScore: number;
    };
}

export const TalentJobCard: React.FC<TalentJobCardProps> = ({
    client,
    price,
    title,
    jobId,
    status,
    isCompleted,
    totalDeliverables,
    completedDeliverables,
}) => {
    const router = useRouter();
    const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState(false);
    const progress = Math.floor((completedDeliverables / totalDeliverables) * 100);

    return (
        <div className="flex w-full grow flex-col gap-1 rounded-3xl border border-line bg-white p-4 pt-0">
            <div className="flex w-full gap-4">
                <div className="-ml-3">
                    <AfroProfile score={client.paktScore} size="2md" src={client.avatar} />
                </div>
                <div className="-ml-3 flex grow flex-col gap-2 pt-4">
                    <div className="flex items-center justify-between gap-2">
                        {<span className="text-lg font-bold text-body">{client.name}</span>}

                        <span className="inline-flex rounded-full bg-[#B2E9AA66] px-3 text-base text-title">
                            ${price}
                        </span>
                    </div>
                    <div className="flex grow items-center break-words text-2xl text-title">{title}</div>
                </div>
            </div>
            <div className="mt-auto flex w-full items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    {!isCompleted && (
                        <Button size="xs" variant="secondary" onClick={() => setIsUpdateModalOpen(true)}>
                            {status === "completed" ? "Review" : "Update"}
                        </Button>
                    )}

                    <Button
                        size="xs"
                        variant="outline"
                        onClick={() => {
                            router.push(`/messages?userId=${client.id}`);
                        }}
                    >
                        Message Client
                    </Button>
                </div>

                {
                    <DeliverableProgressBar
                        totalDeliverables={totalDeliverables}
                        percentageProgress={progress}
                        className="w-full max-w-none"
                    />
                }

                <SideModal
                    isOpen={isUpdateModalOpen}
                    onOpenChange={() => setIsUpdateModalOpen(false)}
                    className="flex flex-col"
                >
                    <TalentJobModal talentId={client.id} jobId={jobId} closeModal={() => setIsUpdateModalOpen(false)} />
                </SideModal>
            </div>
        </div>
    );
};
