"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

interface JobDescriptionProps {
	description: string;
}

export const JobDescription = ({
	description,
}: JobDescriptionProps): ReactElement => {
	return (
		<div className="flex w-full flex-col gap-2">
			<h3 className="text-lg font-bold text-title">Job Description</h3>
			<p className="rounded-2xl border border-blue-200 bg-[#C9F0FF] p-4 text-lg font-normal text-[#202325]">
				{description}
			</p>
		</div>
	);
};
