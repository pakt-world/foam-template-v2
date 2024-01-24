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

export const ThirdPlace = ({ _id, name, score, avatar }: LeaderBoardItemProps): React.ReactElement => {
    return (
        <div className="relative">
            <svg fill="none" preserveAspectRatio="xMaxYMid meet" viewBox="0 0 247 67">
                <path
                    fill="url(#paint0_linear_4642_135039)"
                    d="M.5 18.755C.5 10.42 7.056 3.585 15.38 3.29 42.27 2.337 97.454.5 123.5.5c26.047 0 81.231 1.837 108.119 2.79 8.325.295 14.881 7.131 14.881 15.465v30.993c0 8-6.076 14.572-14.05 14.942-16.867.782-50.207 1.81-108.95 1.81s-92.083-1.028-108.95-1.81C6.576 64.32.5 57.75.5 49.748V18.755z"
                />
                <path
                    fill="#000"
                    fillOpacity="0.2"
                    d="M.5 18.755C.5 10.42 7.056 3.585 15.38 3.29 42.27 2.337 97.454.5 123.5.5c26.047 0 81.231 1.837 108.119 2.79 8.325.295 14.881 7.131 14.881 15.465v30.993c0 8-6.076 14.572-14.05 14.942-16.867.782-50.207 1.81-108.95 1.81s-92.083-1.028-108.95-1.81C6.576 64.32.5 57.75.5 49.748V18.755z"
                />
                <path
                    stroke="url(#paint1_linear_4642_135039)"
                    d="M.5 18.755C.5 10.42 7.056 3.585 15.38 3.29 42.27 2.337 97.454.5 123.5.5c26.047 0 81.231 1.837 108.119 2.79 8.325.295 14.881 7.131 14.881 15.465v30.993c0 8-6.076 14.572-14.05 14.942-16.867.782-50.207 1.81-108.95 1.81s-92.083-1.028-108.95-1.81C6.576 64.32.5 57.75.5 49.748V18.755z"
                />
                <defs>
                    <linearGradient
                        id="paint0_linear_4642_135039"
                        x1="9.048"
                        x2="174"
                        y1="65.319"
                        y2="-76"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#055A60" />
                        <stop offset="1" stopColor="#1F3439" />
                    </linearGradient>
                    <linearGradient
                        id="paint1_linear_4642_135039"
                        x1="9.048"
                        x2="22.883"
                        y1="65.319"
                        y2="-19.241"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#1F3439" />
                        <stop offset="1" stopColor="#066066" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex items-center gap-2 p-3 pl-1">
                <AfroProfile src={avatar} score={Math.round(score)} size="sm" url={`talents/${_id}`} />
                <div className="grow">
                    <span className="text-base text-[#ECFCE5]">{truncate(name, 15)}</span>
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-sm text-[#F2F4F5]">Afroscore: {Math.round(score)}</span>
                        <Image src="/icons/medal-3.png" width={28} height={28} alt="" />
                    </div>
                </div>
            </div>
        </div>
    );
};
