"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
	href: string;
	children: React.ReactNode;
}

export const NavLink: FC<Props> = ({ href, children }) => {
	const pathname = usePathname();
	const parentPath = pathname.split("/")[1];
	const isActive = href.startsWith(`/${parentPath}`);

	return (
		<Link
			href={href}
			className={`flex w-full min-w-[150px] items-center gap-2 rounded-lg px-3 py-2 text-base font-normal text-white duration-200 hover:bg-[#0E936F]
      ${isActive ? "bg-[#0E936F]" : ""}
      `}
		>
			{children}
		</Link>
	);
};
