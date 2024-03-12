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

export const PublicJobCreatedFeed = ({
	creator,
	title,
	amount,
	jobId,
	_id,
	bookmark,
	callback,
	close,
}: {
	creator: { _id: string; name: string; avatar: string; score: number };
	title: string;
	amount: string;
	jobId: string;
	_id: string;
	bookmark: { active: boolean; id: string };
	callback?: () => void;
	close?: (id: string) => void;
}): ReactElement => {
	return (
		<div className="relative z-10 flex w-full gap-4 overflow-hidden rounded-2xl border border-[#CDCFD0] bg-[#F9F9F9] px-4 pl-2">
			<AfroProfile
				score={creator.score}
				src={creator.avatar}
				size="lg"
				url={`/talents/${creator._id}`}
			/>
			<div className="flex w-full flex-col gap-4 py-4">
				<div className="flex items-center justify-between">
					<h3 className="text-xl font-bold text-body">
						{creator.name} created a{" "}
						<span className="inline-flex rounded-full bg-green-300 px-2 text-lg text-title">
							${amount ?? 0}
						</span>{" "}
						public job
					</h3>
					{close && (
						<X
							size={20}
							className="cursor-pointer"
							onClick={() => {
								close(_id);
							}}
						/>
					)}
				</div>
				<h3 className="text-2xl font-normal text-title">{title}</h3>
				<div className="mt-auto flex items-center justify-between">
					<Link
						href={`/jobs/${jobId}`}
						className="flex items-center gap-2"
					>
						<Button size="xs" variant="secondary">
							See Details
						</Button>
					</Link>
					<RenderBookMark
						size={20}
						isBookmarked={bookmark.active}
						type="feed"
						id={_id}
						bookmarkId={bookmark.id}
						callback={callback}
					/>
				</div>
			</div>
		</div>
	);
};
