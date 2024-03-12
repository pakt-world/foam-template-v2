"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC, useEffect } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { cn, formatUsd } from "@/lib/utils";
import { useWalletState } from "@/lib/store/wallet";
import { useGetWalletDetails } from "@/lib/api/wallet";

interface Props {
	className?: string;
}

export const UserBalance: FC<Props> = ({ className }) => {
	const { totalWalletBalance } = useWalletState();
	const { refetch } = useGetWalletDetails();
	useEffect(() => {
		void refetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<span className={cn("text-3xl text-body", className)}>
			{formatUsd(parseFloat(totalWalletBalance))}
		</span>
	);
};
