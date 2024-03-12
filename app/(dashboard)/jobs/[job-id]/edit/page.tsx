"use client";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useGetJobById } from "@/lib/api/job";
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import { EditJobForm } from "@/components/forms/edit-job";

interface Props {
	params: {
		"job-id": string;
	};
}

export default function EditJobPage({ params }: Props): React.JSX.Element {
	const jobId = params["job-id"];
	const jobQuery = useGetJobById({ jobId });

	if (jobQuery.isError) return <PageError className="absolute inset-0" />;
	if (jobQuery.isLoading)
		return <PageLoading className="absolute inset-0" color="#007C5B" />;
	const { data: job } = jobQuery;

	return <EditJobForm job={job} />;
}
