"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "pakt-ui";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import type { Job } from "@/lib/types";
import { PageEmpty } from "@/components/common/page-empty";
import { JobCard } from "./job-card";

interface JobListProps {
	jobs: Job[];
	talentId: string;
}

export const JobList = ({
	jobs,
	talentId,
}: JobListProps): ReactElement | null => {
	const router = useRouter();
	const [jobId, setJobId] = useState<string | null>(null);

	if (jobs.length === 0)
		return <PageEmpty label="Your Created Jobs Will Appear Here" />;

	return (
		<div className="flex h-full flex-col gap-2 ">
			<div className="bg-primary-gradient p-4 text-white">
				<div className="flex items-center gap-2">
					<ChevronLeft size={24} strokeWidth={2} />
					<h2 className="text-2xl font-bold">Invite Talent</h2>
				</div>
			</div>
			<div className="px-4 py-1">
				<p className="text-xl font-bold">Select job</p>
			</div>
			<div className="flex grow flex-col gap-4 overflow-y-auto px-4">
				{jobs.map((job) => {
					return (
						<JobCard
							job={job}
							key={job._id}
							isSelected={jobId === job._id}
							setJobId={setJobId}
						/>
					);
				})}
			</div>
			<div className="px-4 py-4">
				<Button
					fullWidth
					variant="primary"
					size="md"
					disabled={!jobId}
					onClick={() => {
						if (!jobId) return;
						router.push(
							`/jobs/${jobId}/edit/?talent-id=${talentId}`,
						);
					}}
				>
					Continue
				</Button>
			</div>
		</div>
	);
};
