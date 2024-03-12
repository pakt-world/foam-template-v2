"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import { useRouter } from "next/navigation";
import { Button } from "pakt-ui";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type UserProfile } from "@/lib/types";
import { AfroProfile } from "@/components/common/afro-profile";

interface ApplicantCardProps {
	bid: number;
	message?: string;
	talent: UserProfile;
	inviteReceiverId?: string;
}

export const ApplicantCard: FC<ApplicantCardProps> = ({
	bid,
	talent,
	message,
	inviteReceiverId,
}) => {
	const router = useRouter();
	const { firstName, lastName, score, profileImage, profile } = talent;
	const hasBeenInvited = inviteReceiverId === talent._id;

	return (
		<div className="flex w-full flex-col gap-3 rounded-2xl border border-line bg-white p-4">
			<div className="flex w-full gap-4">
				{/* {
          <AfroScore score={score} size="md">
            <div className="h-full w-full rounded-full relative">
              {profileImage?.url ? (
                <Image src={profileImage.url} alt="profile" layout="fill" className="rounded-full" />
              ) : (
                <DefaultAvatar />
              )}
            </div>
          </AfroScore>
        } */}
				<AfroProfile score={score} size="md" src={profileImage?.url} />
				<div className="flex grow flex-col gap-2">
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2">
							<span className="text-lg font-bold text-title">{`${firstName} ${lastName}`}</span>

							{hasBeenInvited && (
								<span className="inline-flex rounded-full border border-green-400 bg-green-50 px-3 text-sm text-green-900">
									Invited
								</span>
							)}
						</div>

						<span className="inline-flex rounded-full bg-[#B2E9AA66] px-3 text-base text-title">
							Bid ${bid}
						</span>
					</div>
					<div className="grow text-lg text-body">{message}</div>
				</div>
			</div>

			<div className="flex items-center justify-between">
				<div className="flex flex-wrap gap-2">
					{profile.talent.tagsIds &&
						profile.talent.tagsIds.length > 0 &&
						profile.talent.tagsIds.slice(0, 3).map((s) => (
							<span
								key={s.color + s.name}
								style={{ background: s.color }}
								className="grow whitespace-nowrap rounded-full bg-green-100 px-4 py-0.5 text-[#090A0A]"
							>
								{s.name}
							</span>
						))}
				</div>
				<div className="flex items-center gap-2">
					<Button
						size="xs"
						variant="secondary"
						onClick={() => {
							router.push(`/messages?userId=${talent._id}`);
						}}
					>
						Message
					</Button>
					<Button
						size="xs"
						variant="outline"
						onClick={() => {
							router.push(`/talents/${talent._id}`);
						}}
					>
						View Profile
					</Button>
				</div>
			</div>
		</div>
	);
};
