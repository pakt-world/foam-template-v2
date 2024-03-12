"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronUp } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Badge } from "@/components/common";
import {
	type AchievementType,
	colorFromScore,
	emptyAchievement,
	getAchievementData,
	limitString,
} from "@/lib/utils";
import { AfroProfile } from "@/components/common/afro-profile";
import { Overlay } from "./overlay";
import Elements from "./elements";

interface Achievement {
	total: number;
	value: string;
	type: AchievementType;
}

interface TalentBoxProps {
	id: string;
	name: string;
	title: string;
	imageUrl?: string;
	score?: string;
	skills: Array<{ name: string; color: string }>;
	achievements: Achievement[];
}

interface EmptyAchievementProps {
	title: string;
	total: number;
	textColor: string;
	bgColor: string;
	type?: string;
}

export const TalentBox = ({
	id,
	name,
	title,
	imageUrl,
	score,
	skills,
	achievements,
}: TalentBoxProps): React.JSX.Element => {
	const colorCodes = colorFromScore(parseInt(score ?? "0", 10));
	return (
		<div
			key={id}
			className="m-0 h-[300px] overflow-hidden rounded-3xl p-0"
			style={{ background: colorCodes.bgColor }}
		>
			<div className="relative z-0 h-full rounded-2xl">
				<Elements colorCodes={colorCodes.circleColor} />

				<AfroProfile
					size="3xl"
					score={Math.round(Number(score))}
					src={imageUrl}
					url={`/talents/${id}`}
				/>

				<div className="absolute bottom-0 -mb-[190px] flex h-full w-full flex-col overflow-hidden duration-200 ease-out hover:mb-[0px]">
					<div className="relative z-20">
						<Overlay />
						<div className="absolute top-[3px] mx-auto flex w-full justify-center">
							<ChevronUp
								className="z-[500] mx-auto -mt-[3px] text-primary"
								size={25}
								strokeWidth={1.5}
							/>
						</div>
						<div
							className="absolute top-[5%] h-full w-full rounded-3xl"
							style={{
								fill: "rgba(255, 237, 237, 0.37)",
								backdropFilter: "blur(29px)",
							}}
						>
							<div className="relative rounded-2xl border-t-0 px-5">
								<div className="grid grid-rows-3 gap-2">
									<span className="my-auto pb-0 pt-3 text-2xl font-semibold capitalize">
										{name}
									</span>
									<span className="text-base capitalize text-body">
										{title || ""}
									</span>
									{skills?.length > 0 && (
										<div className="flex w-full items-center gap-2">
											{skills?.slice(0, 3).map(
												(
													skill: {
														name: string;
														color: string;
													},
													i: number,
												) => {
													const { color, name: n } =
														skill;
													const s = n || skill;
													return (
														<span
															key={i}
															className="shrink-0 grow items-center gap-2 rounded-3xl px-3 py-1 text-center capitalize"
															style={{
																backgroundColor:
																	color ??
																	"#B2AAE9",
															}}
														>
															{limitString(
																s as string,
															)}
														</span>
													);
												},
											)}
										</div>
									)}
								</div>

								<div className="mt-4 flex flex-col gap-2">
									<h3 className="text-base font-normal">
										Achievements
									</h3>
									<div className="grid grid-cols-4 gap-2">
										{achievements &&
											achievements.length > 0 &&
											achievements
												.sort(
													(
														a: Achievement,
														b: Achievement,
													) =>
														parseFloat(
															b.total.toString(),
														) -
														parseFloat(
															a.total.toString(),
														),
												)
												.map(
													(
														a: Achievement,
														i: number,
													) => {
														const achievM =
															getAchievementData(
																a.type,
															);
														return (
															<Badge
																key={i}
																title={
																	achievM?.title
																}
																value={a?.value}
																total={a?.total}
																textColor={
																	achievM?.textColor
																}
																bgColor={
																	achievM?.bgColor
																}
																// type={a.type}
															/>
														);
													},
												)}
										{achievements.length === 0 &&
											emptyAchievement.map(
												(
													a: EmptyAchievementProps,
													i: number,
												) => (
													<Badge
														key={i}
														title={a.title}
														value="0"
														total={a.total}
														textColor={a.textColor}
														bgColor={a.bgColor}
														// type={a.title}
													/>
												),
											)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
