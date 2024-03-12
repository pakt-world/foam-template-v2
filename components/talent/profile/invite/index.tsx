"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useGetJobs } from "@/lib/api/job";
import { SideModal } from "@/components/common/side-modal";
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import { JobList } from "./job-list";

const InviteTalent = ({
	talentId,
}: {
	talentId: string;
}): ReactElement | null => {
	const jobsData = useGetJobs({ category: "created" });

	if (jobsData.isError) return <PageError />;

	if (jobsData.isLoading) return <PageLoading color="#007C5B" />;

	const jobs = jobsData.data.data;
	const sortedJobs = jobs.sort((a, b) => {
		return (
			new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		);
	});
	const unassignedJobs = sortedJobs
		.filter(
			(job) =>
				job.status === "pending" ||
				(job.status === "ongoing" && !job.inviteAccepted),
		)
		.filter((job) => !job.invite);

	return <JobList jobs={unassignedJobs} talentId={talentId} />;
};

interface Props {
	isOpen: boolean;
	talentId: string;
	setIsOpen: (isOpen: boolean) => void;
}

export const InviteTalentModal = ({
	isOpen,
	setIsOpen,
	talentId,
}: Props): ReactElement | null => {
	return (
		<SideModal
			isOpen={isOpen}
			onOpenChange={() => {
				setIsOpen(false);
			}}
		>
			<InviteTalent talentId={talentId} />
		</SideModal>
	);
};
