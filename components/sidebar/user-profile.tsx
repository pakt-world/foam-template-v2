"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { AfroProfile } from "@/components/common/afro-profile";
import { useUserState } from "@/lib/store/account";

export const UserProfile = (): ReactElement => {
    const account = useUserState();

    return (
        <div className="flex flex-col items-center gap-2">
            <AfroProfile score={account?.score ?? 0} size="2xl" src={account?.profileImage?.url} url="/profile" />

            <div className="flex flex-col gap-0 text-center">
                <span className="text-lg">
                    {account?.firstName} {account?.lastName}
                </span>
                <span className="text-sm capitalize text-sky">{account?.profile?.bio?.title}</span>
            </div>
        </div>
    );
};
