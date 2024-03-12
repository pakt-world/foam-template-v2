"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { type UseFormReturn } from "react-hook-form";
import type * as z from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type createJobSchema } from "@/lib/validations";

type FormValues = z.infer<typeof createJobSchema>;

interface JobTitleProps {
	form: UseFormReturn<FormValues>;
}

const JobTitle = ({ form }: JobTitleProps): ReactElement => {
	return (
		<div className="relative">
			<input
				type="text"
				// autoFocus
				maxLength={60}
				{...form.register("title")}
				placeholder="Enter Job Title"
				className="w-full bg-transparent text-3xl text-white caret-white placeholder:text-white placeholder:text-opacity-60 focus:outline-none"
			/>
			<div className="ml-auto text-right text-sm text-white">
				{form.watch("title")?.length}/ 60
			</div>
			<span className="absolute -bottom-5 flex w-full">
				{form.formState.errors.title?.message != null && (
					<span className="text-sm text-red-200">
						{form.formState.errors.title?.message}!
					</span>
				)}
			</span>
		</div>
	);
};

export default JobTitle;
