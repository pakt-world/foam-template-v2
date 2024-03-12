"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { PageLoading } from "@/components/common/page-loading";

export default function Home(): JSX.Element {
	const router = useRouter();

	useEffect(() => {
		router.replace("/overview");
	}, [router]);

	return <PageLoading color="#007C5B" />;
}
