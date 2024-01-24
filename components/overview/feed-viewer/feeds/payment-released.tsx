"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "pakt-ui";
import { X, Briefcase } from "lucide-react";
import Link from "next/link";
import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { RenderBookMark } from "@/components/jobs/job-cards/render-bookmark";
import { AfroProfile } from "@/components/common/afro-profile";

interface PaymentReleasedProps {
    id: string;
    amount: string;
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
    close?: (id: string) => void;
}
export const PaymentReleased = ({
    id,
    // @ts-expect-error --- Unused variable
    jobId,
    talent,
    creator,
    title,
    amount,
    // @ts-expect-error --- Unused variable
    description,
    bookmarked,
    bookmarkId,
    isCreator,
    close,
}: PaymentReleasedProps): ReactElement => {
    return (
        <div className="relative z-10 flex w-full gap-4 overflow-hidden rounded-2xl border border-[#7DDE86] bg-[#FBFFFA] px-4 pl-2">
            <AfroProfile
                src={isCreator ? talent.avatar : creator.avatar}
                score={isCreator ? talent.score : creator.score}
                size="lg"
                url={`/talents/${isCreator ? talent._id : creator._id}`}
            />
            <div className="flex w-full flex-col gap-4 py-4">
                <div className="flex w-full items-center justify-between">
                    <h3 className="text-xl font-bold text-body">{isCreator ? "Job Completed" : "Payment Released"}</h3>
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
                <p className="text-3xl text-title">
                    {isCreator ? `${title}` : `$${amount} has been added to Your Wallet! 💰`}
                </p>
                <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/wallet">
                            <Button size="xs" variant="secondary">
                                View Wallet
                            </Button>
                        </Link>
                    </div>
                    <RenderBookMark size={20} isBookmarked={bookmarked} type="feed" id={id} bookmarkId={bookmarkId} />
                </div>
            </div>

            <div className="absolute right-0 top-16 -z-[1] translate-x-1/3">
                <Briefcase size={200} color="#ECFCE5" />
            </div>
        </div>
    );
};
