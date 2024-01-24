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

interface JobDescriptionProps {
    form: UseFormReturn<FormValues>;
}

const JobDescription = ({ form }: JobDescriptionProps): ReactElement => {
    return (
        <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium text-black">Job Description</h3>
            <div className="relative">
                <textarea
                    id="description"
                    maxLength={400}
                    {...form.register("description")}
                    className="w-full rounded-lg border border-blue-300 bg-[#C9F0FF] p-4 focus:outline-none"
                    placeholder="Enter job description"
                    rows={3}
                />
                <div className="-mt-1 ml-auto w-fit text-sm text-body">
                    {form.watch("description")?.length} / 400 characters
                </div>
                <span className="absolute -bottom-4 flex w-full">
                    {form.formState.errors.description?.message != null && (
                        <span className="text-sm text-red-500">{form.formState.errors.description?.message}</span>
                    )}
                </span>
            </div>
        </div>
    );
};

export default JobDescription;
