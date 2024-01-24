"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { axios } from "@/lib/axios";
import { AUTH_TOKEN_KEY } from "@/lib/utils";
import { PageLoading } from "@/components/common/page-loading";

interface Props {
    children: React.ReactNode;
}

function Loader(): React.JSX.Element {
    return (
        <div aria-live="polite" aria-busy="true" className="flex h-screen w-screen items-center justify-center">
            <PageLoading color="#007C5B" />
        </div>
    );
}

export default function OnboardingLayout({ children }: Props): React.JSX.Element {
    const router = useRouter();
    const token = getCookie(AUTH_TOKEN_KEY);
    const [isTokenSet, setIsTokenSet] = useState(false);

    useEffect(() => {
        if (token !== undefined && token !== null && token !== "") {
            setIsTokenSet(true);
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        }
        return () => {
            axios.defaults.headers.common.Authorization = "";
        };
    }, [router, token]);

    if (!isTokenSet) {
        return <Loader />;
    }

    return (
        <div className="h-screen w-screen">
            <div className="relative grow ">
                <div className="fixed inset-0 bg-auth-gradient" />
                <div className="fixed inset-0 bg-[url(/images/cardboard.png)] opacity-40" />

                <div className="relative isolate z-10 flex h-screen w-full flex-col items-center justify-center p-5 px-8">
                    <div className="flex w-full max-w-4xl flex-col gap-4">
                        <div className="mx-auto">
                            <Image src="/images/logo.svg" alt="Logo" width={250} height={60} />
                        </div>
                        <div className="relative w-full rounded-2xl border bg-white p-8">
                            <div className="absolute inset-0 rounded-2xl bg-[url(/images/rain.png)] bg-repeat opacity-50" />
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
