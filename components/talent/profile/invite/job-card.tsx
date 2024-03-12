"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { format } from "date-fns";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import type { Job } from "@/lib/types";
import { cn } from "@/lib/utils";

interface JobCardProps {
	job: Job;
	isSelected: boolean;
	setJobId: (jobId: string) => void;
}

export const JobCard = ({
	job,
	setJobId,
	isSelected,
}: JobCardProps): ReactElement | null => {
	return (
		<div
			className={cn(
				"flex cursor-pointer flex-col gap-2 rounded-xl border border-gray-200 p-3 duration-200 hover:bg-green-50",
				{
					"border-green-400 bg-green-50 shadow-md": isSelected,
				},
			)}
			onClick={() => {
				setJobId(job._id);
			}}
			onKeyDown={(event) => {
				// 'Enter' or 'Space' key
				if (event.key === "Enter" || event.key === " ") {
					setJobId(job._id);
				}
			}}
			role="button"
			tabIndex={0}
		>
			<div className="flex w-full items-center justify-between">
				<span className="text-base font-medium text-body">
					Created {format(new Date(job.createdAt), "dd MMM yyyy")}
				</span>
				<span className="inline-flex rounded-full bg-[#B2E9AA66] px-3 text-base text-title">
					${job.paymentFee}
				</span>
			</div>
			<div className="grow text-xl text-title">{job.name}</div>
			<div className="flex items-center gap-2">
				{job.tags.slice(0, 3).map(({ color, name }) => (
					<span
						key={name}
						className="rounded-full bg-slate-100 px-4 py-0.5 capitalize"
						style={{ backgroundColor: color }}
					>
						{name}
					</span>
				))}
			</div>
		</div>
	);
};
