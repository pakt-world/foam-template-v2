"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement, useEffect, useMemo, useState } from "react";
import { UserPlus } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { UserBalance } from "@/components/common/user-balance";
import { ReferralSideModal } from "./refer";
import { useUserState } from "@/lib/store/account";
import { useGetTalentReviewById } from "@/lib/api";
import { hasFiveStarReview } from "@/lib/types";

export const OverviewHeader = (): ReactElement => {
	const [referOpen, _setReferOpen] = useState(false);
	const { _id, firstName } = useUserState();
	const {
		data: reviewData,
		refetch,
		isLoading,
	} = useGetTalentReviewById(_id, "1", "100");

	// checking refer availability
	useEffect(() => {
		void refetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const hasFiveStar = useMemo(() => {
		if (!reviewData || isLoading) return false;
		return hasFiveStarReview(reviewData.data);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reviewData]);

	return (
		<div className="flex items-center justify-between">
			<ReferralSideModal
				isOpen={referOpen}
				onOpenChange={(e) => {
					_setReferOpen(e);
				}}
			/>
			<div className="text-3xl font-bold text-title">
				Hello {firstName}!
			</div>

			<div className="flex items-center gap-7">
				{hasFiveStar && (
					<button
						className="mr-6 flex items-center gap-2 rounded-lg border border-primary bg-[#ECFCE5] px-3 py-1 text-sm font-bold text-primary"
						onClick={() => {
							_setReferOpen(true);
						}}
						type="button"
					>
						<UserPlus size={18} />
						<span>Refer</span>
					</button>
				)}
				<div className="flex items-center gap-2 text-3xl text-title">
					<UserBalance />
					<span>|</span> <span className="text-body">Balance</span>
				</div>
			</div>
		</div>
	);
};
