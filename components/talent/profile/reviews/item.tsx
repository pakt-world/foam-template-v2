"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import Rating from "react-rating";
import { Star } from "lucide-react";
import { format } from "date-fns";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { AfroProfile } from "../../../common/afro-profile";
import { useUserState } from "@/lib/store/account";
import { sentenceCase } from "@/lib/utils";
import { type ReviewProps } from "./types";

export const Review = ({
	body,
	title,
	rating,
	user,
	date,
}: ReviewProps): ReactElement => {
	const { _id: loggedInUser } = useUserState();
	const MAX_LEN = 150;
	const navigateUrl =
		loggedInUser === user._id ? "/profile" : `/talents/${user?._id}`;
	return (
		<div
			className="flex min-h-full w-full cursor-grab select-none flex-col gap-4 rounded-2xl bg-white p-6"
			style={{ maxWidth: "50%" }}
		>
			<div
				className="flex max-w-[100%] flex-1 flex-col gap-4 break-all"
				style={{
					wordWrap: "break-word",
					overflowWrap: "break-word",
					wordBreak: "break-word",
				}}
			>
				<p className="text-xs leading-[18px] tracking-wide text-neutral-400">
					{date && format(new Date(date), "dd MMM, yyyy")}
				</p>
				<h3 className="text-xl font-medium text-title">{title}</h3>
				<p className="max-w-fit text-base font-thin text-body">
					{body.length > MAX_LEN ? `${body.slice(0, 150)}...` : body}
				</p>
			</div>

			<div className="flex items-center justify-between">
				<div className="grid grid-cols-3 gap-2">
					<div className="relative flex">
						<AfroProfile
							size="sm"
							score={user.afroScore as number}
							src={user?.avatar}
							url={navigateUrl}
						/>
					</div>
					<div className="col-span-2 my-auto flex flex-col">
						<span className="text-sm font-medium text-title">
							{user.name}
						</span>
						<span className="text-sm text-body">
							{sentenceCase(user.title)}
						</span>
					</div>
				</div>
				{/* @ts-expect-error --- Types Error */}
				<Rating
					initialRating={rating}
					fullSymbol={<Star fill="#15D28E" color="#15D28E" />}
					emptySymbol={<Star fill="transparent" color="#15D28E" />}
					readonly
				/>
			</div>
		</div>
	);
};
