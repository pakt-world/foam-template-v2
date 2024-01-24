"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Calendar, Tag } from "lucide-react";
import { Button, Select, Checkbox } from "pakt-ui";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { isJobApplicant } from "@/lib/types";
import { type JobApplicant } from "@/lib/types";
import { useGetJobById } from "@/lib/api/job";
import { useGetAccount } from "@/lib/api/account";
import { paginate } from "@/lib/utils";
import { PageError } from "@/components/common/page-error";
import { PageEmpty } from "@/components/common/page-empty";
import { Pagination } from "@/components/common/pagination";
import { PageLoading } from "@/components/common/page-loading";
import { ApplicantCard } from "@/components/jobs/applicant-card";

interface Props {
    params: {
        "job-id": string;
    };
}

const SORT_BY = [
    {
        label: "Highest to lowest",
        value: "highest-to-lowest",
    },
    {
        label: "Lowest to highest",
        value: "lowest-to-highest",
    },
];

type SortBy = "highest-to-lowest" | "lowest-to-highest";

export default function JobApplications({ params }: Props): React.JSX.Element {
    const router = useRouter();
    const jobId = params["job-id"];
    const accountData = useGetAccount();
    const jobData = useGetJobById({ jobId });
    const [skillFilters, setSkillFilters] = React.useState<string[]>([]);
    const [sortBy, setSortBy] = React.useState<"score" | "bid">("score");
    const [bidSort, setBidSort] = React.useState<SortBy>("highest-to-lowest");
    const [scoreSort, setScoreSort] = React.useState<SortBy>("highest-to-lowest");
    const [currentPage, setCurrentPage] = React.useState(1);

    if (jobData.isError) return <PageError className="absolute inset-0" />;
    if (jobData.isLoading) return <PageLoading className="absolute inset-0" color="#007C5B" />;

    const { data: job } = jobData;
    const { data: account } = accountData;

    const isClient = account?._id === job.creator._id;

    if (!isClient) return <PageError className="absolute inset-0" />;

    const applicants = job.collections.filter(isJobApplicant);

    const sortFunction = (
        a: JobApplicant,
        b: JobApplicant,
        key: (obj: JobApplicant) => number,
        order: SortBy,
    ): number => {
        if (order === "highest-to-lowest") {
            return key(b) - key(a);
        }

        if (order === "lowest-to-highest") {
            return key(a) - key(b);
        }

        return 0;
    };

    const filteredApplicants = applicants
        .filter((applicant) => {
            if (skillFilters.length === 0) return true;
            return applicant.creator.profile.talent.tags
                .map((skill) => skill.toLowerCase())
                .some((skill) => skillFilters.includes(skill.toLowerCase()));
        })
        .sort((a, b) => {
            const bidSortResult = sortFunction(a, b, (value) => value.paymentFee, bidSort);
            const scoreSortResult = sortFunction(a, b, (value) => value.creator.score, scoreSort);

            if (sortBy === "bid") return bidSortResult;
            if (sortBy === "score") return scoreSortResult;
            return 0;
        });

    const itemsPerPage = 3;
    const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);

    const paginatedApplicants = paginate(filteredApplicants, itemsPerPage, currentPage);

    return (
        <div className="flex h-full flex-col gap-6">
            <div className="flex justify-between gap-4 rounded-xl bg-primary-gradient p-4 py-6">
                <div className="flex max-w-3xl grow flex-col gap-3">
                    <h2 className="max-w-[750px] text-3xl font-bold text-white">{job.name}</h2>
                    <p className="max-w-[750px] text-white">{job.description}</p>
                    <div className="mt-auto flex items-center gap-4">
                        <span className="flex items-center gap-2 rounded-full bg-[#C9F0FF] px-3 py-1 text-[#0065D0]">
                            <Tag size={20} />
                            <span>$ {job.paymentFee}</span>
                        </span>

                        <span className="flex items-center gap-2 rounded-full bg-[#ECFCE5] px-3 py-1 text-[#198155]">
                            <Calendar size={20} />
                            <span>Due {format(new Date(job.deliveryDate), "MMM dd, yyyy")}</span>
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex w-full  grow gap-6 overflow-hidden">
                <div className="flex h-fit shrink-0 grow-0 basis-[300px] flex-col gap-4 rounded-2xl border border-[#7DDE86] bg-white p-4">
                    <div>
                        <label htmlFor="score">Afroscore</label>
                        <Select
                            placeholder="Highest to lowest"
                            options={SORT_BY}
                            onChange={(value) => {
                                setSortBy("score");
                                setScoreSort(value as SortBy);
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="bid">Bid</label>
                        <Select
                            placeholder="Highest to lowest"
                            options={SORT_BY}
                            onChange={(value) => {
                                setSortBy("bid");
                                setBidSort(value as SortBy);
                            }}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span>Preferred Skills</span>

                        <div className="flex flex-col gap-2">
                            {job.tagsData
                                .map((tag) => tag.toLowerCase())
                                .map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => {
                                            if (skillFilters.includes(tag)) {
                                                setSkillFilters(skillFilters.filter((skill) => skill !== tag));
                                            } else {
                                                setSkillFilters([...skillFilters, tag]);
                                            }
                                        }}
                                        className="flex w-full items-center justify-between gap-2 rounded-lg border bg-gray-50 px-3 py-3 duration-300 hover:border-[#7DDE86]"
                                        type="button"
                                    >
                                        <span className="capitalize text-body">{tag}</span>
                                        <Checkbox checked={skillFilters.includes(tag)} />
                                    </button>
                                ))}
                        </div>
                    </div>
                </div>

                {applicants.length === 0 && (
                    <PageEmpty className="h-[60vh] rounded-2xl" label="No applicants yet">
                        <div className="mt-4 w-full">
                            <Button
                                className="w-full"
                                fullWidth
                                onClick={() => {
                                    router.push(`/talents`);
                                }}
                            >
                                Find Talent
                            </Button>
                        </div>
                    </PageEmpty>
                )}

                {paginatedApplicants.length === 0 && applicants.length > 0 && (
                    <PageEmpty
                        className="h-[60vh] rounded-2xl"
                        label="No talent matches the criteria, try changing your filter"
                    />
                )}

                {paginatedApplicants.length > 0 && (
                    <div className="flex h-full grow flex-col gap-4 overflow-y-auto">
                        <div className="flex flex-col gap-4 overflow-y-auto ">
                            {paginatedApplicants.map((applicant) => (
                                <ApplicantCard
                                    key={applicant.creator._id}
                                    talent={applicant.creator}
                                    bid={applicant.paymentFee}
                                    message={applicant.description}
                                    inviteReceiverId={job.invite?.receiver._id}
                                />
                            ))}
                        </div>
                        <div className="pb-4">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                setCurrentPage={setCurrentPage}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
