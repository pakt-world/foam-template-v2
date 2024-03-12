"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Controller, type UseFormReturn } from "react-hook-form";
import { Textarea } from "pakt-ui";
import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type z } from "zod";
import { TagInput } from "@/components/common/tag-input";
import { type editProfileFormSchema } from "@/lib/validations";

type EditProfileFormValues = z.infer<typeof editProfileFormSchema>;

interface FormProps {
	form: UseFormReturn<EditProfileFormValues>;
}

const ProfessionalInfo = ({ form }: FormProps): ReactElement => {
	return (
		<div className="mb-4 rounded-lg bg-white px-8 py-7">
			<div className="flex h-[50px] flex-row items-center justify-between">
				<p className="text-lg font-bold text-title">
					Professional Information
				</p>
			</div>
			<div className="flex flex-col gap-4">
				<div className="flex flex-row gap-4">
					<div className="relative w-1/2">
						<p className="mb-2 text-[16px]">Skill Sets</p>
						<div className="min-h-[186px] rounded-lg border-2 border-[#DFDFE6] border-opacity-40 !bg-[#FCFCFD]">
							<Controller
								name="tags"
								control={form.control}
								render={({
									field: { onChange, value = [] },
								}) => (
									<TagInput
										tags={value}
										setTags={onChange}
										className="grow items-start border-none bg-transparent"
										placeholder={
											value?.length < 3
												? "Add your top 3 skills first"
												: value?.length > 3 &&
													  value?.length === 10
													? ""
													: value?.length >= 3
														? `You can add ${10 - value.length} more skill${10 - value.length === 1 ? "" : "s"}`
														: ""
										}
										disabled={value?.length === 10}
									/>
								)}
							/>
						</div>
						<span className="absolute -bottom-6 flex w-full">
							{form.formState.errors.tags?.message && (
								<span className="text-sm text-red-500">
									{form.formState.errors.tags?.message}
								</span>
							)}
						</span>
					</div>
					<div className="relative w-1/2">
						<p className="mb-2 text-[16px]">Bio</p>
						<Textarea
							maxLength={350}
							className="!min-h-[186px] w-full !border-2 !border-[#dfdfe67a] !bg-[#FCFCFD]"
							{...form.register("bio")}
							placeholder="Enter a 350 character about thing"
						/>
						<div className="ml-auto w-fit text-sm text-body">
							{form.watch("bio")?.length ?? 0}/350
						</div>

						<span className="absolute -bottom-6 flex w-full">
							{form.formState.errors.bio?.message && (
								<span className="text-sm text-red-500">
									{form.formState.errors.bio?.message}
								</span>
							)}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfessionalInfo;
