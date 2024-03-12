"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React from "react";
import { Button } from "pakt-ui";
import { Briefcase, Edit } from "lucide-react";
import Link from "next/link";
import { useWindowSize } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { getAvatarColor } from "@/lib/utils";
import { InviteTalentModal } from "@/components/talent/profile/invite";
import { AfroProfile } from "@/components/common/afro-profile";

interface Props {
	_id: string;
	name: string;
	position: string;
	score: number;
	skills: Array<{
		name: string;
		backgroundColor: string;
	}>;
	profileImage?: string;
	isOwnProfile?: boolean;
}

export const ProfileHeader: React.FC<Props> = ({
	_id,
	name,
	position,
	score,
	skills,
	isOwnProfile,
	profileImage,
}) => {
	const borderColor = getAvatarColor(score);
	const [isModalOpen, setIsModalOpen] = React.useState(false);
	const size = useWindowSize();

	return (
		<>
			<InviteTalentModal
				isOpen={isModalOpen}
				setIsOpen={setIsModalOpen}
				talentId={_id}
			/>

			<div className="relative flex w-full gap-6 rounded-2xl border border-line bg-white py-3 pl-1 pr-6">
				<div
					className="absolute -left-1 top-1/2 h-[2px] w-full"
					style={{ backgroundColor: borderColor }}
				/>

				<div>
					{size.width && (
						<AfroProfile
							src={profileImage}
							score={score}
							size={
								size.width > 1530
									? "xl"
									: size.width > 768
										? "lg"
										: "sm"
							}
						/>
					)}
				</div>
				<div className="grid grow grid-cols-1 gap-5">
					<div className="flex w-full flex-row justify-between gap-2">
						<div className="flex w-full flex-row flex-wrap items-center justify-between gap-2">
							<div className="flex flex-col gap-1">
								<h1 className="truncate text-3xl font-bold text-title">
									{name}
								</h1>
								<div className="flex items-center gap-2 capitalize text-body">
									<Briefcase size={24} />
									<span className="text-lg">{position}</span>
								</div>
							</div>

							{!isOwnProfile ? (
								<div className="flex w-full max-w-[300px] items-center gap-3">
									<Link href={`/messages?userId=${_id}`}>
										<Button
											fullWidth
											variant="secondary"
											size="sm"
										>
											Message
										</Button>
									</Link>
									<Button
										fullWidth
										variant="primary"
										size="sm"
										onClick={() => {
											setIsModalOpen(true);
										}}
									>
										Invite to Job
									</Button>
								</div>
							) : (
								<div className="ml-auto flex w-full max-w-[300px] flex-row items-center justify-end">
									<Link href="/settings">
										<Button fullWidth variant="secondary">
											<span className="flex flex-row gap-2">
												<Edit size={24} />
												Edit Profile
											</span>
										</Button>
									</Link>
								</div>
							)}
						</div>
					</div>

					<div className="flex h-fit flex-wrap gap-2 pt-4">
						{skills.map((skill, i) => (
							<span
								key={i}
								className="rounded-full bg-white px-6 py-1.5 text-sm font-medium capitalize text-[#090A0A]"
								style={{
									backgroundColor: skill.backgroundColor,
								}}
							>
								{skill.name}
							</span>
						))}
					</div>
				</div>
			</div>
		</>
	);
};
