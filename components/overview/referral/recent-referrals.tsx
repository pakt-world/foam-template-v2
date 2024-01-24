"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { Calendar } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { AfroProfile } from "../../common/afro-profile";

interface RecentReferralProps {
    referral: {
        _id: string;
        name: string;
        title: string;
        score: number;
        image: string;
        dated: string;
    };
}

const RecentReferral = ({ referral }: RecentReferralProps): ReactElement => {
    return (
        <div className="flex w-full flex-row justify-between rounded-2xl border border-refer-border bg-refer-bg px-4 py-2">
            <div className="flex flex-row gap-2">
                <AfroProfile score={referral.score} src={referral.image} size="sm" url={`talents/${referral._id}`} />
                <span className="my-auto items-center">
                    <h3 className="text-lg text-title">{referral.name}</h3>
                    <p className="text-sm text-title">{referral.title}</p>
                </span>
            </div>
            <div className="my-auto flex flex-row gap-2 text-body">
                <Calendar size={24} /> {referral.dated}
            </div>
        </div>
    );
};

export default RecentReferral;
