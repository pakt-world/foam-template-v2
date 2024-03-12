"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Image from "next/image";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type LeaderBoardItemProps } from "./types";
import { truncate } from "@/lib/utils";
import { AfroProfile } from "../../common/afro-profile";

export const FirstPlace = ({
	_id,
	name,
	score,
	avatar,
}: LeaderBoardItemProps): React.ReactElement => {
	return (
		<div className="relative">
			<svg
				fill="none"
				preserveAspectRatio="xMaxYMid meet"
				viewBox="0 0 247 68"
			>
				<path
					fill="url(#paint0_linear_4642_135011)"
					d="M246.5 18.755v31.49c0 7.796-5.8 14.238-13.556 14.738C216.244 66.06 182.83 67.5 123.5 67.5c-59.33 0-92.744-1.44-109.444-2.517C6.3 64.483.5 58.04.5 50.245v-31.49C.5 10.42 7.056 3.585 15.38 3.29 42.27 2.337 97.454.5 123.5.5c26.047 0 81.231 1.837 108.119 2.79 8.325.295 14.881 7.131 14.881 15.465z"
				/>
				<path
					fill="#000"
					fillOpacity="0.2"
					d="M246.5 18.755v31.49c0 7.796-5.8 14.238-13.556 14.738C216.244 66.06 182.83 67.5 123.5 67.5c-59.33 0-92.744-1.44-109.444-2.517C6.3 64.483.5 58.04.5 50.245v-31.49C.5 10.42 7.056 3.585 15.38 3.29 42.27 2.337 97.454.5 123.5.5c26.047 0 81.231 1.837 108.119 2.79 8.325.295 14.881 7.131 14.881 15.465z"
				/>
				<path
					stroke="url(#paint1_linear_4642_135011)"
					d="M246.5 18.755v31.49c0 7.796-5.8 14.238-13.556 14.738C216.244 66.06 182.83 67.5 123.5 67.5c-59.33 0-92.744-1.44-109.444-2.517C6.3 64.483.5 58.04.5 50.245v-31.49C.5 10.42 7.056 3.585 15.38 3.29 42.27 2.337 97.454.5 123.5.5c26.047 0 81.231 1.837 108.119 2.79 8.325.295 14.881 7.131 14.881 15.465z"
				/>
				<defs>
					<linearGradient
						id="paint0_linear_4642_135011"
						x1="0"
						x2="33.857"
						y1="0"
						y2="124.816"
						gradientUnits="userSpaceOnUse"
					>
						<stop stopColor="#FFC462" />
						<stop offset="1" stopColor="#A05E03" />
					</linearGradient>
					<linearGradient
						id="paint1_linear_4642_135011"
						x1="0"
						x2="34.803"
						y1="0"
						y2="126.418"
						gradientUnits="userSpaceOnUse"
					>
						<stop stopColor="#FFC462" />
						<stop offset="1" stopColor="#A05E03" />
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
							src="/icons/medal-1.png"
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
