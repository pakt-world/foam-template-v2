"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "pakt-ui";
import { parseEther } from "viem";
import { usePrepareSendTransaction, useSendTransaction } from "wagmi";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Spinner } from "@/components/common";
import { useConfirmJobPayment, useInviteTalentToJob } from "@/lib/api/job";
import { type Job } from "@/lib/types";
import { useErrorService } from "@/lib/store/error-service";

interface WalletDepositProps {
    jobId: string;
    amount: number;
    depositAddress: string;
    job: Job;
    chainId: number;
    // eslint-disable-next-line react/no-unused-prop-types
    closeModel: () => void;
    // eslint-disable-next-line react/no-unused-prop-types
    contractAddress?: string;
}

export const DepositAvax = ({ depositAddress, amount, jobId, job, chainId }: WalletDepositProps): ReactElement => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const confirmPayment = useConfirmJobPayment();
    const talentId = searchParams.get("talent-id") ?? "";
    const inviteTalent = useInviteTalentToJob({ talentId, job });
    const { setErrorMessage } = useErrorService();

    const { config } = usePrepareSendTransaction({
        chainId,
        to: depositAddress,
        value: parseEther(amount.toString()),
    });

    const { sendTransaction, isLoading } = useSendTransaction({
        ...config,
        onSuccess() {
            confirmPayment.mutate(
                { jobId },
                {
                    onSuccess: () => {
                        if (talentId !== "") {
                            inviteTalent.mutate(
                                {
                                    jobId,
                                    talentId,
                                },
                                {
                                    onSuccess: () => {
                                        router.push(`/overview`);
                                    },
                                },
                            );
                        }
                    },
                },
            );
        },
        onError(error) {
            setErrorMessage({
                title: "useSendTransaction Function",
                message: error,
            });
        },
    });

    return (
        <div>
            <Button
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- !sendTransaction is not undefined
                disabled={!sendTransaction || isLoading || confirmPayment.isLoading}
                onClick={() => {
                    sendTransaction?.();
                }}
                fullWidth
            >
                <div className="flex items-center justify-center gap-2">
                    <span> Make Payment</span> <span>{(isLoading || confirmPayment.isLoading) && <Spinner />}</span>
                </div>
            </Button>
        </div>
    );
};
