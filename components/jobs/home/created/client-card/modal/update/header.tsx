"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import { format } from "date-fns";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import type { UserProfile } from "@/lib/types";
import { AfroProfile } from "@/components/common/afro-profile";

interface Props {
	status?: "ongoing" | "cancel_requested";
	createdAt: string;
	deliveryDate: string;
	paymentFee: number;
	profile: UserProfile;
	tags: Array<{
		color: string;
		name: string;
	}>;
}

export const JobUpdateHeader: FC<Props> = ({
	createdAt,
	profile,
	deliveryDate,
	paymentFee,
	tags,
	status = "ongoing",
}) => {
	return (
		<div className="flex flex-col gap-4">
			<div
				className="grid grid-cols-4 divide-x rounded-2xl border p-4"
				style={{
					borderColor:
						status === "cancel_requested" ? "#FFBDBD" : "#7DDE86",
					backgroundColor:
						status === "cancel_requested" ? "#FFF8F8" : "#F8FFF4",
				}}
			>
				<div className="flex flex-col gap-2 pr-4">
					<span className="text-body">Date Created</span>
					<span>{format(new Date(createdAt), "MMM dd, yyyy")}</span>
				</div>
				<div className="flex flex-col gap-2 px-4">
					<span className="text-body">Due Date</span>
					<span>
						{format(new Date(deliveryDate), "MMM dd, yyyy")}
					</span>
				</div>

				<div className="flex flex-col gap-2 px-4">
					<span className="text-body">Price</span>
					<span>{paymentFee} USD</span>
				</div>
				<div className="flex flex-col gap-2 pl-4">
					<span className="text-body">Status</span>
					<span
						className="inline-flex w-fit rounded-full px-3 py-1 text-sm text-white"
						style={{
							borderColor:
								status === "cancel_requested"
									? "#FFBDBD"
									: "#7DDE86",
							backgroundColor:
								status === "cancel_requested"
									? "#EE4B2B"
									: "#7DDE86",
						}}
					>
						{status === "cancel_requested"
							? "Cancelling"
							: "In Progress"}
					</span>
				</div>
			</div>

			<div
				className="flex flex-col divide-y rounded-2xl border p-4"
				style={{
					borderColor:
						status === "cancel_requested" ? "#FFBDBD" : "#7DDE86",
					backgroundColor:
						status === "cancel_requested" ? "#FFF8F8" : "#F8FFF4",
				}}
			>
				<div className="flex flex-col gap-2 pb-1">
					<div className="flex items-center gap-2">
						<AfroProfile
							score={profile?.score || 0}
							size="sm"
							src={profile.profileImage?.url}
							url={`/talents/${profile?._id}`}
						/>
						<div className="flex flex-col">
							<span className="text-base font-bold text-title">{`
                  ${profile.firstName} ${profile.lastName}
                  `}</span>
							<span className="text-sm capitalize">
								{profile.profile.bio.title}
							</span>
						</div>
					</div>
				</div>
				<div className="flex items-center gap-2 pt-4">
					<span className="text-body">Skills</span>
					<div className="flex items-center gap-2 text-sm">
						{tags.map(({ color, name }) => {
							return (
								<span
									key={name}
									className="rounded-full px-4 py-0.5 capitalize"
									style={{
										backgroundColor: color,
									}}
								>
									{name}
								</span>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};
