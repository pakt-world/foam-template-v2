"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type React from "react";
import Link from "next/link";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { AfroProfile } from "@/components/common/afro-profile";
import { RenderBookMark } from "../../../misc/render-bookmark";

interface OpenJobProps {
	id: string;
	title: string;
	price: number;
	creator: {
		_id: string;
		name: string;
		avatar?: string;
		paktScore: number;
	};
	skills: Array<{
		type: "tags";
		name: string;
		color: string;
	}>;
	isBookmarked?: boolean;
	bookmarkId: string;
	onRefresh?: () => void;
}

export const OpenJobCard: React.FC<OpenJobProps> = ({
	creator,
	price,
	skills,
	title,
	id,
	isBookmarked,
	bookmarkId,
	onRefresh,
}) => {
	return (
		<div className="flex w-full grow flex-col gap-4 rounded-3xl border border-line bg-white p-4">
			<Link href={`/jobs/${id}`} className="flex w-full gap-4">
				<AfroProfile
					src={creator.avatar}
					score={creator.paktScore}
					size="md"
					url={`talents/${creator._id}`}
				/>

				<div className="flex grow flex-col gap-2">
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2">
							<span className="text-lg font-medium text-body">
								{creator.name}
							</span>
							<span className="inline-flex rounded-full bg-[#B2E9AA66] px-3 text-base text-title">
								${price}
							</span>
						</div>
					</div>
					<div className="break-word flex grow items-center text-2xl text-title">
						{title}
					</div>
				</div>
			</Link>
			<div className="mt-auto flex items-center justify-between gap-2">
				<div className="flex flex-wrap items-center gap-2 lg:flex-nowrap">
					{skills.slice(0, 3).map((skill) => (
						<span
							key={skill.name}
							className="min-w-[50px] whitespace-nowrap rounded-full bg-slate-100 px-4 py-0.5 text-sm capitalize last:!max-w-[106px] last:!truncate 2xl:last:!max-w-[166px]"
							style={{ background: skill.color }}
						>
							{skill.name}
						</span>
					))}
				</div>
				<RenderBookMark
					id={id}
					size={20}
					type="collection"
					isBookmarked={isBookmarked}
					bookmarkId={bookmarkId}
					callback={onRefresh}
					useCheck
				/>
			</div>
		</div>
	);
};
