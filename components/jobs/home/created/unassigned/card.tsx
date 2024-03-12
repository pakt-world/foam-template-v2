"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import Image from "next/image";
import { Button } from "pakt-ui";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type Job } from "@/lib/types";
import { isJobApplicant } from "@/lib/types";

interface UnAssignedJobCardProps {
	job: Job;
}

export const UnAssignedJobCard: FC<UnAssignedJobCardProps> = ({ job }) => {
	const router = useRouter();

	const {
		createdAt,
		_id,
		collections,
		tagsData,
		name,
		paymentFee,
		invite,
		isPrivate,
	} = job;

	const id = _id;
	const title = name;
	const skills = tagsData.join(",");
	const applicants = collections.filter(isJobApplicant);
	const hasInvite = invite !== undefined && invite !== null;
	const creationDate = format(new Date(createdAt), "dd MMM yyyy");

	return (
		<div className="flex w-full grow flex-col gap-4 rounded-3xl border border-line bg-white p-4">
			<div className="flex w-full gap-4">
				<div className="flex grow flex-col gap-2">
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2">
							<span className="text-lg text-body">
								{creationDate}
							</span>
						</div>

						<span className="inline-flex rounded-full border border-green-200 bg-[#B2E9AA66] px-3 text-lg text-title">
							${paymentFee}
						</span>
					</div>
					<div className="min-h-[58px] grow break-words text-2xl text-title">
						{title}
					</div>
				</div>
			</div>
			<div className="mt-auto flex items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					{!hasInvite && isPrivate && (
						<Button
							size="xs"
							variant="secondary"
							onClick={() => {
								router.push(
									`/talents${skills ? `?skills=${skills}` : ""}`,
								);
							}}
						>
							Find Talent
						</Button>
					)}

					{!hasInvite && !isPrivate && (
						<Button
							size="xs"
							variant="secondary"
							onClick={() => {
								router.push(`/jobs/${id}/applicants`);
							}}
						>
							View Applicants
						</Button>
					)}

					<Button
						size="xs"
						variant="outline"
						onClick={() => {
							router.push(`/jobs/${id}`);
						}}
					>
						Job Details
					</Button>
				</div>

				<div>
					{!isPrivate && !hasInvite && (
						<div className="inline-flex w-fit flex-row-reverse items-center">
							{applicants.length > 5 && (
								<div className="-ml-3 flex h-[30px] w-[30px] items-center justify-center overflow-hidden rounded-full border-2 border-white bg-[#D9D9D9] text-sm last:ml-0">
									<span className="-ml-1.5">
										+{applicants.length - 5}
									</span>
								</div>
							)}

							{applicants.slice(0, 5).map((applicant, index) => {
								return (
									<div
										key={index}
										className="-ml-3 h-[30px] w-[30px] overflow-hidden rounded-full border-2 border-white bg-green-100 last:ml-0"
									>
										{applicant.creator.profileImage && (
											<Image
												src={
													applicant.creator
														.profileImage?.url ?? ""
												}
												alt=""
												width={30}
												height={30}
											/>
										)}
									</div>
								);
							})}
						</div>
					)}

					{hasInvite && (
						<div className="inline-flex items-center gap-1 rounded-full border border-[#48A7F8] bg-[#C9F0FF] px-1 py-0.5 pr-3 text-sm text-[#0065D0]">
							<div className="h-[27px] w-[27px] overflow-hidden rounded-full border border-white bg-white">
								{invite?.receiver.profileImage && (
									<Image
										src={
											invite.receiver.profileImage?.url ??
											""
										}
										alt=""
										width={30}
										height={30}
									/>
								)}
							</div>
							<span>Awaiting Talent Response</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
