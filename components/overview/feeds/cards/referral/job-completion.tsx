"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { Button } from "pakt-ui";
import { X, Briefcase, Star } from "lucide-react";
import Rating from "react-rating";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { RenderBookMark } from "@/components/jobs/misc/render-bookmark";
import { AfroProfile } from "@/components/common/afro-profile";

interface ReferralJobCompletionProps {
	id: string;
	title: string;
	talent: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
	};
	bookmarked: boolean;
	bookmarkId: string;
	rating: number;
	jobId: string;
	close?: (id: string) => void;
}
export const ReferralJobCompletion = ({
	id,
	// @ts-expect-error --- Unused variable
	jobId,
	talent,
	title,
	bookmarked,
	bookmarkId,
	rating,
	close,
}: ReferralJobCompletionProps): ReactElement => {
	return (
		<div className="relative z-10 flex w-full gap-4 overflow-hidden  rounded-2xl border border-[#CDCFD0] bg-[#F9F9F9] p-4">
			<AfroProfile
				src={talent.avatar}
				score={talent.score}
				size="lg"
				url={`/talents/${talent._id}`}
			/>
			<div className="flex w-full flex-col gap-4">
				<div className="flex items-center justify-between">
					<h3 className="text-xl font-bold text-title">
						{talent.name} a{" "}
						{
							// @ts-expect-error --- 'Rating' cannot be used as a JSX component. Its type 'typeof Rating' is not a valid JSX element type.
							<Rating
								readonly
								initialRating={rating || 0}
								fullSymbol={
									<Star fill="#15D28E" color="#15D28E" />
								}
								emptySymbol={
									<Star fill="transparent" color="#15D28E" />
								}
							/>
						}{" "}
						completed a job
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
				<p className="text-3xl text-body">{title}</p>

				<div className="mt-auto flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Button size="xs" variant="outline">
							See Review
						</Button>
					</div>
					<RenderBookMark
						size={20}
						isBookmarked={bookmarked}
						type="feed"
						id={id}
						bookmarkId={bookmarkId}
					/>
				</div>
			</div>

			<div className="absolute right-0 top-16 -z-[1] translate-x-1/3">
				<Briefcase size={200} color="#F2F4F5" />
			</div>
		</div>
	);
};
