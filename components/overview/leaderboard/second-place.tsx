"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Image from "next/image";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type LeaderBoardItemProps } from "./types";
import { AfroProfile } from "../../common/afro-profile";
import { truncate } from "@/lib/utils";

export const SecondPlace = ({
	_id,
	name,
	score,
	avatar,
}: LeaderBoardItemProps): React.ReactElement => {
	return (
		<div className="relative">
			<svg
				preserveAspectRatio="xMaxYMid meet"
				viewBox="0 0 247 67"
				fill="none"
			>
				<path
					d="M0.5 18.7546C0.5 10.4214 7.05636 3.5854 15.3806 3.29023C42.2689 2.33681 97.4527 0.5 123.5 0.5C149.547 0.5 204.731 2.33681 231.619 3.29023C239.944 3.5854 246.5 10.4214 246.5 18.7546V49.7477C246.5 57.7489 240.424 64.3204 232.45 64.6902C215.583 65.4723 182.243 66.5 123.5 66.5C64.757 66.5 31.4172 65.4723 14.5498 64.6902C6.576 64.3204 0.5 57.7489 0.5 49.7477V18.7546Z"
					fill="url(#paint0_linear_4642_135026)"
				/>
				<path
					d="M0.5 18.7546C0.5 10.4214 7.05636 3.5854 15.3806 3.29023C42.2689 2.33681 97.4527 0.5 123.5 0.5C149.547 0.5 204.731 2.33681 231.619 3.29023C239.944 3.5854 246.5 10.4214 246.5 18.7546V49.7477C246.5 57.7489 240.424 64.3204 232.45 64.6902C215.583 65.4723 182.243 66.5 123.5 66.5C64.757 66.5 31.4172 65.4723 14.5498 64.6902C6.576 64.3204 0.5 57.7489 0.5 49.7477V18.7546Z"
					fill="black"
					fillOpacity="0.2"
				/>
				<path
					d="M0.5 18.7546C0.5 10.4214 7.05636 3.5854 15.3806 3.29023C42.2689 2.33681 97.4527 0.5 123.5 0.5C149.547 0.5 204.731 2.33681 231.619 3.29023C239.944 3.5854 246.5 10.4214 246.5 18.7546V49.7477C246.5 57.7489 240.424 64.3204 232.45 64.6902C215.583 65.4723 182.243 66.5 123.5 66.5C64.757 66.5 31.4172 65.4723 14.5498 64.6902C6.576 64.3204 0.5 57.7489 0.5 49.7477V18.7546Z"
					fill="black"
					fillOpacity="0.2"
				/>
				<path
					d="M0.5 18.7546C0.5 10.4214 7.05636 3.5854 15.3806 3.29023C42.2689 2.33681 97.4527 0.5 123.5 0.5C149.547 0.5 204.731 2.33681 231.619 3.29023C239.944 3.5854 246.5 10.4214 246.5 18.7546V49.7477C246.5 57.7489 240.424 64.3204 232.45 64.6902C215.583 65.4723 182.243 66.5 123.5 66.5C64.757 66.5 31.4172 65.4723 14.5498 64.6902C6.576 64.3204 0.5 57.7489 0.5 49.7477V18.7546Z"
					stroke="url(#paint1_linear_4642_135026)"
				/>
				<defs>
					<linearGradient
						id="paint0_linear_4642_135026"
						x1="9.04763"
						y1="65.319"
						x2="22.8825"
						y2="-19.2415"
						gradientUnits="userSpaceOnUse"
					>
						<stop stopColor="#BBD2C5" />
						<stop offset="1" stopColor="#536976" />
					</linearGradient>
					<linearGradient
						id="paint1_linear_4642_135026"
						x1="9.04763"
						y1="65.319"
						x2="22.8825"
						y2="-19.2415"
						gradientUnits="userSpaceOnUse"
					>
						<stop stopColor="#BBD2C5" />
						<stop offset="1" stopColor="#536976" />
					</linearGradient>
				</defs>
			</svg>
			<div className="absolute inset-0 flex items-center gap-2 p-3 pl-1">
				<AfroProfile
					src={avatar}
					score={Math.round(score)}
					size="sm"
					url={`talents/${_id}`}
				/>
				<div className="grow">
					<span className="text-base text-[#ECFCE5]">
						{truncate(name, 15)}
					</span>
					<div className="flex items-center justify-between gap-2">
						<span className="text-sm text-[#F2F4F5]">
							Afroscore: {Math.round(score)}
						</span>
						<Image
							src="/icons/medal-2.png"
							width={28}
							height={28}
							alt=""
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
