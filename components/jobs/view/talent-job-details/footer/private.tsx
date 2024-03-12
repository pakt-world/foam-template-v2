"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type React from "react";
import { useRouter } from "next/navigation";
import { Button } from "pakt-ui";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Spinner } from "@/components/common/loader";
import { useDeclineInvite, useAcceptInvite } from "@/lib/api/invites";

export interface TalentPrivateJobCtasProps {
	inviteId: string | null;
	hasBeenInvited: boolean;
	jobId: string;
	jobCreator: string;
}

export const TalentPrivateJobCtas: React.FC<TalentPrivateJobCtasProps> = ({
	inviteId,
	hasBeenInvited,
	// @ts-expect-error unused variable
	jobId,
	// @ts-expect-error unused variable
	jobCreator,
}) => {
	const router = useRouter();
	const acceptInvite = useAcceptInvite();
	const declineInvite = useDeclineInvite();

	if (inviteId == null || !hasBeenInvited) return null;

	return (
		<div className="mt-auto flex w-full items-center justify-end">
			<div className="flex w-full max-w-sm items-center gap-4">
				<Button
					fullWidth
					size="sm"
					variant="secondary"
					onClick={() => {
						declineInvite.mutate(
							{ id: inviteId },
							{
								onSuccess: () => {
									router.push("/overview");
								},
							},
						);
					}}
				>
					{declineInvite.isLoading ? <Spinner /> : "Decline"}
				</Button>

				<Button
					fullWidth
					size="sm"
					onClick={() => {
						acceptInvite.mutate(
							{ id: inviteId },
							{
								onSuccess: () => {
									router.push("/jobs?jobs-type=accepted");
								},
							},
						);
					}}
				>
					{acceptInvite.isLoading ? <Spinner /> : "Accept Invite"}
				</Button>
			</div>
		</div>
	);
};
