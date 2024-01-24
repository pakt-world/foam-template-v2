"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { AfroProfile } from "@/components/common/afro-profile";
import { sentenceCase } from "@/lib/utils";

export const ChatBoxHeader = ({
    _id,
    title,
    description,
    time,
    score,
    avatar,
}: {
    _id: string;
    title: string;
    description: string;
    time: string;
    score: number;
    avatar: string;
}): ReactElement => {
    return (
        <div className="mb-3 flex items-center justify-between gap-2 border-b border-line pb-3">
            <div className="flex items-center gap-2">
                {/* <div className="h-[50px] flex w-[50px] bg-black rounded-full"></div> */}
                <AfroProfile score={score} src={avatar} size="sm" url={`/talents/${_id}`} />
                <div className="flex flex-col gap-1">
                    <div className="text-lg font-medium leading-none text-title">{title}</div>
                    <div className="text-sm leading-none text-body">{sentenceCase(description)}</div>
                </div>
            </div>
            <div>
                <span className="text-body">Started: {time}</span>
            </div>
        </div>
    );
};
