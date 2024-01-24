"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement, useState } from "react";
import { Button } from "pakt-ui";
import { X, Briefcase } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { RenderBookMark } from "@/components/jobs/job-cards/render-bookmark";
import { AfroProfile } from "@/components/common/afro-profile";
import { ClientJobModal } from "@/components/jobs/job-modals/client";
import { SideModal } from "@/components/common/side-modal";
import { TalentJobModal } from "@/components/jobs/job-modals/talent";

interface ReviewResponseChangeProps {
    id: string;
    title: string;
    description: string;
    talent: {
        _id: string;
        name: string;
        avatar: string;
        score: number;
    };
    creator: {
        _id: string;
        name: string;
        avatar: string;
        score: number;
    };
    bookmarked: boolean;
    bookmarkId: string;
    jobId: string;
    isCreator: boolean;
    isDeclined: boolean;
    close?: (id: string) => void;
}

export const ReviewResponseChangeCard = ({
    id,
    title,
    jobId,
    description,
    creator,
    talent,
    bookmarked,
    bookmarkId,
    isCreator,
    isDeclined,
    close,
}: ReviewResponseChangeProps): ReactElement => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <div
            className={`${
                isDeclined ? "border-[#FF5247] bg-[#FFF4F4]" : "border-[#9BDCFD] bg-[#F1FBFF]"
            } relative z-10 flex h-[174px] w-full gap-4 overflow-hidden rounded-2xl border p-4`}
        >
            <AfroProfile
                src={isCreator ? talent.avatar : creator.avatar}
                score={isCreator ? talent.score : creator.score}
                size="lg"
                url={`/talents/${isCreator ? talent._id : creator._id}`}
            />
            <div className="flex w-full flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-title">{title}</h3>
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

                <p className="text-body">{description}</p>

                <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button
                            size="xs"
                            variant="outline"
                            onClick={() => {
                                setIsModalOpen(true);
                            }}
                        >
                            {isDeclined ? "Review" : "Update"}
                        </Button>
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
