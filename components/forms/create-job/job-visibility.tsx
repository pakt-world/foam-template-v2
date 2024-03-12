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

type FormValues = z.infer<typeof createJobSchema>;

interface JobDescriptionProps {
	form: UseFormReturn<FormValues>;
}

const JobVisibility = ({ form }: JobDescriptionProps): ReactElement => {
	return (
		<div className="flex flex-col gap-2">
			<label className="text-sm text-body">Visibility</label>
			<div className="relative">
				<Controller
					name="visibility"
					control={form.control}
					render={({ field: { onChange, value } }) => {
						return (
							<Select
								defaultValue={value}
								onValueChange={onChange}
							>
								<SelectTrigger className="h-10 w-[180px] rounded-lg bg-[#F2F4F5] text-base text-title">
									<SelectValue placeholder="Select Visibility" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem
										value="private"
										className="rounded py-2 hover:bg-[#ECFCE5]"
									>
										Private
									</SelectItem>
									<SelectItem
										value="public"
										className="rounded py-2 hover:bg-[#ECFCE5]"
									>
										Public
									</SelectItem>
								</SelectContent>
							</Select>
						);
					}}
				/>
				<span className="absolute -bottom-5 flex w-full">
					{form.formState.errors.visibility?.message != null && (
						<span className="whitespace-nowrap text-sm text-red-500">
							{form.formState.errors.visibility?.message}
						</span>
					)}
				</span>
			</div>
		</div>
	);
};

export default JobVisibility;
