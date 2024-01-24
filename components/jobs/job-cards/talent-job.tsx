"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC, useState, useEffect } from "react";
import { Button } from "pakt-ui";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type JobStatus } from "@/lib/types";
import { SideModal } from "@/components/common/side-modal";
import { AfroProfile } from "@/components/common/afro-profile";
import { TalentJobModal } from "@/components/jobs/job-modals/talent";
import { DeliverableProgressBar } from "@/components/common/deliverable-progress-bar";
import { useErrorService } from "@/lib/store/error-service";

interface TalentJobCardProps {
    jobId: string;
    title: string;
    price: number;
    status?: JobStatus;
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

export const TalentJobCard: FC<TalentJobCardProps> = ({
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
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const progress = Math.floor((completedDeliverables / totalDeliverables) * 100);
    const { setErrorMessage } = useErrorService();

    useEffect(() => {
        setErrorMessage({
            title: "This is a temporary useEffect",
            message: status,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            className={`flex w-full grow flex-col gap-1 rounded-3xl border  p-4 pt-0 ${status === "cancelled" ? "border-[#FF5247] bg-[#FFF4F4]" : "border-line bg-white"}`}
        >
            <div className="flex w-full gap-4">
                <div className="-ml-3">
                    <AfroProfile score={client.paktScore} size="2md" src={client.avatar} />
                </div>
                <div className="-ml-3 flex grow flex-col gap-2 pt-4">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-lg font-bold text-body">{client.name}</span>

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
                        <Button
                            size="xs"
                            variant={status === "cancelled" ? "danger" : "secondary"}
                            onClick={() => {
                                setIsUpdateModalOpen(true);
                            }}
                            disabled={status === "cancelled"}
                        >
                            {status === "cancelled"
                                ? "Cancelled"
                                : progress < 100
                                  ? "Update"
                                  : progress === 100
                                    ? "Review"
                                    : "Update"}
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

                <DeliverableProgressBar
                    totalDeliverables={totalDeliverables}
                    percentageProgress={progress}
                    className="w-full max-w-none"
                />

                <SideModal
                    isOpen={isUpdateModalOpen}
                    onOpenChange={() => {
                        setIsUpdateModalOpen(false);
                    }}
                    className="flex flex-col"
                >
                    <TalentJobModal
                        talentId={client.id}
                        jobId={jobId}
                        closeModal={() => {
                            setIsUpdateModalOpen(false);
                        }}
                    />
                </SideModal>
            </div>
        </div>
    );
};
