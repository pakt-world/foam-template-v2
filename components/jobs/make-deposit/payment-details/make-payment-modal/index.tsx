"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { X } from "lucide-react";

import * as Tabs from "@radix-ui/react-tabs";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type Job } from "@/lib/types";
import { PayWithWallet } from "./pay-with-wallet";
import { DepositToAddress } from "./deposit-to-address";

type SUPPORTED_COINS_TYPES = "USDC" | "AVAX";

interface MakePaymentModalProps {
    jobId: string;
    job: Job;
    coinAmount: number;
    depositAddress: string;
    closeModal: () => void;
    coin: SUPPORTED_COINS_TYPES;
    chainId: number;
    contractAddress?: string;
}

export const MakePaymentModal = ({
    closeModal,
    depositAddress,
    jobId,
    job,
    coinAmount,
    coin,
    contractAddress,
    chainId,
}: MakePaymentModalProps): ReactElement => {
    return (
        <div className="mx-auto flex w-full max-w-[400px] flex-col gap-6 rounded-2xl border bg-white p-6">
            <div className="flex w-full items-center justify-between">
                <h2 className="text-2xl font-bold text-title">Make Payment</h2>

                <button
                    className="rounded-full border border-[#DFDFE6] p-2 text-black duration-200 hover:border-danger hover:text-danger"
                    onClick={closeModal}
                    type="button"
                    aria-label="Close"
                >
                    <X size={16} strokeWidth={2} />
                </button>
            </div>

            <div className="flex grow flex-col items-center justify-center">
                <Tabs.Root defaultValue="connect-wallet" className="flex flex-col gap-6">
                    <Tabs.List className="grid grid-cols-2 gap-1 rounded-lg bg-[#F0F2F5] p-0.5 text-base text-[#828A9B]">
                        <Tabs.Trigger
                            className="rounded-lg p-2 px-2 duration-200 hover:bg-white radix-state-active:bg-white"
                            value="connect-wallet"
                        >
                            Connect Wallet
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            className="rounded-lg p-2 px-2 duration-200 hover:bg-white radix-state-active:bg-white"
                            value="deposit-to-address"
                        >
                            Deposit To Address
                        </Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content value="connect-wallet">
                        <PayWithWallet
                            jobId={jobId}
                            closeModel={closeModal}
                            amount={coinAmount}
                            depositAddress={depositAddress}
                            coin={coin}
                            contractAddress={contractAddress}
                            chainId={chainId}
                            job={job}
                        />
                    </Tabs.Content>
                    <Tabs.Content value="deposit-to-address">
                        <DepositToAddress
                            jobId={jobId}
                            job={job}
                            coin={coin}
                            closeModel={closeModal}
                            amount={coinAmount}
                            depositAddress={depositAddress}
                        />
                    </Tabs.Content>
                </Tabs.Root>
            </div>
        </div>
    );
};
