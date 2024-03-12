"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React, { type FC, useState } from "react";
import Lottie from "lottie-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "pakt-ui";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Spinner } from "@/components/common/loader";
import { useApplyToOpenJob, useGetJobById } from "@/lib/api/job";
import success from "@/lottiefiles/success.json";
import { NumericInput } from "@/components/common/numeric-input";

const jobApplicationSchema = z.object({
	message: z.string().nonempty("Message is required"),
	amount: z.coerce
		.number()
		.min(100, { message: "Amount must be at least $100" })
		.nonnegative(),
});

type JobApplicationFormValues = z.infer<typeof jobApplicationSchema>;

interface TalentJobApplyModalProps {
	jobId: string;
	jobCreator: string;
}

export const TalentJobApplyModal: FC<TalentJobApplyModalProps> = ({
	jobId,
	jobCreator,
}) => {
	const jobQuery = useGetJobById({ jobId });
	const applyToOpenJob = useApplyToOpenJob({ jobCreator, jobId });
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);

	const form = useForm<JobApplicationFormValues>({
		resolver: zodResolver(jobApplicationSchema),
		defaultValues: {
			message: "",
		},
	});

	const onSubmit: SubmitHandler<JobApplicationFormValues> = ({
		amount,
		message = "",
	}) => {
		applyToOpenJob.mutate(
			{
				jobId,
				amount,
				message,
			},
			{
				onSuccess: () => {
					setShowSuccessMessage(true);
					void jobQuery.refetch();
				},
			},
		);
	};

	if (showSuccessMessage) {
		return (
			<div className="flex w-full max-w-xl flex-col gap-4 rounded-2xl border bg-white p-6">
				<div className="flex flex-col items-center gap-1">
					<div className="-mt-[4] max-w-[200px]">
						<Lottie animationData={success} loop={false} />
					</div>

					<h2 className="text-2xl font-medium">Application Sent</h2>
					<span className="text-body">
						You will get a notification if the client sends you a
						message
					</span>
				</div>
			</div>
		);
	}
	return (
		<div className="flex w-full max-w-xl flex-col gap-4 rounded-2xl border bg-white p-6">
			<div className="flex flex-col items-center gap-1">
				<h2 className="text-2xl font-medium">Propose Price</h2>
			</div>

			<form
				className="flex flex-col items-center gap-6"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<div className="flex w-full flex-col gap-2">
					<label htmlFor="due" className="text-title">
						Enter Bid
					</label>

					<div className="hover:duration-200h-[45px] flex items-center gap-2 rounded-lg border border-line bg-[#FCFCFD] px-4 py-3 outline-none focus-within:border-secondary hover:border-secondary">
						{/* <DollarIcon /> */}
						<span className="text-body ">$</span>
						<NumericInput
							type="text"
							{...form.register("amount")}
							placeholder="e.g 1000"
							className="h-full  bg-transparent text-sm text-body focus:outline-none"
						/>
					</div>

					{form.formState.errors.amount != null && (
						<span className="text-sm text-red-500">
							{form.formState.errors.amount.message}
						</span>
					)}
				</div>

				<div className="flex w-full flex-col gap-2">
					<label htmlFor="due" className="text-title">
						Message
					</label>
					<textarea
						rows={3}
						maxLength={150}
						id="due"
						{...form.register("message")}
						placeholder="Describe why you're a good candidate"
						className="w-full resize-none rounded-lg border border-line bg-[#FCFCFD] px-4 py-3 outline-none focus-within:border-secondary hover:border-secondary hover:duration-200"
					/>
					<div className="-mt-1 ml-auto w-fit text-sm text-body">
						{form.watch("message")?.length} / 150 characters
					</div>

					{form.formState.errors.message != null && (
						<span className="text-sm text-red-500">
							{form.formState.errors.message.message}
						</span>
					)}
				</div>

				<Button fullWidth>
					{applyToOpenJob.isLoading ? (
						<Spinner />
					) : (
						"Send Application"
					)}
				</Button>
			</form>
		</div>
	);
};
