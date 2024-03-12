"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect } from "react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type Job } from "@/lib/types";
import { WalletConnectorList } from "./wallet-connector-list";
import { DepositAvax } from "./deposit-avax";
import { DepositUSDC } from "./deposit-usdc";

type SUPPORTED_COINS_TYPES = "USDC" | "AVAX";

interface PayWithWalletProps {
	jobId: string;
	job: Job;
	amount: number;
	coin: SUPPORTED_COINS_TYPES;
	depositAddress: string;
	contractAddress?: string;
	chainId: number;
	closeModel: () => void;
}

export const PayWithWallet = ({
	amount,
	depositAddress,
	jobId,
	closeModel,
	coin,
	job,
	contractAddress,
	chainId,
}: PayWithWalletProps): React.JSX.Element => {
	const { chain } = useNetwork();
	const { isConnected } = useAccount();
	const isWrongChain = chain?.id !== chainId;

	const { switchNetwork } = useSwitchNetwork({ chainId });

	// switch network if wrong chain
	useEffect(() => {
		if (isWrongChain && switchNetwork != null) {
			switchNetwork();
		}
	}, [isConnected, isWrongChain, switchNetwork]);

	return (
		<div className="flex flex-col gap-8">
			<p className="text-center text-sm text-[#87898E]">
				By connecting a wallet, you agree to
				<span className="text-[#3772FF]"> Terms of Service </span>
				and acknowledge that you have read and understand the{" "}
				<span className="text-[#3772FF]">disclaimer.</span>
			</p>

			<WalletConnectorList />

			{coin === "AVAX" && (
				<DepositAvax
					jobId={jobId}
					amount={amount}
					depositAddress={depositAddress}
					closeModel={closeModel}
					job={job}
					chainId={chainId}
				/>
			)}
			{coin === "USDC" && (
				<DepositUSDC
					jobId={jobId}
					amount={amount}
					depositAddress={depositAddress}
					closeModel={closeModel}
					job={job}
					contractAddress={contractAddress}
					chainId={chainId}
				/>
			)}
		</div>
	);
};
