"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMemo, useState } from "react";
import Lottie from "lottie-react";
import Link from "next/link";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Container } from "@/components/common/container";
import { useGetSetting } from "@/lib/api/setting";
import { SETTING_CONSTANTS } from "@/lib/constants";
import warning from "@/lottiefiles/warning-2.json";
import SignupForm from "@/components/forms/signup";
import { PageLoading } from "@/components/common/page-loading";
// import { useValidateReferral } from "@/lib/api/referral";

export default function SignupPage(): React.JSX.Element {
    // const validateRef = useValidateReferral();

    const [isLoading, _setIsLoading] = useState(false);
    const [errorMsg, _setErrorMsg] = useState(true);
    const { data: systemSetting, isLoading: settingsLoading } = useGetSetting();
    const loading = settingsLoading || isLoading;

    useMemo(() => {
        if (systemSetting != null) {
            const signupByInviteONly = Boolean(systemSetting[SETTING_CONSTANTS.ALLOW_SIGN_ON_INVITE_ONLY] === "true");
            _setErrorMsg(signupByInviteONly);
        }
    }, [systemSetting]);

    return (
        <>
            <Container className="-mt-[2.7rem] flex items-center justify-between">
                <div />
                {!loading && (
                    <Link
                        className="rounded-lg border-2 bg-white !bg-opacity-10 px-5 py-2 text-white duration-200 hover:bg-opacity-30"
                        href="/login"
                    >
                        Login
                    </Link>
                )}
            </Container>
            {!loading && !errorMsg && (
                <Container className="flex h-full w-full max-w-2xl flex-col items-center justify-center gap-6">
                    <div className="flex flex-col items-center gap-2 text-center text-white">
                        <h3 className="font-sans text-3xl font-bold">Create Your Account</h3>
                        {/* <p className="font-sans text-base">Create Your Account</p> */}
                    </div>
                    <SignupForm />
                </Container>
            )}
            {loading && (
                <div className="flex h-full justify-center text-white">
                    <PageLoading />
                </div>
            )}
            {!loading && errorMsg && (
                <Container className="bg-[rgba(0, 124, 91, 0.20)] mx-auto mt-28 flex w-full max-w-xl flex-col items-center justify-center gap-2  rounded-2xl border border-white border-opacity-20 bg-[rgba(0,124,91,0.20)] p-8 px-[40px] py-10 text-center text-white backdrop-blur-lg backdrop-blur-md">
                    <div className="flex w-full max-w-[150px] items-center justify-center">
                        <Lottie animationData={warning} />
                    </div>
                    <h3 className="text-3xl font-bold">Invalid Referral Code</h3>
                    <h6 className="flex-wrap text-lg font-thin opacity-[0.8]">
                        You need a valid referral code to be able to sign up to Afrofund.{" "}
                    </h6>
                </Container>
            )}
        </>
    );
}
