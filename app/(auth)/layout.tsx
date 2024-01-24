"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Link from "next/link";
import Image from "next/image";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Container } from "@/components/common/container";

// import { useEffect } from "react";
// import { getCookie } from "cookies-next";
// import { useRouter } from "next/navigation";

// import { AUTH_TOKEN_KEY } from "@/lib/utils";

interface Props {
    children: React.ReactNode;
}

export default function AuthLayout({ children }: Props): React.JSX.Element {
    // const token = getCookie(AUTH_TOKEN_KEY);
    // const router = useRouter();

    // useEffect(() => {
    //   if (token) {
    //     router.push("/overview");
    //   }
    // }, [])
    return (
        <div className="h-screen w-full overflow-auto">
            <div className="fixed inset-0 bg-auth-gradient" />
            <div className="fixed inset-0 bg-[url(/images/cardboard.png)] opacity-40" />
            <div className="relative flex h-screen w-full flex-col p-5">
                <Container className="mt-16 flex items-center justify-between">
                    <Link className="max-w-[200px]" href="/">
                        <Image src="/images/logo.svg" alt="Logo" width={250} height={60} />
                    </Link>
                </Container>
                {children}
            </div>
        </div>
    );
}
