"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React, { type ReactElement, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { NumericInput } from "@/components/common/numeric-input";
import { PageError } from "@/components/common/page-error";
// import { PageLoading } from "@/components/common/page-loading";
import { Tabs } from "@/components/common/tabs";
import { useGetBookmarks } from "@/lib/api/bookmark";
import { useGetJobs } from "@/lib/api/job";
import { createQueryStrings2 } from "@/lib/utils";
import { AllJobs } from "./all-jobs";
import { SavedJobs } from "./saved-jobs";
// import { JobSkillInput } from "./job-skill-input";

export const OpenJobs = (): ReactElement | null => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") ?? "");
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const [skillsQuery, setSkillsQuery] = useState(searchParams.get("skills") ?? "");
    const debouncedSkillsQuery = useDebounce(skillsQuery, 300);

    const [minimumPriceQuery, setMinimumPriceQuery] = useState(searchParams.get("range")?.split(",")[0] ?? "");
    const debouncedMinimumPriceQuery = useDebounce(minimumPriceQuery, 300);

    const [maximumPriceQuery, setMaximumPriceQuery] = useState(searchParams.get("range")?.split(",")[1] ?? 100);
    const debouncedMaximumPriceQuery = useDebounce(maximumPriceQuery, 300);

    React.useEffect(() => {
        const queries = createQueryStrings2({
            skills: debouncedSkillsQuery ?? "",
            search: debouncedSearchQuery ?? "",
            range: `${debouncedMinimumPriceQuery ?? 0},${debouncedMaximumPriceQuery ?? 100}`,
        });

        router.push(`${pathname}?${queries}`);
    }, [
        router,
        pathname,
        debouncedSearchQuery,
        debouncedSkillsQuery,
        debouncedMinimumPriceQuery,
        debouncedMaximumPriceQuery,
    ]);

    const queryParams = new URLSearchParams(searchParams);
    const searchQ = queryParams.get("search") ?? "";
    const skillQ = queryParams.get("skills") ?? "";
    const rangeQ = queryParams.get("range") ?? "";

    const jobsData = useGetJobs({
        category: "open",
        status: "pending",
        filter: { search: searchQ, tags: skillQ, range: searchQuery ? rangeQ : "" },
    });

    const bookmarkData = useGetBookmarks({ page: 1, limit: 5, filter: { type: "collection" } });

    const jobs = jobsData.data?.data ?? [];

    // sort jobs by latest first
    const sortedJobs = jobs?.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const onRefresh = async (): Promise<void> => {
        await Promise.all([jobsData.refetch(), bookmarkData.refetch()]);
    };

    if (jobsData.isError || bookmarkData.isError)
        return <PageError className="h-[85vh] rounded-2xl border border-red-200 bg-red-50" />;
    // if (jobsData.isLoading) return <PageLoading className="h-[85vh] rounded-2xl border border-line" color="#007C5B" />;

    return (
        <div className="flex h-full flex-col gap-6">
            <div className="flex w-full items-end gap-4 rounded-2xl border border-[#7DDE86] bg-white p-6">
                <div className="relative flex grow flex-col gap-1">
                    <label htmlFor="" className="text-sm">
                        Search
                    </label>
                    <input
                        type="text"
                        value={searchQuery}
                        placeholder="Name, Category, etc."
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                        }}
                        className="h-11 rounded-lg border border-line bg-gray-50 px-3 focus:outline-none"
                    />
                </div>
                <div className="relative flex grow flex-col gap-1">
                    <label htmlFor="" className="text-sm">
                        Skill
                    </label>
                    <input
                        type="text"
                        value={skillsQuery}
                        placeholder="Java, Solidity, etc."
                        onChange={(e) => {
                            setSkillsQuery(e.target.value);
                        }}
                        className="h-11 rounded-lg border border-line bg-gray-50 px-3 focus:outline-none"
                    />
                </div>
                <div className="relative flex grow flex-col gap-1">
                    <label htmlFor="" className="text-sm">
                        Afroscore
                    </label>
                    <div className="flex h-11 gap-2 rounded-lg border border-line bg-gray-50 py-2">
                        <NumericInput
                            type="text"
                            value={minimumPriceQuery}
                            placeholder="From"
                            onChange={(e) => {
                                setMinimumPriceQuery(e.target.value);
                            }}
                            className="grow bg-transparent px-3 placeholder:text-sm focus:outline-none"
                        />
                        <div className="border-r border-line" />
                        <NumericInput
                            type="text"
                            placeholder="To"
                            value={maximumPriceQuery}
                            onChange={(e) => {
                                setMaximumPriceQuery(e.target.value);
                            }}
                            className="grow bg-transparent px-3 placeholder:text-sm focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="flex h-full grow">
                <Tabs
                    urlKey="open-jobs"
                    tabs={[
                        {
                            label: "All",
                            value: "all",
                            content: <AllJobs jobs={sortedJobs} onRefresh={onRefresh} loading={jobsData?.isLoading} />,
                        },
                        {
                            label: "Saved",
                            value: "saved",
                            content: (
                                <SavedJobs
                                    jobs={bookmarkData.data?.data ?? []}
                                    isError={bookmarkData.isError}
                                    isLoading={bookmarkData.isLoading}
                                    onRefresh={onRefresh}
                                />
                            ),
                        },
                    ]}
                />
            </div>
        </div>
    );
};
