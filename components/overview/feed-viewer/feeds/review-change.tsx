"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React, { type ReactElement } from "react";
import { Button } from "pakt-ui";
import { Briefcase, Star } from "lucide-react";
import Rating from "react-rating";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { RenderBookMark } from "@/components/jobs/job-cards/render-bookmark";
import { AfroProfile } from "@/components/common/afro-profile";
import { ClientJobModal } from "@/components/jobs/job-modals/client";
import { SideModal } from "@/components/common/side-modal";
import { TalentJobModal } from "@/components/jobs/job-modals/talent";
// import { useUserState } from "@/lib/store/account";

interface ReviewChangeProps {
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
    isAccepted: boolean;
    isCreator: boolean;
    rating?: number;
    // close?: (id: string) => void;
}
export const ReviewChangeCard = ({
    id,
    title,
    jobId,
    description,
    creator,
    talent,
    bookmarked,
    bookmarkId,
    isCreator,
    isAccepted,
    rating,
    // close,
}: ReviewChangeProps): ReactElement => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    // const { _id: loggedInUser } = useUserState();
    // console.log("isCreator", isCreator, loggedInUser);
    return (
        <div className="relative z-10 flex h-[174px] w-full gap-4 overflow-hidden rounded-2xl border border-[#FF5247] bg-[#FFF4F4] p-4">
            <AfroProfile
                src={isCreator ? talent.avatar : creator.avatar}
                score={isCreator ? talent.score : creator.score}
                size="lg"
                url={`/talents/${isCreator ? talent._id : creator._id}`}
            />
            <div className="flex w-full flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-title">{title}</h3>
                    {/* {close && (
                        <X
                            size={20}
                            className="cursor-pointer"
                            onClick={() => {
                                close(id);
                            }}
                        />
                    )} */}
                </div>

                <p className="text-body">{description}</p>

                <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {!isAccepted && (
                            <Button
                                size="xs"
                                variant="outline"
                                onClick={() => {
                                    setIsModalOpen(true);
                                }}
                            >
                                View Request
                            </Button>
                        )}
                        {rating && (
                            // @ts-expect-error --- 'Rating' cannot be used as a JSX component. Its type 'typeof Rating' is not a valid JSX element type.
                            <Rating
                                initialRating={rating}
                                fullSymbol={<Star fill="#15D28E" color="#15D28E" />}
                                emptySymbol={<Star fill="transparent" color="#15D28E" />}
                                readonly
                            />
                        )}
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
