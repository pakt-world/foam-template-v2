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

import { SkillInput } from "./skill-input";

type FormValues = z.infer<typeof createJobSchema>;

interface PreferredSkillsProps {
	form: UseFormReturn<FormValues>;
	isEdit?: boolean;
}

const PreferredSkills = ({
	form,
	isEdit,
}: PreferredSkillsProps): ReactElement => {
	return (
		<div className="flex flex-col gap-2">
			<h3 className="text-lg font-medium text-black">
				Preferred Skills
				{!isEdit && (
					<span className="ml-4 text-sm font-thin text-body">
						You can add up to three
					</span>
				)}
			</h3>
			<div className="flex items-center justify-start gap-2">
				<div className="relative">
					<SkillInput form={form} name="firstSkill" />
					<span className="absolute -bottom-6 left-2 flex w-full">
						{form.formState.errors.firstSkill?.message != null && (
							<span className="text-sm text-red-500">
								{form.formState.errors.firstSkill?.message}
							</span>
						)}
					</span>
				</div>
				<div className="flex flex-col">
					<SkillInput form={form} name="secondSkill" />
					<span>
						{form.formState.errors.secondSkill?.message != null && (
							<span className="text-sm text-red-500">
								{form.formState.errors.secondSkill?.message}
							</span>
						)}
					</span>
				</div>
				<div className="relative">
					<SkillInput form={form} name="thirdSkill" />
					<span className="absolute bottom-2">
						{form.formState.errors.thirdSkill?.message != null && (
							<span className="text-sm text-red-500">
								{form.formState.errors.thirdSkill?.message}
							</span>
						)}
					</span>
				</div>
			</div>
		</div>
	);
};

export default PreferredSkills;
