"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { Button } from "pakt-ui";
import { X, Briefcase } from "lucide-react";
import Link from "next/link";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { RenderBookMark } from "@/components/jobs/job-cards/render-bookmark";
import { AfroProfile } from "@/components/common/afro-profile";

interface ReferralSignupFeedProps {
    id: string;
    name: string;
    userId: string;
    title?: string;
    description?: string;
    avatar?: string;
    score?: number;
    bookmarkId: string;
    bookmarked: boolean;
    close?: (id: string) => void;
}
export const ReferralSignupFeed = ({
    id,
    title,
    description,
    userId,
    avatar,
    score,
    name,
    bookmarked,
    bookmarkId,
    close,
}: ReferralSignupFeedProps): ReactElement => {
    return (
        <div className="relative z-10 flex h-[174px] w-full gap-4 overflow-hidden rounded-2xl border border-[#CDCFD0] bg-[#F9F9F9] p-4 pl-2">
            <AfroProfile src={avatar} score={Number(score)} size="lg" url={`/talents/${userId}`} />
            <div className="flex w-full flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-title">{title ?? `${name} just signed up`}</h3>
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

                <p className="text-body">
                    {description ??
                        `Your referred user just signed up! Thanks for spreading the word and helping us grow. We appreciate your
          support! 🙌`}
                </p>

                <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href={`/messages?userId=${userId}`}>
                            <Button size="xs" variant="outline">
                                Message
                            </Button>
                        </Link>
                    </div>
                    <RenderBookMark size={20} isBookmarked={bookmarked} type="feed" id={id} bookmarkId={bookmarkId} />
                </div>
            </div>

            <div className="absolute right-0 top-16 -z-[1] translate-x-1/3">
                <Briefcase size={200} color="#F2F4F5" />
            </div>
        </div>
    );
};
