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
        <div className="mb-4 rounded-lg bg-white p-4">
            <div className="flex h-[50px] flex-row items-center justify-between">
                <p className="text-lg font-bold text-title">Professional Information</p>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-4">
                    <div className="relative w-1/2">
                        <p className="text-sm">Skill Sets</p>
                        <div className="min-h-[186px] rounded-lg border border-primary border-opacity-40 !bg-[#FCFCFD]">
                            <Controller
                                name="tags"
                                control={form.control}
                                render={({ field: { onChange, value = [] } }) => (
                                    <TagInput
                                        tags={value}
                                        setTags={onChange}
                                        className="grow items-start border-none bg-transparent"
                                        placeholder="Add your top 3 skills first"
                                    />
                                )}
                            />
                        </div>
                        <span className="absolute -bottom-6 flex w-full">
                            {form.formState.errors.tags?.message && (
                                <span className="text-sm text-red-500">{form.formState.errors.tags?.message}</span>
                            )}
                        </span>
                    </div>
                    <div className="relative w-1/2">
                        <p className="text-sm">Bio</p>
                        <Textarea
                            maxLength={350}
                            className="!min-h-[186px] w-full !bg-[#FCFCFD]"
                            {...form.register("bio")}
                            placeholder="Enter a 350 character about thing"
                        />
                        <div className="ml-auto w-fit text-sm text-body">{form.watch("bio")?.length ?? 0} / 350</div>

                        <span className="absolute -bottom-6 flex w-full">
                            {form.formState.errors.bio?.message && (
                                <span className="text-sm text-red-500">{form.formState.errors.bio?.message}</span>
                            )}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfessionalInfo;