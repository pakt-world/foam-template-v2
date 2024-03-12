"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import type * as z from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type createJobSchema } from "@/lib/validations";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/common/select";

const CATEGORY_OPTIONS = [
	{ label: "Design", value: "design" },
	{ label: "Engineering", value: "engineering" },
	{ label: "Product", value: "product" },
	{ label: "Marketing", value: "marketing" },
	{ label: "Copywriting", value: "copywriting" },
	{ label: "Others", value: "others" },
];

type FormValues = z.infer<typeof createJobSchema>;

interface JobDescriptionProps {
	form: UseFormReturn<FormValues>;
}

const JobCategory = ({ form }: JobDescriptionProps): ReactElement => {
	return (
		<div className="flex flex-col gap-2">
			<label className="text-sm text-body">Job Category</label>
			<div className="relative">
				<Controller
					name="category"
					control={form.control}
					render={({ field: { onChange, value } }) => {
						return (
							<Select
								defaultValue={value}
								onValueChange={onChange}
							>
								<SelectTrigger className="h-10 w-[180px] rounded-lg bg-[#F2F4F5] text-base text-title">
									<SelectValue placeholder="Select Category" />
								</SelectTrigger>
								<SelectContent>
									{CATEGORY_OPTIONS.map(
										// eslint-disable-next-line @typescript-eslint/no-shadow
										({ label, value }) => (
											<SelectItem
												key={value}
												value={value}
												className="rounded py-2 hover:bg-[#ECFCE5]"
											>
												{label}
											</SelectItem>
										),
									)}
								</SelectContent>
							</Select>
						);
					}}
				/>
				<span className="absolute -bottom-5 flex w-full">
					{form.formState.errors.category?.message != null && (
						<span className="text-sm text-red-500">
							{form.formState.errors.category?.message}
						</span>
					)}
				</span>
			</div>
		</div>
	);
};

export default JobCategory;
