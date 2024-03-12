"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { format } from "date-fns";
import { Calendar, Tag } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { AfroProfile } from "@/components/common/afro-profile";

interface JobHeaderProps {
	title: string;
	price: number;
	dueDate: string;
	creator?: {
		_id: string;
		name: string;
		score: number;
		avatar?: string;
	};
}

export const JobHeader = ({
	title,
	price,
	dueDate,
	creator,
}: JobHeaderProps): ReactElement => {
	// Handle due date error
	const dueDateError = new Date(dueDate).toString() === "Invalid Date";
	const dueDateValue = dueDateError ? new Date() : new Date(dueDate);
	return (
		<div className="flex items-center justify-between gap-4 rounded-t-xl bg-primary-gradient p-4">
			<div className="flex h-full w-full max-w-2xl flex-col gap-6">
				<div className="grow pt-3">
					<h2 className="text-3xl font-medium text-white">{title}</h2>
				</div>
				<div className="mt-auto flex items-center gap-4">
					<span className="flex items-center gap-2 rounded-full bg-[#ECFCE5] px-3 py-1 text-[#198155]">
						<Tag size={20} />
						<span>$ {price}</span>
					</span>

					<span className="flex items-center gap-2 rounded-full bg-[#C9F0FF] px-3 py-1 text-[#0065D0]">
						<Calendar size={20} />
						<span>Due {format(dueDateValue, "MMM dd, yyyy")}</span>
					</span>
				</div>
			</div>
			{creator?._id && (
				<div className="flex flex-col items-center gap-0 text-center">
					<AfroProfile
						src={creator.avatar}
						size="2md"
						score={creator.score}
						url={`/talents/${creator._id}`}
					/>
					<span className="whitespace-nowrap text-xl font-bold text-white">
						{creator.name}
					</span>
				</div>
			)}
		</div>
	);
};
