"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { format } from "date-fns";
import { Calendar, Tag } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { AfroProfile } from "@/components/common/afro-profile";
import { sentenceCase } from "@/lib/utils";

interface JobHeaderProps {
    title: string;
    price: number;
    dueDate: string;
    creator?: {
        _id: string;
        name: string;
        score: number;
        avatar?: string;
    };
}

export const JobHeader = ({ title, price, dueDate, creator }: JobHeaderProps): ReactElement => {
    // Handle due date error
    const dueDateError = new Date(dueDate).toString() === "Invalid Date";
    const dueDateValue = dueDateError ? new Date() : new Date(dueDate);
    return (
        <div className="flex items-center justify-between gap-4 rounded-t-xl bg-primary-gradient p-4">
            <div className="flex h-full w-full max-w-2xl flex-col gap-6">
                <div className="grow pt-3">
                    <h2 className="text-3xl font-medium text-white">{title}</h2>
                </div>
                <div className="mt-auto flex items-center gap-4">
                    <span className="flex items-center gap-2 rounded-full bg-[#ECFCE5] px-3 py-1 text-[#198155]">
                        <Tag size={20} />
                        <span>$ {price}</span>
                    </span>

                    <span className="flex items-center gap-2 rounded-full bg-[#C9F0FF] px-3 py-1 text-[#0065D0]">
                        <Calendar size={20} />
                        <span>Due {format(dueDateValue, "MMM dd, yyyy")}</span>
                    </span>
                </div>
            </div>
            {creator?._id && (
                <div className="flex flex-col items-center gap-0 text-center">
                    <AfroProfile
                        src={creator.avatar}
                        size="2md"
                        score={creator.score}
                        url={`/talents/${creator._id}`}
                    />
                    <span className="whitespace-nowrap text-xl font-bold text-white">{creator.name}</span>
                </div>
            )}
        </div>
    );
};

interface JobDescriptionProps {
    description: string;
}

export const JobDescription = ({ description }: JobDescriptionProps): ReactElement => {
    return (
        <div className="flex w-full flex-col gap-2">
            <h3 className="text-lg font-bold text-title">Job Description</h3>
            <p className="rounded-2xl border border-blue-200 bg-[#C9F0FF] p-4 text-lg font-normal text-[#202325]">
                {description}
            </p>
        </div>
    );
};

interface JobSkillsProps {
    skills: Array<{ name: string; color: string }>;
}

export const JobSkills = ({ skills }: JobSkillsProps): ReactElement => {
    return (
        <div className="flex w-full flex-col gap-2 rounded-2xl bg-white pb-4">
            <h3 className="text-lg font-bold text-title">Preferred Skills</h3>
            <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                    <span
                        key={index}
                        className="w-fit whitespace-nowrap rounded-full bg-[#F7F9FA] px-4 py-2 text-[#090A0A]"
                        style={{ background: skill.color }}
                    >
                        {sentenceCase(skill.name)}
                    </span>
                ))}
            </div>
        </div>
    );
};

interface DeliverablesProps {
    deliverables: string[];
}

export const JobDeliverables = ({ deliverables }: DeliverablesProps): ReactElement => {
    return (
        <div className="flex h-full w-full flex-col gap-2 rounded-2xl bg-white py-4">
            <h3 className="text-lg font-bold text-title">Deliverables</h3>

            <div className="flex h-full flex-col gap-4 overflow-y-auto">
                {deliverables.map((deliverable, index) => (
                    <div key={index} className="rounded-md bg-[#F7F9FA] p-4 text-[#090A0A]">
                        {deliverable}
                    </div>
                ))}
            </div>
        </div>
    );
};
