"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useGetJobById } from "@/lib/api/job";
import { useGetAccount } from "@/lib/api/account";
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import { ClientJobDetails } from "@/components/jobs/client-job-details";
import { TalentJobDetails } from "@/components/jobs/talent-job-details";

interface Props {
    params: {
        "job-id": string;
    };
}

export default function JobDetailsPage({ params }: Props): ReactElement {
    const jobId = params["job-id"];
    const accountQuery = useGetAccount();
    const jobQuery = useGetJobById({ jobId });
    if (jobQuery.isError || accountQuery.isError) return <PageError className="absolute inset-0" />;
    if (jobQuery.isLoading || accountQuery.isLoading)
        return <PageLoading className="absolute inset-0" color="#007C5B" />;

    const { data: job } = jobQuery;
    const { data: account } = accountQuery;
    const USER_ROLE: "client" | "talent" = account?._id === job.creator._id ? "client" : "talent";

    const VIEWS = {
        client: ClientJobDetails,
        talent: TalentJobDetails,
    };

    const CurrentView = VIEWS[USER_ROLE];

    return (
        <div className="h-full">
            <CurrentView job={job} userId={account._id} />
        </div>
    );
}
