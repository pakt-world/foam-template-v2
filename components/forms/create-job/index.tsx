"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { useRouter } from "next/navigation";
import { Button } from "pakt-ui";
import { format } from "date-fns";
import type * as z from "zod";
import { type SubmitHandler, type UseFormReturn } from "react-hook-form";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useCreateJob } from "@/lib/api/job";
import { Spinner } from "@/components/common";
import { type createJobSchema } from "@/lib/validations";
import JobDescription from "./job-description";
import JobDeliverables from "./job-deliverables";
import JobVisibility from "./job-visibility";
import JobCategory from "./job-category";
import PreferredSkills from "./preferred-skills";
import JobTitle from "./job-title";
import JobDueDate from "./job-due-date";
import JobProposedPrice from "./job-proposed-price";

type FormValues = z.infer<typeof createJobSchema>;

interface CreateJobFormProps {
	form: UseFormReturn<FormValues>;
}

const CreateJobForm = ({ form }: CreateJobFormProps): ReactElement => {
	const router = useRouter();
	const createJob = useCreateJob();

	const onSubmit: SubmitHandler<FormValues> = ({
		budget,
		category,
		deliverables,
		description,
		due,
		firstSkill,

		title,
		visibility,
		secondSkill,
		thirdSkill,
	}) => {
		createJob.mutate(
			{
				name: title,
				tags: [firstSkill, secondSkill, thirdSkill].filter(Boolean),
				category,
				description,
				deliverables,
				paymentFee: Number(budget),
				isPrivate: visibility === "private",
				deliveryDate: format(due, "yyyy-MM-dd"),
			},
			{
				onSuccess: ({ _id }) => {
					router.push(`/jobs/${_id}`);
				},
			},
		);
	};

	return (
		// eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
		<form
			onSubmit={form.handleSubmit(onSubmit)}
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					e.preventDefault();
				}
			}}
			className="flex h-fit grow flex-col rounded-2xl border bg-white"
		>
			<div className="flex flex-col gap-10 rounded-t-2xl bg-primary-gradient p-6 pb-8">
				<JobTitle form={form} />

				<div className="flex max-w-lg gap-4">
					<JobProposedPrice form={form} />
					<JobDueDate form={form} />
				</div>
			</div>
			<div className="flex grow flex-col gap-6 p-6">
				<PreferredSkills form={form} />
				<JobDescription form={form} />
				<JobDeliverables form={form} />
				<div className="flex flex-col gap-4">
					<h3 className="text-lg font-medium text-black">
						Classifications
					</h3>
					<div className="flex items-center gap-4">
						<JobCategory form={form} />
						<JobVisibility form={form} />

						<div className="ml-auto mt-auto w-full max-w-[250px] rounded-xl border border-gray-300">
							<Button
								disabled={
									createJob.isLoading ||
									!form.formState.isValid
								}
								fullWidth
							>
								{createJob.isLoading ? (
									<Spinner />
								) : form.watch("visibility") === "private" ? (
									"Post Job"
								) : (
									"Post Job"
								)}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</form>
	);
};

export default CreateJobForm;
