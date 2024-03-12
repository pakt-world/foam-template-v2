"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement, useState } from "react";
import { X, Briefcase, Star } from "lucide-react";
import Rating from "react-rating";
import { Button } from "pakt-ui";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { RenderBookMark } from "@/components/jobs/misc/render-bookmark";
import { AfroProfile } from "@/components/common/afro-profile";
import { ClientJobModal } from "@/components/jobs/home/created/client-card/modal";
import { SideModal } from "@/components/common/side-modal";
import { TalentJobModal } from "@/components/jobs/home/accepted/talent-card/modal";

const MAX_LEN = 150;

interface ReviewJobProps {
	id: string;
	title: string;
	description: string;
	talent: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
	};
	bookmarked: boolean;
	bookmarkId: string;
	jobId: string;
	creator: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
	};
	isCreator: boolean;
	rating?: number;
	close?: (id: string) => void;
}

export const JobReviewedFeed = ({
	id,
	jobId,
	talent,
	creator,
	title,
	description,
	bookmarked,
	bookmarkId,
	isCreator,
	rating,
	close,
}: ReviewJobProps): ReactElement => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	return (
		<div className="relative z-10 flex w-full gap-4 overflow-hidden rounded-2xl border border-[#9BDCFD] bg-[#F1FBFF] px-4 pl-2">
			<AfroProfile
				src={isCreator ? talent.avatar : creator.avatar}
				score={isCreator ? talent.score : creator.score}
				size="lg"
				url={`/talents/${isCreator ? talent._id : creator._id}`}
			/>
			<div className="flex w-full flex-col gap-4 py-4">
				<div className="flex justify-between">
					<h3 className="w-[90%] items-center text-xl text-title">
						{isCreator ? talent.name : creator.name} has reviewed
						your work on <span className="font-bold">{title}</span>
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
					{description.length > MAX_LEN
						? `${description.slice(0, MAX_LEN)}...`
						: description}
				</p>

				<div className="mt-auto flex items-center justify-between">
					<div className="flex items-center gap-2">
						{!isCreator && (
							<Button
								size="xs"
								variant="secondary"
								onClick={() => {
									setIsModalOpen(true);
								}}
							>
								Review
							</Button>
						)}
						{rating && (
							// @ts-expect-error -- Rating' cannot be used as a JSX component. Its type 'typeof Rating' is not a valid JSX element type.ts(2786)
							<Rating
								initialRating={rating}
								fullSymbol={
									<Star
										fill="#15D28E"
										color="#15D28E"
										className="mt-[4px]"
									/>
								}
								emptySymbol={
									<Star
										fill="transparent"
										color="#15D28E"
										className="mt-[4px]"
									/>
								}
								readonly
							/>
						)}
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
			<SideModal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
				{isCreator ? (
					<ClientJobModal
						jobId={jobId}
						talentId={talent._id}
						closeModal={() => {
							setIsModalOpen(false);
						}}
						extras={id}
					/>
				) : (
					<TalentJobModal
						jobId={jobId}
						talentId={talent._id}
						closeModal={() => {
							setIsModalOpen(false);
						}}
						extras={id}
					/>
				)}
			</SideModal>
		</div>
	);
};
