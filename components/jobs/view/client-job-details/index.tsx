"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React, { type ReactElement } from "react";
import { Info } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { isJobDeliverable } from "@/lib/types";
import { Spinner } from "@/components/common";
import { useCancelJobInvite } from "@/lib/api/job";
import type { Job } from "@/lib/types";
import { Modal } from "@/components/common/headless-modal";
import { JobHeader } from "../misc/header";
import { JobDeliverables } from "../misc/deliverables";
import { JobSkills } from "../misc/skills";
import { JobDescription } from "../misc/description";
import { DeleteJobModal } from "./modal/delete";
import { CTAS } from "./footer";

interface ClientJobDetailsProps {
	job: Job;
}

export function ClientJobDetails({ job }: ClientJobDetailsProps): ReactElement {
	const cancelInvite = useCancelJobInvite();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
	const JOB_TYPE: "private" | "open" = job.isPrivate ? "private" : "open";

	const JobCtas = CTAS[JOB_TYPE];

	return (
		<div className="flex h-full gap-6">
			<div className="scrollbar-hide flex h-full grow flex-col overflow-y-auto pb-20">
				<JobHeader
					title={job.name}
					price={job.paymentFee}
					dueDate={job.deliveryDate}
					creator={{
						_id: job?.owner?._id ?? "",
						score: job?.owner?.score ?? 0,
						avatar: job?.owner?.profileImage?.url,
						name: `${job?.owner?.firstName} ${job?.owner?.lastName.slice(0, 1)}.`,
					}}
				/>
				<div className="flex w-full grow flex-col rounded-b-xl border border-t-0 border-line bg-white p-6">
					<JobSkills skills={job.tags ?? []} />
					<JobDescription description={job.description} />

					<JobDeliverables
						deliverables={job.collections
							.filter(isJobDeliverable)
							.map((collection) => collection.name)}
					/>

					{job.invite == null && (
						<JobCtas
							jobId={job._id}
							skills={job.tagsData}
							openDeleteModal={() => {
								setIsDeleteModalOpen(true);
							}}
						/>
					)}

					{job.invite != null && (
						<div className="my-3 flex w-full items-center justify-between gap-2 rounded-2xl border border-blue-300 bg-blue-50 p-4 text-blue-500">
							<div className="flex items-center gap-2">
								<Info size={20} />
								<span>Awaiting Talent Response</span>
							</div>

							<button
								className="flex h-[35px] w-[130px] items-center justify-center rounded-lg border border-red-500 bg-red-50 text-sm text-red-500"
								onClick={() => {
									cancelInvite.mutate(
										{ inviteId: job.invite?._id ?? "" },
										{},
									);
								}}
								type="button"
							>
								{cancelInvite.isLoading ? (
									<Spinner size={16} />
								) : (
									"Cancel Invite"
								)}
							</button>
						</div>
					)}
				</div>
			</div>

			<div className="flex  h-full w-fit basis-[270px] flex-col items-center gap-7" />
			<Modal
				isOpen={isDeleteModalOpen}
				closeModal={() => {
					setIsDeleteModalOpen(false);
				}}
			>
				<DeleteJobModal
					jobId={job._id}
					title={job.name}
					setModalOpen={setIsDeleteModalOpen}
				/>
			</Modal>
		</div>
	);
}
