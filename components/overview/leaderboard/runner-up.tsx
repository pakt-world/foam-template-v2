"use client";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { truncate } from "@/lib/utils";
import { type LeaderBoardItemProps } from "./types";
import { AfroProfile } from "@/components/common/afro-profile";

export const RunnerUp = ({ _id, name, score, avatar, place }: LeaderBoardItemProps): React.ReactElement => {
    return (
        <div className="relative">
            <svg fill="none" preserveAspectRatio="xMaxYMid meet" viewBox="0 0 247 62">
                <path
                    fill="#007C5B"
                    d="M0 16.468C0 7.585 7.198.402 16.08.463 43.22.65 97.673 1 123.5 1c25.828 0 80.281-.35 107.419-.537C239.802.403 247 7.585 247 16.468V45.42c0 8.797-7.076 15.936-15.873 15.962-17.277.052-50.402.118-107.627.118-57.225 0-90.35-.066-107.627-.118C7.076 61.356 0 54.217 0 45.42V16.468z"
                />
            </svg>
            <div className="absolute inset-0 flex items-center gap-2 p-3 pl-1">
                <AfroProfile src={avatar} score={Math.round(score)} size="sm" url={`talents/${_id}`} />
                <div className="grow">
                    <span className="text-base text-[#ECFCE5] ">{truncate(name, 15)}</span>
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-sm text-[#F2F4F5]">Afroscore: {Math.round(score)}</span>
                        <span className="text-sm text-[#CDCFD0]">{place}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
