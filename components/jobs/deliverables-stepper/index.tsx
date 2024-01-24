"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { Button } from "pakt-ui";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Spinner } from "@/components/common";
import { useMarkJobAsComplete, useUpdateJobProgress } from "@/lib/api/job";
import { type Deliverable, DeliverableStep } from "./deliverables-step";

interface DeliverablesStepperProps {
    jobId: string;
    talentId: string;
    readonly?: boolean;
    jobCreator: string;
    jobProgress: number;
    showActionButton?: boolean;
    deliverables: Deliverable[];
}

export const DeliverablesStepper = ({
    jobId,
    jobCreator,
    talentId,
    jobProgress,
    deliverables,
    readonly: isClient,
    showActionButton = true,
}: DeliverablesStepperProps): ReactElement => {
    const updateJobProgress = useUpdateJobProgress({ creatorId: jobCreator });
    const markJobAsComplete = useMarkJobAsComplete();
    const totalDeliverables = deliverables.length;
    const completedDeliverables = deliverables.filter((deliverable) => deliverable.progress === 100).length;
    // console.log(deliverables);

    return (
        <div className="flex h-full w-full grow flex-col pb-6">
            {deliverables
                .sort((a, b) => b.progress - a.progress)
                .map(({ deliverableId, description, jobId: jId, progress, meta }, index) => {
                    return (
                        <DeliverableStep
                            jobId={jId}
                            jobCreator={jobCreator}
                            isClient={isClient}
                            progress={progress}
                            key={deliverableId}
                            updatedAt={meta?.completedAt as string}
                            description={description}
                            deliverableId={deliverableId}
                            totalDeliverables={totalDeliverables}
                            isLast={index === totalDeliverables - 1}
                            completedDeliverables={completedDeliverables}
                        />
                    );
                })}

            <div className="mt-auto">
                {showActionButton && isClient && jobProgress === 100 && (
                    <Button
                        className="mt-6"
                        size="sm"
                        fullWidth
                        onClick={() => {
                            markJobAsComplete.mutate(
                                {
                                    jobId,
                                    talentId,
                                },
                                {
                                    onError: () => {
                                        markJobAsComplete.reset();
                                    },
                                },
                            );
                        }}
                    >
                        {markJobAsComplete.isLoading ? <Spinner size={20} /> : "Finalize Job and Review"}
                    </Button>
                )}

                {showActionButton && !isClient && jobProgress === 100 && (
                    <div className="mt-6 rounded-[10px] bg-primary-gradient p-[1.5px]">
                        <div className="rounded-lg bg-green-50 px-2 py-3">
                            Waiting for Client to approve job as complete.
                        </div>
                    </div>
                )}

                {showActionButton &&
                    !isClient &&
                    jobProgress !== 100 &&
                    completedDeliverables === totalDeliverables && (
                        <Button
                            className="mt-6"
                            size="sm"
                            fullWidth
                            onClick={() => {
                                updateJobProgress.mutate(
                                    {
                                        jobId,
                                        progress: 100,
                                    },
                                    {
                                        onError: () => {
                                            updateJobProgress.reset();
                                        },
                                    },
                                );
                            }}
                        >
                            {updateJobProgress.isLoading ? <Spinner size={20} /> : "Complete Job"}
                        </Button>
                    )}
            </div>
        </div>
    );
};
