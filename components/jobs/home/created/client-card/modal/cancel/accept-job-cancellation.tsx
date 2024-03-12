"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState, type FC } from "react";
import { Button, Slider } from "pakt-ui";
import { ChevronLeft, Star } from "lucide-react";
import Rating from "react-rating";
import Image from "next/image";
import type { Job, UserProfile } from "@/lib/types";
import { isJobDeliverable } from "@/lib/types";
import { Spinner } from "@/components/common";
import { DeliverableProgressBar } from "@/components/common/deliverable-progress-bar";
import { useAcceptJobCancellation } from "@/lib/api/job";
import { AfroScore } from "@/components/common/afro-profile";
import { DefaultAvatar } from "@/components/common/default-avatar";

const MAX_REVIEW_LENGTH = 500;

interface AcceptJobCancellationProps {
	job: Job;
	talent?: UserProfile;
	setAcceptCancellation: (value: boolean) => void;
}

export const AcceptJobCancellation: FC<AcceptJobCancellationProps> = ({
	setAcceptCancellation,
	talent,
	job,
}) => {
	const cancelJobMutation = useAcceptJobCancellation();

	const totalDeliverables = job.collections.filter(isJobDeliverable).length;
	const completedDeliverables = job.collections
		.filter(isJobDeliverable)
		.filter((deliverable) => deliverable.progress === 100).length;

	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");
	const [percentageToPay, setPercentageToPay] = useState(
		Math.floor((completedDeliverables / totalDeliverables) * 100),
	);

	const amountToPay = (percentageToPay / 100) * job.paymentFee;

	return (
		<>
			<div className="flex items-center justify-between bg-gradient-to-r from-danger via-red-500 to-red-400 px-4 py-6 text-3xl font-bold text-white">
				<div className="flex items-center gap-2">
					<button
						onClick={() => {
							setAcceptCancellation(false);
						}}
						type="button"
						aria-label="Back"
					>
						<ChevronLeft />
					</button>
					<span>Cancel Job</span>
				</div>
			</div>

			<div className="flex h-full grow flex-col gap-10 px-4 py-6">
				<DeliverableProgressBar
					totalDeliverables={totalDeliverables}
					className="max-w-none text-base"
					percentageProgress={Math.floor(
						(completedDeliverables / totalDeliverables) * 100,
					)}
				/>

				<div className="flex flex-col gap-1">
					<p className="text-title">
						Proposed Job Price: ${job.paymentFee}
					</p>

					<div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-slate-50 p-3">
						<p className="flex items-center gap-2 text-body">
							<span>Amount to pay the Talent:</span>{" "}
							<span className="font-bold text-green-600">
								${Math.floor(amountToPay)}
							</span>
							<span className="text-sm">
								({percentageToPay}%)
							</span>
						</p>
						<div className="my-2">
							<Slider
								value={[percentageToPay]}
								onValueChange={(value) => {
									setPercentageToPay(value[0] ?? 0);
								}}
								min={0}
								max={100}
							/>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-1">
					<span className="text-title">
						How was your experience with {talent?.firstName}?
					</span>
					<div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-slate-50 p-3">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<AfroScore score={talent?.score ?? 0} size="sm">
									<div className="relative h-full w-full rounded-full">
										{talent?.profileImage?.url ? (
											<Image
												src={talent?.profileImage?.url}
												fill
												alt="profile"
												className="rounded-full"
											/>
										) : (
											<DefaultAvatar />
										)}
									</div>
								</AfroScore>

								<div className="flex flex-col gap-1">
									<span className="text-base font-medium leading-none text-title">{`${talent?.firstName} ${talent?.lastName}`}</span>
									<span className="text-sm capitalize leading-none">
										{talent?.profile.bio.title}
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
										<Star
											fill="transparent"
											color="#15D28E"
										/>
									}
								/>
							</div>
						</div>
					</div>
				</div>

				<div>
					<h3>Comment</h3>
					<div>
						<textarea
							rows={5}
							value={comment}
							onChange={(e) => {
								if (
									e.target.value.length <= MAX_REVIEW_LENGTH
								) {
									setComment(e.target.value);
								}
							}}
							placeholder="Write your comment..."
							className="w-full grow resize-none rounded-lg border border-line bg-gray-50 p-2 placeholder:text-sm focus:outline-none"
						/>
						<div className="ml-auto w-fit">
							<span className="text-sm text-body">
								{comment.length}
							</span>
							<span className="text-sm text-body">/</span>
							<span className="text-sm text-body">
								{MAX_REVIEW_LENGTH}
							</span>
						</div>
					</div>
				</div>

				<div className="mt-auto">
					<Button
						fullWidth
						variant="primary"
						disabled={
							cancelJobMutation.isLoading ||
							comment.length === 0 ||
							rating === 0
						}
						onClick={() => {
							cancelJobMutation.mutate({
								rating,
								jobId: job._id,
								review: comment,
								amount: Math.floor(amountToPay),
								recipientId: talent?._id ?? "",
							});
						}}
					>
						{cancelJobMutation.isLoading ? (
							<Spinner size={20} />
						) : (
							"Accept Cancellation"
						)}
					</Button>
				</div>
			</div>
		</>
	);
};
