"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { PageLoading } from "@/components/common/page-loading";

export default function Home(): React.JSX.Element {
    const router = useRouter();

    React.useEffect(() => {
        router.replace("/overview");
    }, [router]);

    return <PageLoading />;
}
