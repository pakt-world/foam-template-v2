"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement, useState } from "react";
import { Button } from "pakt-ui";
import { X, Briefcase } from "lucide-react";
import Link from "next/link";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { RenderBookMark } from "@/components/jobs/job-cards/render-bookmark";
import { DeliverableProgressBar } from "@/components/common/deliverable-progress-bar";
import { AfroProfile } from "@/components/common/afro-profile";
import { ClientJobModal } from "@/components/jobs/job-modals/client";
import { SideModal } from "@/components/common/side-modal";
import { CheckBox } from "@/components/common/checkBox";
import { TalentJobModal } from "@/components/jobs/job-modals/talent";

interface TalentJobUpdateProps {
    id: string;
    title: string;
    description: string;
    talent: {
        _id: string;
        name: string;
        avatar: string;
        score: number;
    };
    bookmarked: boolean;
    bookmarkId: string;
    jobId: string;
    creator: {
        _id: string;
        name: string;
        avatar: string;
        score: number;
    };
    isCreator: boolean;
    progress: {
        total: number;
        progress: number;
    };
    jobTitle?: string;
    isMarked: boolean;
    close?: (id: string) => void;
}

const MAX_LEN = 150;

export const JobUpdateFeed = ({
    id,
    jobId,
    talent,
    creator,
    title,
    description,
    progress,
    bookmarked,
    bookmarkId,
    isCreator,
    jobTitle,
    isMarked,
    close,
}: TalentJobUpdateProps): ReactElement => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="relative z-10 flex w-full gap-4  overflow-hidden rounded-2xl border border-[#9BDCFD] bg-[#F1FBFF] px-4 pl-2">
            <AfroProfile src={talent.avatar} score={talent.score} size="lg" url={`/talents/${talent._id}`} />
            <div className="flex w-full flex-col gap-4 py-4">
                <div className="flex justify-between">
                    <h3 className="w-[90%] items-center text-xl text-title">
                        {!isCreator
                            ? title
                            : `${talent.name} ${isMarked ? "completed" : "Unchecked"} a deliverable on `}{" "}
                        <span className="font-bold">{jobTitle}</span>
                    </h3>
                    {close && (
                        <X
                            size={20}
                            className="cursor-pointer"
                            onClick={() => {
                                close(id);
                            }}
                        />
                    )}
                </div>
                {/* <p className="text-body">{!isCreator ? description : `✅ ${description}`}</p> */}
                <p className="flex flex-row gap-4 capitalize text-body">
                    {" "}
                    <CheckBox isChecked={isMarked} />{" "}
                    {description.length > MAX_LEN ? `${description.slice(0, MAX_LEN)}...` : description}
                </p>
                <div className="mt-auto flex items-center justify-between">
                    <div className="flex w-full items-center gap-2">
                        {/* {progress.progress === 100 && ( */}
                        <Button
                            size="xs"
                            variant="secondary"
                            onClick={() => {
                                setIsModalOpen(true);
                            }}
                        >
                            See Update
                        </Button>
                        {/* )} */}
                        <Link href={`/messages?userId=${isCreator ? talent._id : creator._id}`}>
                            <Button size="xs" variant="outline">
                                Message
                            </Button>
                        </Link>
                        <DeliverableProgressBar
                            percentageProgress={progress.progress}
                            totalDeliverables={progress.total}
                            className="w-full max-w-[300px]"
                        />
                    </div>
                    <RenderBookMark size={20} isBookmarked={bookmarked} type="feed" id={id} bookmarkId={bookmarkId} />
                </div>
            </div>

            <div className="absolute right-0 top-16 -z-[1] translate-x-1/3">
                <Briefcase size={200} color="#F2F4F5" />
            </div>

            <SideModal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
                {isCreator ? (
                    <ClientJobModal
                        jobId={jobId}
                        talentId={talent._id}
                        closeModal={() => {
                            setIsModalOpen(false);
                        }}
                        extras={id}
                    />
                ) : (
                    <TalentJobModal
                        jobId={jobId}
                        talentId={talent._id}
                        closeModal={() => {
                            setIsModalOpen(false);
                        }}
                        extras={id}
                    />
                )}
            </SideModal>
        </div>
    );
};
