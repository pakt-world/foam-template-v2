"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

interface DeliverablesProps {
	deliverables: string[];
}

export const JobDeliverables = ({
	deliverables,
}: DeliverablesProps): ReactElement => {
	return (
		<div className="flex h-full w-full flex-col gap-2 rounded-2xl bg-white py-4">
			<h3 className="text-lg font-bold text-title">Deliverables</h3>

			<div className="flex h-full flex-col gap-4 overflow-y-auto">
				{deliverables.map((deliverable, index) => (
					<div
						key={index}
						className="rounded-md bg-[#F7F9FA] p-4 text-[#090A0A]"
					>
						{deliverable}
					</div>
				))}
			</div>
		</div>
	);
};
