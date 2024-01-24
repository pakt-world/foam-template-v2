"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement, useEffect } from "react";
import * as z from "zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";

interface JobSearchBarProps {
    search?: string;
    skills?: string;
    range?: string;
    handleSearch?: (filter: unknown) => void;
    isTalentView?: boolean;
}

const searchFormSchema = z.object({
    search: z.string(),
    skills: z.string(),
    min: z.string(),
    max: z.string(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

export const TalentSearchBar = ({
    search,
    skills,
    range,
    isTalentView = false,
    handleSearch,
}: JobSearchBarProps): ReactElement | null => {
    const form = useForm<SearchFormValues>({
        resolver: zodResolver(searchFormSchema),
    });

    const setDefaults = (): void => {
        if (range && range.split(",").length > 1) {
            const minV = range.split(",")[0] ?? "";
            const maxV = range.split(",")[1] ?? "";
            form.setValue("min", minV);
            form.setValue("max", maxV);
        }
        if (search) form.setValue("search", search);
        if (skills) form.setValue("skills", skills);
    };

    useEffect(() => {
        setDefaults();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, skills, range]);

    const onSubmit: SubmitHandler<SearchFormValues> = (values) => {
        if (handleSearch) {
            handleSearch({
                search: values.search,
                skills: values.skills,
                range: values.min && values.max ? `${values.min},${values.max}` : "",
            });
        }
    };
    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex w-full items-end gap-4 rounded-2xl border border-[#7DDE86] bg-white p-6">
                <div className="relative flex grow flex-col gap-1">
                    <label htmlFor="" className="text-sm">
                        Search
                    </label>
                    <input
                        type="text"
                        placeholder="Enter"
                        className="h-11 rounded-lg border border-line bg-gray-50 px-3 focus:outline-none"
                        {...form.register("search")}
                    />
                </div>
                <div className="relative flex grow flex-col gap-1">
                    <label htmlFor="" className="text-sm">
                        Skill
                    </label>
                    <input
                        type="text"
                        placeholder="Enter"
                        className="h-11 rounded-lg border border-line bg-gray-50 px-3 focus:outline-none"
                        {...form.register("skills")}
                    />
                </div>
                <div className="relative flex grow flex-col gap-1">
                    <label htmlFor="" className="text-sm">
                        {isTalentView ? "AfroScore" : "Price"}
                    </label>
                    <div className="flex h-11 gap-2 rounded-lg border border-line bg-gray-50 py-2">
                        <input
                            type="text"
                            placeholder="From"
                            className="grow bg-transparent px-3 placeholder:text-sm focus:outline-none"
                            {...form.register("min")}
                        />
                        <div className="border-r border-line" />
                        <input
                            type="text"
                            placeholder="To"
                            className="grow bg-transparent px-3 placeholder:text-sm focus:outline-none"
                            {...form.register("max")}
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="flex h-11 items-center justify-center rounded-xl border border-primary bg-[#ECFCE5] p-2 px-6 text-primary"
                    aria-label="Search"
                >
                    <Search size={20} />
                </button>
            </div>
        </form>
    );
};
