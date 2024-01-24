"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronUp } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Badge } from "@/components/common";
import { type AchievementType, colorFromScore, emptyAchievement, getAchievementData, limitString } from "@/lib/utils";
import { AfroProfile } from "@/components/common/afro-profile";

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
                <div
                    className="top absolute left-[-20%] top-[-20%] h-[150px] w-[150px] rounded-full"
                    style={{ background: colorCodes.circleColor }}
                />
                <div
                    className="bottom absolute right-[-20%] top-[42%] h-[150px] w-[150px] rounded-full"
                    style={{ background: colorCodes.circleColor }}
                />

                <AfroProfile size="3xl" score={Math.round(Number(score))} src={imageUrl} url={`/talents/${id}`} />

                <div className="absolute bottom-0 -mb-[190px] flex h-full w-full flex-col overflow-hidden duration-200 ease-out hover:mb-[0px]">
                    <div className="relative z-20">
                        <svg
                            preserveAspectRatio="xMaxYMid meet"
                            viewBox="0 0 366 333"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g filter="url(#filter0_b_5263_139566)">
                                <path
                                    d="M0 62.014C0 41.64 0 31.453 6.32938 25.1236C12.6588 18.7942 22.8458 18.7942 43.2197 18.7942H91.4187H120.15C131.242 18.7942 142.108 15.657 151.494 9.74475V9.74475C170.648 -2.32118 195.027 -2.32118 214.181 9.74475V9.74475C223.567 15.657 234.433 18.7942 245.525 18.7942H274.256H322.455C342.829 18.7942 353.016 18.7942 359.345 25.1236C365.675 31.453 365.675 41.64 365.675 62.0139V289.431C365.675 309.805 365.675 319.992 359.345 326.322C353.016 332.651 342.829 332.651 322.455 332.651H43.2197C22.8458 332.651 12.6588 332.651 6.32938 326.322C0 319.992 0 309.805 0 289.431L0 62.014Z"
                                    fill="#FFEDED"
                                    fillOpacity="0.37"
                                />
                                <path
                                    d="M365.405 62.0139V289.431C365.405 299.626 365.404 307.245 364.616 313.107C363.829 318.962 362.261 323.024 359.154 326.131C356.048 329.237 351.986 330.805 346.131 331.592C340.269 332.38 332.65 332.381 322.455 332.381H43.2197C33.0251 332.381 25.4063 332.38 19.5438 331.592C13.6891 330.805 9.62653 329.237 6.52039 326.131C3.41425 323.024 1.84603 318.962 1.05889 313.107C0.270697 307.245 0.270123 299.626 0.270123 289.431V62.014C0.270123 51.8193 0.270697 44.2005 1.05889 38.338C1.84603 32.4833 3.41425 28.4207 6.52039 25.3146C9.62653 22.2084 13.6891 20.6402 19.5438 19.8531C25.4063 19.0649 33.0251 19.0643 43.2197 19.0643H91.4187H120.15C131.293 19.0643 142.209 15.9127 151.638 9.9733C170.704 -2.0372 194.971 -2.0372 214.037 9.9733C223.466 15.9127 234.382 19.0643 245.525 19.0643H274.256H322.455C332.65 19.0643 340.269 19.0649 346.131 19.8531C351.986 20.6402 356.048 22.2084 359.154 25.3146C362.261 28.4207 363.829 32.4833 364.616 38.338C365.404 44.2005 365.405 51.8193 365.405 62.0139Z"
                                    stroke="url(#paint0_linear_5263_139566)"
                                    strokeWidth="0.540247"
                                />
                            </g>
                            <defs>
                                <filter
                                    id="filter0_b_5263_139566"
                                    x="-59.4271"
                                    y="-58.7318"
                                    width="484.529"
                                    height="450.81"
                                    filterUnits="userSpaceOnUse"
                                    colorInterpolationFilters="sRGB"
                                >
                                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                    <feGaussianBlur in2="SourceAlpha" in="BackgroundImageFix" stdDeviation="25" />
                                    <feComposite
                                        in="SourceAlpha"
                                        in2="BackgroundImageFix"
                                        operator="in"
                                        result="effect1_backgroundBlur_5263_139566"
                                    />
                                    <feBlend
                                        mode="normal"
                                        in="SourceGraphic"
                                        in2="effect1_backgroundBlur_5263_139566"
                                        result="shape"
                                    />
                                </filter>
                                <linearGradient
                                    id="paint0_linear_5263_139566"
                                    x1="3.98466e-05"
                                    y1="8.71604"
                                    x2="375.526"
                                    y2="79.6783"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop stopColor="white" />
                                    <stop offset="0.536458" stopOpacity="0" />
                                    <stop offset="1" stopColor="white" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute top-[3px] mx-auto flex w-full justify-center">
                            <ChevronUp className="z-[500] mx-auto -mt-[3px] text-primary" size={25} strokeWidth={1.5} />
                        </div>
                        <div
                            className="absolute top-[5%] h-full w-full rounded-3xl"
                            style={{ fill: "rgba(255, 237, 237, 0.37)", backdropFilter: "blur(29px)" }}
                        >
                            <div className="relative rounded-2xl border-t-0 px-5">
                                <div className="grid grid-rows-3 gap-2">
                                    <span className="my-auto pb-0 pt-3 text-2xl font-semibold capitalize">{name}</span>
                                    <span className="text-base capitalize text-body">{title || ""}</span>
                                    {skills?.length > 0 && (
                                        <div className="flex w-full items-center gap-2">
                                            {skills
                                                ?.slice(0, 3)
                                                .map((skill: { name: string; color: string }, i: number) => {
                                                    const { color, name: n } = skill;
                                                    const s = n || skill;
                                                    return (
                                                        <span
                                                            key={i}
                                                            className="shrink-0 grow items-center gap-2 rounded-3xl px-3 py-1 text-center capitalize"
                                                            style={{ backgroundColor: color ?? "#B2AAE9" }}
                                                        >
                                                            {limitString(s as string)}
                                                        </span>
                                                    );
                                                })}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 flex flex-col gap-2">
                                    <h3 className="text-base font-normal">Achievements</h3>
                                    <div className="grid grid-cols-4 gap-2">
                                        {achievements &&
                                            achievements.length > 0 &&
                                            achievements
                                                .sort(
                                                    (a: Achievement, b: Achievement) =>
                                                        parseFloat(b.total.toString()) - parseFloat(a.total.toString()),
                                                )
                                                .map((a: Achievement, i: number) => {
                                                    const achievM = getAchievementData(a.type);
                                                    return (
                                                        <Badge
                                                            key={i}
                                                            title={achievM?.title}
                                                            value={a?.value}
                                                            total={a?.total}
                                                            textColor={achievM?.textColor}
                                                            bgColor={achievM?.bgColor}
                                                            // type={a.type}
                                                        />
                                                    );
                                                })}
                                        {achievements.length === 0 &&
                                            emptyAchievement.map((a: EmptyAchievementProps, i: number) => (
                                                <Badge
                                                    key={i}
                                                    title={a.title}
                                                    value="0"
                                                    total={a.total}
                                                    textColor={a.textColor}
                                                    bgColor={a.bgColor}
                                                    // type={a.title}
                                                />
                                            ))}
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
