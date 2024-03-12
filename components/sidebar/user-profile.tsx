"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { useWindowSize } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { AfroProfile } from "@/components/common/afro-profile";
import { useUserState } from "@/lib/store/account";

export const UserProfile = (): ReactElement => {
	const account = useUserState();
	const size = useWindowSize();

	return (
		<div className="flex flex-col items-center gap-2">
			<AfroProfile
				score={account?.score ?? 0}
				// size="2xl"
				src={account?.profileImage?.url}
				url="/profile"
				size={
					size.width > 1530 ? "2xl" : size.width > 768 ? "xl" : "sm"
				}
			/>

			<div className="flex flex-col gap-0 text-center">
				<span className="text-lg">
					{account?.firstName} {account?.lastName}
				</span>
				<span className="text-sm capitalize text-sky">
					{account?.profile?.bio?.title}
				</span>
			</div>
		</div>
	);
};
