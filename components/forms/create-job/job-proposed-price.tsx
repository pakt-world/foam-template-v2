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
import { DollarIcon } from "@/components/common/icons";
import { NumericInput } from "@/components/common/numeric-input";

type FormValues = z.infer<typeof createJobSchema>;

interface JobProposedPriceProps {
    form: UseFormReturn<FormValues>;
}

const JobProposedPrice = ({ form }: JobProposedPriceProps): ReactElement => {
    return (
        <div className="relative">
            <div className="flex h-[45px] items-center rounded-lg border-[#198155] bg-[#ECFCE5] p-2 text-primary">
                <DollarIcon />
                <NumericInput
                    type="text"
                    {...form.register("budget")}
                    placeholder="Enter Proposed Price"
                    className="h-full  bg-transparent text-base placeholder:text-primary focus:outline-none"
                />
            </div>
            <span className="absolute -bottom-5 flex w-full">
                {form.formState.errors.budget?.message != null && (
                    <span className="text-sm text-red-200">{form.formState.errors.budget?.message}</span>
                )}
            </span>
        </div>
    );
};

export default JobProposedPrice;
