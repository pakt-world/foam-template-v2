"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect } from "react";
import type React from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { cn } from "@/lib/utils";
import { useErrorService } from "@/lib/store/error-service";

interface Props {
	className?: string;
	color?: string;
}

export const PageLoading = ({ className, color }: Props): React.JSX.Element => {
	const { setErrorMessage } = useErrorService();
	useEffect(() => {
		async function getLoader(): Promise<void> {
			try {
				const { spiral } = await import("ldrs");
				spiral.register();
			} catch (error) {
				setErrorMessage({
					title: "PageLoading Function Error",
					message: error,
				});
			}
		}
		void getLoader();
	}, [setErrorMessage]);
	return (
		<div
			aria-live="polite"
			aria-busy
			className={cn(
				"flex h-screen w-full items-center justify-center",
				className,
			)}
		>
			<l-zoomies
				size="80"
				stroke="5"
				bg-opacity="0.1"
				speed="1.4"
				// color="#007C5B"
				color={color ?? "#ffffff"}
			/>
		</div>
	);
};
