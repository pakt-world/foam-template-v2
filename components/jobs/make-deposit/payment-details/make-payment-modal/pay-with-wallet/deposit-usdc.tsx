"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "pakt-ui";
import { parseUnits } from "viem";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { erc20ABI } from "@wagmi/core";

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

export const DepositUSDC = ({
    amount,
    depositAddress,
    jobId,
    job,
    contractAddress,
    chainId,
}: WalletDepositProps): React.JSX.Element => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const talentId = searchParams.get("talent-id") ?? "";
    const confirmPayment = useConfirmJobPayment();
    const inviteTalent = useInviteTalentToJob({ talentId, job });
    const [showReconfirmButton, setShowReconfirmButton] = useState(false);
    const amountToPay = parseUnits(amount.toString(), 6);
    const { setErrorMessage } = useErrorService();

    const { config } = usePrepareContractWrite({
        abi: erc20ABI,
        chainId,
        functionName: "transfer",
        address: `0x${contractAddress?.substring(2)}`,
        args: [`0x${depositAddress.substring(2)}`, amountToPay],
    });

    const { write, isError, isLoading } = useContractWrite({
        ...config,
        onSuccess() {
            confirmPayment.mutate(
                { jobId, delay: 6000 },
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
                    onError: () => {
                        setShowReconfirmButton(true);
                    },
                },
            );
        },
        onError(error) {
            setErrorMessage({
                title: "useContractWrite Function",
                message: error,
            });
        },
    });

    return (
        <div className="flex flex-col gap-2">
            {isError && (
                <div className="flex flex-col items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-500">
                    <span>An error occurred while making payment.</span>
                </div>
            )}

            {showReconfirmButton && (
                <Button
                    fullWidth
                    disabled={confirmPayment.isLoading}
                    onClick={() => {
                        confirmPayment.mutate(
                            { jobId, delay: 6000 },
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
                                onError: () => {
                                    setShowReconfirmButton(true);
                                },
                            },
                        );
                    }}
                >
                    {confirmPayment.isLoading ? <Spinner /> : "Confirm Payment"}
                </Button>
            )}

            <Button
                fullWidth
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- !write is not undefined
                disabled={!write || isLoading || confirmPayment.isLoading}
                onClick={() => {
                    write?.();
                }}
            >
                <div className="flex items-center justify-center gap-2">
                    <span> {confirmPayment.isLoading ? "Confirming Payment" : "Make Payment"}</span>{" "}
                    <span>{(isLoading || confirmPayment.isLoading) && <Spinner />}</span>
                </div>
            </Button>
        </div>
    );
};
