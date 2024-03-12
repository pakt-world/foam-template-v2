"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState, type FC } from "react";
import { Button } from "pakt-ui";
import { ChevronLeft, Star } from "lucide-react";
import Rating from "react-rating";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useCreateJobReview, useReleaseJobPayment } from "@/lib/api/job";
import { Spinner } from "@/components/common";
import { type Job, isReviewChangeRequest } from "@/lib/types";
import { AfroProfile } from "@/components/common/afro-profile";
import { RequestJobChangeSuccess } from "./request-job-change-success";
import { RequestReviewChange } from "./request-review-change";

interface ReviewClientProps {
	job: Job;
	closeModal: () => void;
}

const MAX_COMMENT_LENGTH = 150;

export const ReviewClient: FC<ReviewClientProps> = ({ job, closeModal }) => {
	const router = useRouter();
	const [requestReviewChange, setRequestReviewChange] = useState(false);

	const mutation = useCreateJobReview();
	const releasePaymentMutation = useReleaseJobPayment();
	const { _id: jobId, creator, owner } = job;
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");

	const clientReview = job.ratings?.find(
		(review) => review.owner._id === job.creator._id,
	);

	const reviewChangeRequest = job.collections.find(isReviewChangeRequest);
	const reviewChangeRequestCompleted =
		reviewChangeRequest?.status === "completed";
	const [reviewChangeRequestPending, setReviewChangeRequestPending] =
		useState(reviewChangeRequest?.status === "pending");

	if (reviewChangeRequestPending) {
		return <RequestJobChangeSuccess closeModal={closeModal} />;
	}

	if (requestReviewChange) {
		return (
			<RequestReviewChange
				job={job}
				setRequestReviewChange={setRequestReviewChange}
				setReviewChangeRequestPending={setReviewChangeRequestPending}
				jobId={jobId}
				recipientId={String(creator?._id)}
			/>
		);
	}

	return (
		<>
			<div className="bg-primary-gradient px-4 py-6 text-2xl font-bold text-white">
				<div className="flex items-center gap-2">
					<button
						onClick={closeModal}
						aria-label="Back"
						type="button"
					>
						<ChevronLeft />
					</button>
					<span>Review</span>
				</div>
			</div>

			<div className="flex h-full flex-col gap-6 px-4 py-4">
				{clientReview &&
					clientReview.rating < 5 &&
					!reviewChangeRequestCompleted && (
						<div className="xborder-line flex flex-col gap-3 rounded-xl border border-[#7DDE86] bg-[#FBFFFA] p-3">
							<div className="flex items-center justify-between">
								<span>
									{clientReview.owner.firstName}{" "}
									{clientReview.owner.lastName}&apos; Review
								</span>
								{/* @ts-expect-error --- Types Error */}
								<Rating
									readonly
									initialRating={clientReview.rating || 0}
									fullSymbol={
										<Star fill="#15D28E" color="#15D28E" />
									}
									emptySymbol={
										<Star
											fill="transparent"
											color="#15D28E"
										/>
									}
								/>
							</div>
							<p className="text-body">{clientReview.review}</p>
							<Button
								fullWidth
								size="xs"
								variant="secondary"
								onClick={() => {
									setRequestReviewChange(true);
								}}
							>
								Request opportunity to improve
							</Button>
						</div>
					)}

				<div className="rounded-xl border bg-gray-50 p-3">
					<h3 className="text-lg">How was your experience with</h3>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<AfroProfile
								score={creator?.score || 0}
								size="md"
								src={creator?.profileImage?.url}
								url={`/talents/${creator?._id}`}
							/>

							<div className="flex flex-col gap-1">
								<span className="text-base font-medium leading-none text-title">{`${creator?.firstName} ${creator?.lastName}`}</span>
								<span className="text-sm capitalize leading-none">
									{creator?.profile.bio.title}
								</span>
							</div>
						</div>

						<div>
							{/* @ts-expect-error --- Types Error */}
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
								{MAX_COMMENT_LENGTH} characters
							</span>
						</div>
					</div>
				</div>

				<div className="mt-auto">
					<Button
						fullWidth
						disabled={
							mutation.isLoading ||
							rating === 0 ||
							comment.length === 0
						}
						onClick={() => {
							mutation.mutate(
								{
									rating,
									jobId,
									review: comment,
									recipientId: creator?._id ?? "",
								},
								{
									onSuccess: () => {
										releasePaymentMutation.mutate({
											jobId,
											owner: owner?._id,
										});
										router.push("/wallet");
									},
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
