"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Copy } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "pakt-ui";
import QRCode from "react-qr-code";
import { useCopyToClipboard } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Spinner } from "@/components/common";
import { useConfirmJobPayment, useInviteTalentToJob } from "@/lib/api/job";
import { type Job } from "@/lib/types";

type SUPPORTED_COINS_TYPES = "USDC" | "AVAX";

interface DepositToAddressProps {
    jobId: string;
    job: Job;
    amount: number;
    coin: SUPPORTED_COINS_TYPES;
    depositAddress: string;
    closeModel: () => void;
}

export const DepositToAddress = ({
    amount,
    depositAddress,
    jobId,
    job,
    closeModel,
    coin,
}: DepositToAddressProps): React.JSX.Element => {
    const router = useRouter();
    const searchParams = useSearchParams();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const [value, copy] = useCopyToClipboard();
    const confirmPayment = useConfirmJobPayment();
    const talentId = searchParams.get("talent-id") ?? "";
    const inviteTalent = useInviteTalentToJob({ talentId, job });

    return (
        <div className="flex flex-col gap-4">
            <p className="text-center text-sm text-[#87898E]">
                Copy the wallet address or scan QR code to make payment. Click I have made transfer to continue.
            </p>

            <div className="flex justify-between gap-2 rounded-2xl border border-primary bg-[#ECFCE5] px-4 py-6 text-primary">
                <span className="text-lg">Total Amount:</span>
                <span className="text-lg font-bold">
                    {amount} {coin}
                </span>
            </div>

            <div className="flex w-full items-center justify-between gap-2 rounded-2xl border border-line bg-[#fcfcfc] px-4 py-4">
                <span className="max-w-[250px] break-words text-sm">{depositAddress}</span>

                <button
                    className="flex shrink-0 items-center gap-1 rounded-lg border border-primary !border-opacity-80 bg-[#ECFCE5] px-3 py-2 text-xs text-primary !text-opacity-80"
                    onClick={async () => copy(depositAddress)}
                    type="button"
                >
                    <Copy size={14} strokeWidth={2} />
                    <span>
                        {value !== undefined ? (
                            <span className="animate-pulse">Copied</span>
                        ) : (
                            <span className="animate-pulse">Copy</span>
                        )}
                    </span>
                </button>
            </div>

            <div className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-[#fcfcfc] px-4 py-4">
                <QRCode value={depositAddress} size={150} />
            </div>

            <Button
                onClick={() => {
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
                                closeModel();
                                router.push(`/overview`);
                            },
                            onError: () => {},
                        },
                    );
                }}
                fullWidth
            >
                {confirmPayment.isLoading || inviteTalent.isLoading ? <Spinner /> : "I have made transfer"}
            </Button>
        </div>
    );
};
