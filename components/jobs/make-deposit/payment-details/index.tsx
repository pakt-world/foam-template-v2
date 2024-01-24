"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import Image from "next/image";
import { Button } from "pakt-ui";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Modal } from "@/components/common/headless-modal";
import { type PostJobPaymentDetailsResponse } from "@/lib/api/job";
import { type Job } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MakePaymentModal } from "./make-payment-modal";
import { PageLoading } from "@/components/common/page-loading";

type SUPPORTED_COINS_TYPES = "USDC" | "AVAX";

interface PaymentDetailsProps {
    jobId: string;
    job?: Job;
    coin: SUPPORTED_COINS_TYPES;
    paymentDetails?: PostJobPaymentDetailsResponse;
    isLoading: boolean;
    isError: boolean;
    errMsg?: string;
    contractAddress?: string;
}

export const PaymentDetails = ({
    coin,
    jobId,
    isLoading,
    isError,
    errMsg,
    paymentDetails,
    job,
    contractAddress,
}: PaymentDetailsProps): React.JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    if (isLoading)
        return (
            <div className="flex min-h-[400px] w-full items-center justify-center rounded-xl border border-line bg-slate-50">
                <PageLoading color="#007C5B" />
            </div>
        );

    if (isError || paymentDetails == null || job == null)
        return (
            <div className="flex min-h-[400px] w-full items-center justify-center rounded-xl border border-red-100 bg-red-50">
                <div className="flex flex-col items-center gap-2 text-red-500">
                    <AlertCircle size={45} strokeWidth={2} />
                    <span>{errMsg ?? "Something went wrong. Please try again later."}</span>
                </div>
            </div>
        );
    const depositAddress = paymentDetails.address;

    return (
        <div className="flex w-full flex-col  gap-6">
            <div
                className={cn("flex flex-col gap-4 rounded-lg border border-[#198155] bg-[#ECFCE5] p-4 text-[#198155]")}
            >
                <h2 className="text-lg font-bold">Payment Details</h2>

                <div className="flex flex-col gap-6 text-lg">
                    <div className="flex items-center justify-between">
                        <span>Amount</span>
                        <span>${paymentDetails?.collectionAmount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Talent Receives</span>
                        <span>${paymentDetails?.collectionAmount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Transaction Fee</span>
                        <span>
                            ${Number(paymentDetails?.usdFee).toFixed(2)} ({paymentDetails?.feePercentage}%)
                        </span>
                    </div>
                    <div className="flex items-center justify-between font-bold">
                        <span>Total</span>
                        <span>
                            {paymentDetails?.amountToPay} {coin}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-[#FCFCFC] p-6">
                <div className="flex items-center gap-4">
                    <Image src="/icons/metamask.svg" alt="Coinbase" width={50} height={50} />
                    <Image src="/icons/coinbase.svg" alt="Coinbase" width={50} height={50} />
                    <Image src="/icons/wallet-connect.svg" alt="Coinbase" width={50} height={50} />
                </div>
                <p className="text-body">Connect your wallet of choice or pay with a deposit address.</p>
            </div>

            <Modal
                isOpen={isOpen}
                closeModal={() => {
                    setIsOpen(false);
                }}
                disableClickOutside
            >
                <MakePaymentModal
                    depositAddress={depositAddress}
                    job={job}
                    jobId={jobId}
                    closeModal={() => {
                        setIsOpen(false);
                    }}
                    coin={coin}
                    coinAmount={paymentDetails?.amountToPay}
                    contractAddress={contractAddress}
                    chainId={Number(paymentDetails?.chainId)}
                />
            </Modal>

            <Button
                fullWidth
                onClick={() => {
                    setIsOpen(true);
                }}
            >
                Make Deposit
            </Button>
        </div>
    );
};
