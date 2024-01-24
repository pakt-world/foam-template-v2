"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement, useEffect, useMemo, useState, useCallback } from "react";
import { useDebounce } from "usehooks-ts";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useGetTalents } from "@/lib/api";
import { type AchievementType, createQueryStrings2 } from "@/lib/utils";
import { TalentList } from "@/components/talents/talentList";
import { NumericInput } from "@/components/common/numeric-input";

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
    achievements: Array<{ total: number; value: string; type: AchievementType }>;
}

interface MappedTalent {
    _id: string;
    name: string;
    title: string;
    score: string;
    image: string;
    skills: Array<{ name: string; color: string }>;
    achievements: Array<{ total: number; value: string; type: AchievementType }>;
}

export default function TalentsPage(): ReactElement {
    const [isSearching, setIsSearching] = useState(true);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") ?? "");
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const [skillsQuery, setSkillsQuery] = useState(searchParams.get("skills") ?? "");
    const debouncedSkillsQuery = useDebounce(skillsQuery, 300);

    const [minimumPriceQuery, setMinimumPriceQuery] = useState(searchParams.get("range")?.split(",")[0] ?? 0);
    const debouncedMinimumPriceQuery = useDebounce(minimumPriceQuery, 300);

    const [maximumPriceQuery, setMaximumPriceQuery] = useState(searchParams.get("range")?.split(",")[1] ?? 100);
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
