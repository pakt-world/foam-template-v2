"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "pakt-ui";
import { X, Clock4 } from "lucide-react";
import Link from "next/link";
import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { RenderBookMark } from "@/components/jobs/misc/render-bookmark";
import { AfroProfile } from "@/components/common/afro-profile";
import { JobFeedWrapper } from "./wrapper";

interface JobInvitePendingProps {
	id: string;
	jobId: string;
	title: string;
	inviteId: string;
	amount: string;
	inviter: {
		_id: string;
		name: string;
		avatar?: string;
		score: number;
	};
	imageUrl?: string;
	invitationExpiry?: string;
	bookmarked?: boolean;
	bookmarkId: string;
	type: "job-invite-pending";
	close?: (id: string) => void;
}

interface JobFilledProps {
	id: string;
	title: string;
	inviter: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
	};
	bookmarked: boolean;
	bookmarkId: string;
	type: "job-invite-filled";
	imageUrl?: string;
	close?: (id: string) => void;
}

interface JobResponseProps {
	id: string;
	title: string;
	jobId: string;
	talent: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
	};
	bookmarkId: string;
	bookmarked: boolean;
	accepted: boolean;
	cancelled: boolean;
	type: "job-invite-response";
	imageUrl?: string;
	close?: (id: string) => void;
}

type JobFeedCardProps =
	| JobInvitePendingProps
	| JobFilledProps
	| JobResponseProps;

export const JobFeedCard = (props: JobFeedCardProps): ReactElement => {
	const { type } = props;

	if (type === "job-invite-filled") {
		const { id, title, bookmarked, bookmarkId, inviter, close } = props;

		return (
			<JobFeedWrapper>
				<AfroProfile
					src={inviter.avatar}
					score={inviter.score}
					size="lg"
					url={`/talents/${inviter._id}`}
				/>
				<div className="flex w-full flex-col gap-4 py-4">
					<div className="flex items-center justify-between">
						<h3 className="text-xl font-bold text-title">
							Job Filled
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
						The{" "}
						<span className="text-bold text-title">
							&quot;{title}&quot;
						</span>{" "}
						Job you applied to has been filled. You can check out
						more public jobs that fit your profile
					</p>

					<div className="mt-auto flex items-center justify-between">
						<Link href="/jobs">
							<Button size="xs" variant="secondary">
								See More Jobs
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
	}

	if (type === "job-invite-pending") {
		const {
			id,
			title,
			amount,
			inviter,
			bookmarked,
			invitationExpiry,
			inviteId,
			jobId,
			bookmarkId,
			close,
		} = props;
		return (
			<JobFeedWrapper>
				<AfroProfile
					src={inviter.avatar}
					score={inviter.score}
					size="lg"
					url={`/talents/${inviter._id}`}
				/>
				<div className="flex w-full flex-col gap-4 py-4">
					<div className="flex items-center justify-between">
						<span className="text-xl font-bold text-body">
							{inviter.name} Invited you to a{" "}
							<span className="inline-flex rounded-full bg-[#B2E9AA66] px-2 text-lg text-title">
								${amount}
							</span>{" "}
							job
						</span>

						<div className="flex items-center gap-2">
							{invitationExpiry && (
								<div className="flex items-center gap-1 text-sm text-body">
									<Clock4 size={20} />
									<span>Time left: 1:48:00</span>
								</div>
							)}
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
					</div>

					<span className="text-2xl font-normal text-title">
						{title}
					</span>

					<div className="mt-auto flex items-center justify-between">
						<Link
							href={`/jobs/${jobId}?invite-id=${inviteId}`}
							className="flex items-center gap-2"
						>
							<Button size="xs" variant="secondary">
								See Details
							</Button>
						</Link>

						<RenderBookMark
							size={20}
							isBookmarked={bookmarked}
							id={id}
							type="feed"
							bookmarkId={String(bookmarkId)}
						/>
					</div>
				</div>
			</JobFeedWrapper>
		);
	}

	if (type === "job-invite-response") {
		const {
			id,
			title,
			bookmarked,
			bookmarkId,
			talent,
			jobId,
			close,
			accepted,
			cancelled,
		} = props;
		return (
			<JobFeedWrapper>
				<AfroProfile
					src={talent.avatar}
					score={talent.score}
					size="lg"
					url={`/talents/${talent._id}`}
				/>

				<div className="flex w-full flex-col gap-4 py-4">
					<div className="flex items-center justify-between">
						<h3 className="text-xl font-bold text-title">
							Job Invitation{" "}
							{cancelled
								? "cancelled"
								: accepted
									? "Accepted"
									: "Declined"}
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
						{talent.name} has{" "}
						{cancelled
							? "cancelled"
							: accepted
								? "Accepted"
								: "Declined"}{" "}
						<span className="text-bold text-title">
							&quot;{title}&quot;
						</span>{" "}
						Job. You can check job here
					</p>

					<div className="mt-auto flex items-center justify-between">
						<Link href={`/jobs/${jobId}`}>
							<Button size="xs" variant="secondary">
								See Update
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
	}

	return <div />;
};
