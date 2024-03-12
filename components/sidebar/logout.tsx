"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import { LogOut as LogoutIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { AUTH_TOKEN_KEY } from "@/lib/utils";

export const LogOut = (): ReactElement => {
	const router = useRouter();
	const queryClient = useQueryClient();
	return (
		<button
			onClick={() => {
				deleteCookie(AUTH_TOKEN_KEY);
				queryClient.clear();
				router.push("/login");
			}}
			className="flex w-full min-w-[150px] items-center gap-2 rounded-lg px-3 py-2 text-base font-normal text-white duration-200 hover:bg-[#0E936F]"
			type="button"
		>
			<LogoutIcon size={20} />
			<span>Logout</span>
		</button>
	);
};
