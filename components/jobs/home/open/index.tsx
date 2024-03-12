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

import { PageError } from "@/components/common/page-error";
import { Tabs } from "@/components/common/tabs";
import { useGetBookmarks } from "@/lib/api/bookmark";
import { useGetJobs } from "@/lib/api/job";
import { createQueryStrings2 } from "@/lib/utils";
import { AllJobs } from "./all";
import { SavedJobs } from "./saved";
import { OpenHeader } from "./header";

export const OpenJobs = (): ReactElement | null => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [searchQuery, setSearchQuery] = useState(
		searchParams.get("search") ?? "",
	);
	const debouncedSearchQuery = useDebounce(searchQuery, 300);

	const [skillsQuery, setSkillsQuery] = useState(
		searchParams.get("skills") ?? "",
	);
	const debouncedSkillsQuery = useDebounce(skillsQuery, 300);

	const [minimumPriceQuery, setMinimumPriceQuery] = useState(
		searchParams.get("range")?.split(",")[0] ?? "",
	);
	const debouncedMinimumPriceQuery = useDebounce(minimumPriceQuery, 300);

	const [maximumPriceQuery, setMaximumPriceQuery] = useState(
		searchParams.get("range")?.split(",")[1] ?? 100,
	);
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
		filter: {
			search: searchQ,
			tags: skillQ,
			range: searchQuery ? rangeQ : "",
		},
	});

	const bookmarkData = useGetBookmarks({
		page: 1,
		limit: 5,
		filter: { type: "collection" },
	});

	const jobs = jobsData.data?.data ?? [];

	// sort jobs by latest first
	const sortedJobs = jobs?.sort((a, b) => {
		return (
			new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		);
	});

	const onRefresh = async (): Promise<void> => {
		await Promise.all([jobsData.refetch(), bookmarkData.refetch()]);
	};

	if (jobsData.isError || bookmarkData.isError)
		return (
			<PageError className="h-[85vh] rounded-2xl border border-red-200 bg-red-50" />
		);
	// if (jobsData.isLoading) return <PageLoading className="h-[85vh] rounded-2xl border border-line" color="#007C5B" />;

	return (
		<div className="flex h-full flex-col gap-6">
			<OpenHeader
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				skillsQuery={skillsQuery}
				setSkillsQuery={setSkillsQuery}
				minimumPriceQuery={minimumPriceQuery}
				setMinimumPriceQuery={setMinimumPriceQuery}
				maximumPriceQuery={maximumPriceQuery}
				setMaximumPriceQuery={setMaximumPriceQuery}
			/>

			<div className="flex h-full grow">
				<Tabs
					urlKey="open-jobs"
					tabs={[
						{
							label: "All",
							value: "all",
							content: (
								<AllJobs
									jobs={sortedJobs}
									onRefresh={onRefresh}
									loading={jobsData?.isLoading}
								/>
							),
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
