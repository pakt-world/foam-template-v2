"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "pakt-ui";
import { X } from "lucide-react";
import Link from "next/link";
import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { RenderBookMark } from "@/components/jobs/misc/render-bookmark";
import { AfroProfile } from "@/components/common/afro-profile";
import { JobFeedWrapper } from "./wrapper";

interface JobApplicationCardProps {
	id: string;
	title: string;
	applicant: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
	};
	bookmarked: boolean;
	bookmarkId: string;
	jobId: string;
	close?: (id: string) => void;
}

export const JobApplicationCard = (
	props: JobApplicationCardProps,
): ReactElement => {
	const { id, title, jobId, bookmarked, bookmarkId, applicant, close } =
		props;

	return (
		<JobFeedWrapper>
			<AfroProfile
				src={applicant.avatar}
				score={applicant.score}
				size="lg"
				url={`/talents/${applicant._id}`}
			/>
			<div className="flex w-full flex-col gap-4 py-4">
				<div className="flex items-center justify-between">
					<h3 className="text-xl font-bold text-title">
						New Job Application
					</h3>
					{close && (
						<X
							size={20}
							className="cursor-pointer"
							onClick={() => {
								close(id);
							}}
						/>
					)}
				</div>

				<p className="text-body">
					You Have Received a new job application for{" "}
					<span className="text-bold text-title">
						&quot;{title}&quot;
					</span>{" "}
					from {applicant.name}
				</p>

				<div className="mt-auto flex items-center justify-between">
					<Link href={`/jobs/${jobId}/applicants`}>
						<Button size="xs" variant="secondary">
							View Applicants
						</Button>
					</Link>
					<RenderBookMark
						size={20}
						isBookmarked={bookmarked}
						type="feed"
						id={id}
						bookmarkId={bookmarkId}
					/>
				</div>
			</div>
		</JobFeedWrapper>
	);
};
