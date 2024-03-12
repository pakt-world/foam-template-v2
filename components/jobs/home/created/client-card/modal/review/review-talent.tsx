"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState, type FC } from "react";
import { ChevronLeft, Star } from "lucide-react";
import { Button } from "pakt-ui";
import Rating from "react-rating";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useCreateJobReview } from "@/lib/api/job";
import { Spinner } from "@/components/common";
import { type Job, isReviewChangeRequest } from "@/lib/types";
import { AfroProfile } from "@/components/common/afro-profile";
import { ReviewChangeRequested } from "./review-change-requested";
import { ReviewSuccess } from "./review-success";

interface ReviewTalentProps {
	job: Job;
	closeModal: () => void;
}

const MAX_COMMENT_LENGTH = 150;

export const ReviewTalent: FC<ReviewTalentProps> = ({ job, closeModal }) => {
	const mutation = useCreateJobReview();
	const { description, name, _id, owner } = job;
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");

	const reviewChangeRequest = job.collections.find(isReviewChangeRequest);

	const reviewChangeRequestPending =
		reviewChangeRequest?.status === "pending";
	const clientHasReviewed = job.ratings?.some(
		(review) => review.owner._id === job.creator._id,
	);

	if (reviewChangeRequestPending) {
		return <ReviewChangeRequested job={job} closeModal={closeModal} />;
	}

	if (clientHasReviewed) {
		return <ReviewSuccess closeModal={closeModal} />;
	}

	return (
		<>
			<div className="bg-primary-gradient px-4 py-6 text-2xl font-bold text-white">
				<div className="flex items-center gap-2">
					<button
						onClick={closeModal}
						type="button"
						aria-label="Back"
					>
						<ChevronLeft />
					</button>
					<span>Review</span>
				</div>
			</div>

			<div className="flex h-full flex-col gap-6 px-4 py-4">
				<div className="flex flex-col gap-1">
					<h3 className="text-lg font-medium">Job Description</h3>
					<div className="flex flex-col gap-1 rounded-xl border border-blue-300 bg-[#C9F0FF] p-3">
						<h3 className="text-base font-medium text-title">
							{name}
						</h3>

						<p className="text-sm">{description}</p>
					</div>
				</div>

				<div className="rounded-xl border bg-gray-50 p-3">
					<h3 className="text-lg">How was your experience with</h3>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<AfroProfile
								score={owner?.score ?? 0}
								size="md"
								src={owner?.profileImage?.url}
								url={`/talents/${owner?._id}`}
							/>

							<div className="flex flex-col gap-1">
								<span className="text-base font-medium leading-none text-title">{`${owner?.firstName} ${owner?.lastName}`}</span>
								<span className="text-sm capitalize leading-none">
									{owner?.profile.bio.title}
								</span>
							</div>
						</div>

						<div>
							{/* @ts-expect-error --- */}
							<Rating
								initialRating={rating}
								onChange={(value) => {
									setRating(value);
								}}
								fullSymbol={
									<Star fill="#15D28E" color="#15D28E" />
								}
								emptySymbol={
									<Star fill="transparent" color="#15D28E" />
								}
							/>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-1 rounded-xl border bg-gray-50 p-3">
					<h3>Comment</h3>
					<div>
						<textarea
							rows={3}
							value={comment}
							onChange={(e) => {
								if (
									e.target.value.length <= MAX_COMMENT_LENGTH
								) {
									setComment(e.target.value);
								}
							}}
							placeholder="Write your comment..."
							className="w-full grow resize-none rounded-lg border border-line bg-white p-2 placeholder:text-sm focus:outline-none"
						/>
						<div className="ml-auto w-fit">
							<span className="text-sm text-body">
								{comment.length}
							</span>
							<span className="text-sm text-body">/</span>
							<span className="text-sm text-body">
								{MAX_COMMENT_LENGTH}
							</span>
						</div>
					</div>
				</div>

				<div className="mt-auto">
					<Button
						fullWidth
						onClick={() => {
							mutation.mutate(
								{
									rating,
									jobId: _id,
									review: comment,
									recipientId: owner?._id ?? "",
								},
								{
									onSuccess: () => {},
								},
							);
						}}
					>
						{mutation.isLoading ? (
							<Spinner size={20} />
						) : (
							"Submit Review"
						)}
					</Button>
				</div>
			</div>
		</>
	);
};
