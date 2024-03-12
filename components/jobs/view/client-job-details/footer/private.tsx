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

export interface ClientPrivateJobCtasProps {
	jobId: string;
	openDeleteModal: () => void;
	skills?: string[];
}

export const ClientPrivateJobCtas: React.FC<ClientPrivateJobCtasProps> = ({
	jobId,
	skills = [],
	openDeleteModal,
}) => {
	const router = useRouter();

	return (
		<div className="mt-auto flex w-full items-center justify-between gap-4">
			<div className="w-full max-w-[160px] rounded-xl border border-red-400">
				<Button
					fullWidth
					variant="danger"
					onClick={openDeleteModal}
					size="sm"
				>
					Delete Job
				</Button>
			</div>

			<div className="flex w-full max-w-sm items-center gap-2">
				<Button
					fullWidth
					variant="outline"
					onClick={() => {
						router.push(`/jobs/${jobId}/edit`);
					}}
				>
					Edit Job
				</Button>
				<Button
					fullWidth
					onClick={() => {
						router.push(
							`/talents${skills != null && skills?.length > 0 ? `?skills=${skills?.join(",")}` : ""}`,
						);
					}}
				>
					Find Talent
				</Button>
			</div>
		</div>
	);
};
