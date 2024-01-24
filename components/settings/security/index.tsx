"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { Text } from "pakt-ui";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { AuthApp2FA } from "./auth-app";
import { Email2FA } from "./email-2fa";
import { useUserState } from "@/lib/store/account";
import { TWO_FA_CONSTANTS } from "@/lib/constants";
import SettingsForm from "@/components/forms/settings";

export const SecurityView = (): ReactElement => {
    const { twoFa } = useUserState();
    const is2FASetUp = (twoFa?.status && twoFa?.type === TWO_FA_CONSTANTS.AUTHENTICATOR) ?? false;
    const isEmailSetUp = (twoFa?.status && twoFa?.type === TWO_FA_CONSTANTS.EMAIL) ?? false;
    const isSecuritySetUp = (twoFa?.status && twoFa?.type === TWO_FA_CONSTANTS.SECURITY_QUESTION) ?? false;

    return (
        <div className="relative flex h-full grow flex-row gap-6 overflow-auto pb-4">
            <SettingsForm />
            <div className="flex h-fit w-3/4 flex-col gap-6 rounded-lg bg-white p-6 ">
                {/* eslint-disable-next-line react/jsx-pascal-case */}
                <Text.h3 size="xs">2FA</Text.h3>

                <div className="flex justify-between gap-5">
                    <AuthApp2FA isEnabled={is2FASetUp} disabled={isSecuritySetUp || isEmailSetUp} />
                    <Email2FA isEnabled={isEmailSetUp} disabled={is2FASetUp || isSecuritySetUp} />
                    {/* <SecurityQuestion2FA isEnabled={isSecuritySetUp} disabled={is2FASetUp || isEmailSetUp} /> */}
                </div>
            </div>
        </div>
    );
};
