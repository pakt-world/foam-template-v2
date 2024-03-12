"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React from "react";
import { Button } from "pakt-ui";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Modal } from "@/components/common/headless-modal";
import { TalentPrivateJobCtas } from "./private";
import { TalentJobApplyModal } from "../modal/apply";

export interface TalentOpenJobCtasProps {
	jobId: string;
	jobCreator: string;
	inviteId: string | null;
	hasAlreadyApplied: boolean;
	hasBeenInvited: boolean;
}

export const TalentOpenJobCtas: React.FC<TalentOpenJobCtasProps> = ({
	jobId,
	jobCreator,
	hasBeenInvited,
	inviteId,
	hasAlreadyApplied,
}) => {
	const [isApplyModalOpen, setIsApplyModalOpen] = React.useState(false);
	if (hasBeenInvited)
		return (
			<TalentPrivateJobCtas
				inviteId={inviteId}
				hasBeenInvited={hasBeenInvited}
				jobId={jobId}
				jobCreator={jobCreator}
			/>
		);

	return (
		<div className="ml-auto w-full max-w-[200px]">
			{!hasAlreadyApplied && (
				<Button
					fullWidth
					onClick={() => {
						setIsApplyModalOpen(true);
					}}
				>
					Apply
				</Button>
			)}

			<Modal
				isOpen={isApplyModalOpen}
				closeModal={() => {
					setIsApplyModalOpen(false);
				}}
			>
				<TalentJobApplyModal jobId={jobId} jobCreator={jobCreator} />
			</Modal>
		</div>
	);
};
