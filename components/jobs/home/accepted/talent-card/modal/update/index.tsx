"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import { MoreVertical } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { JobUpdateHeader } from "./header";
import { isJobDeliverable, type Job } from "@/lib/types";
import { DeliverablesStepper } from "@/components/jobs/misc/deliverables-stepper";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/common/popover";

interface JobUpdatesProps {
	job: Job;
	requestJobCancellation: () => void;
}

export const JobUpdates: FC<JobUpdatesProps> = ({
	job,
	requestJobCancellation,
}) => {
	const {
		name,
		owner,
		creator,
		tags,
		description,
		createdAt,
		deliveryDate,
		paymentFee,
		collections,
		progress,
		_id: jobId,
	} = job;
	const deliverables = collections.filter(isJobDeliverable);

	return (
		<>
			<div className="flex items-start justify-between bg-primary-gradient px-4 py-6 text-3xl font-bold text-white">
				<div className="max-w-[90%] break-words">{name}</div>
				<Popover>
					<PopoverTrigger asChild>
						<button aria-label="more" type="button">
							<MoreVertical />
						</button>
					</PopoverTrigger>
					<PopoverContent className="-mt-6 mr-12 flex w-auto flex-col overflow-hidden border-red-100 bg-[#FFFFFF] p-0 text-red-500">
						<button
							className="px-4 py-2 text-left duration-200 hover:bg-red-100"
							onClick={requestJobCancellation}
							type="button"
						>
							Cancel Job
						</button>
						{/* // Comment <button className="px-4 py-2 hover:bg-red-100 duration-200 text-left">Report an Issue</button> */}
					</PopoverContent>
				</Popover>
			</div>
			<div className="flex h-full grow flex-col gap-6 px-4 py-6">
				<JobUpdateHeader
					createdAt={createdAt}
					profile={creator}
					deliveryDate={deliveryDate}
					paymentFee={paymentFee}
					tags={tags}
				/>

				<div className="flex flex-col gap-2">
					<h3 className="text-lg font-bold">Job Description</h3>
					<p className="rounded-xl border border-blue-300 bg-[#C9F0FF] p-3">
						{description}
					</p>
				</div>
				<div className="flex grow flex-col gap-2">
					<div>
						<h3 className="text-lg font-bold">Job Deliverables</h3>
						<p className="text-body">
							Mark the deliverables upon completion
						</p>
					</div>

					<div className="h-full grow">
						<DeliverablesStepper
							jobId={jobId}
							jobProgress={progress}
							talentId={String(owner?._id)}
							jobCreator={creator?._id}
							deliverables={deliverables.map(
								// eslint-disable-next-line @typescript-eslint/no-shadow
								({ _id, name, progress, updatedAt, meta }) => ({
									jobId,
									jobCreator: creator?._id,
									progress,
									updatedAt,
									meta,
									description: name,
									deliverableId: _id,
								}),
							)}
						/>
					</div>
				</div>
			</div>
		</>
	);
};
