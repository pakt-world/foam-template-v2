"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import {
	type ReactElement,
	useEffect,
	useMemo,
	useState,
	useCallback,
} from "react";
import { useDebounce } from "usehooks-ts";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useGetTalents } from "@/lib/api";
import { type AchievementType, createQueryStrings2 } from "@/lib/utils";
import { TalentList } from "@/components/talent/talentList";
import { TalentHeader } from "@/components/talent/header";

interface TalentProps {
	_id: string;
	firstName: string;
	lastName: string;
	profile?: {
		bio?: {
			title: string;
		};
		talent?: {
			tagsIds: Array<{ name: string; color: string }>;
		};
	};
	score?: string;
	profileImage?: {
		url: string;
	};
	achievements: Array<{
		total: number;
		value: string;
		type: AchievementType;
	}>;
}

interface MappedTalent {
	_id: string;
	name: string;
	title: string;
	score: string;
	image: string;
	skills: Array<{ name: string; color: string }>;
	achievements: Array<{
		total: number;
		value: string;
		type: AchievementType;
	}>;
}

export default function TalentsPage(): ReactElement {
	const [isSearching, setIsSearching] = useState(true);

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
		searchParams.get("range")?.split(",")[0] ?? 0,
	);
	const debouncedMinimumPriceQuery = useDebounce(minimumPriceQuery, 300);

	const [maximumPriceQuery, setMaximumPriceQuery] = useState(
		searchParams.get("range")?.split(",")[1] ?? 100,
	);
	const debouncedMaximumPriceQuery = useDebounce(maximumPriceQuery, 300);

	useEffect(() => {
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
	const Limit = queryParams.get("limit") ?? "6";
	const page = queryParams.get("page") ?? "1";
	const searchQ = queryParams.get("search") ?? "";
	const skillQ = queryParams.get("skills") ?? "";
	const rangeQ = queryParams.get("range") ?? "";

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams);
			params.set(name, value);
			return params.toString();
		},
		[searchParams],
	);

	const {
		data: talentData,
		refetch: fetchTalents,
		isFetched,
		isFetching,
	} = useGetTalents({
		page: parseInt(page, 10),
		limit: parseInt(Limit, 10),
		filter: {
			search: searchQ,
			tags: skillQ,
			range: rangeQ,
			profileCompletenessMin: 70,
			profileCompletenessMax: 100,
			owner: true,
		},
	});

	const mapTalentData = (talent: TalentProps): MappedTalent => ({
		_id: talent._id,
		name: `${talent.firstName} ${talent.lastName}`,
		title: talent?.profile?.bio?.title ?? "",
		score: talent?.score ?? "0",
		image: talent?.profileImage?.url ?? "",
		skills: (talent?.profile?.talent?.tagsIds ?? []).map((t) => ({
			name: t.name,
			color: t.color,
		})),
		achievements: talent?.achievements.map((a) => ({
			total: a.total,
			value: a.value,
			type: a.type as AchievementType,
		})),
	});

	const talentLists = useMemo(() => {
		setIsSearching(false);
		return ((talentData?.data as TalentProps[]) ?? []).map(mapTalentData);
	}, [talentData?.data]);

	useEffect(() => {
		void fetchTalents();
	}, [searchParams, fetchTalents]);

	const handlePagination = (p: number): void => {
		setIsSearching(true);
		router.push(`${pathname}?${createQueryString("page", String(p))}`);
	};

	return (
		<div className="flex h-full flex-col gap-6 overflow-auto">
			<TalentHeader
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				skillsQuery={skillsQuery}
				setSkillsQuery={setSkillsQuery}
				minimumPriceQuery={minimumPriceQuery}
				setMinimumPriceQuery={setMinimumPriceQuery}
				maximumPriceQuery={maximumPriceQuery}
				setMaximumPriceQuery={setMaximumPriceQuery}
			/>

			<TalentList
				isLoading={(!isFetched && isFetching) || isSearching}
				talents={talentLists}
				totalPages={Number(talentData?.pages)}
				currentPage={Number(talentData?.page)}
				handlePagination={handlePagination}
			/>
		</div>
	);
}
