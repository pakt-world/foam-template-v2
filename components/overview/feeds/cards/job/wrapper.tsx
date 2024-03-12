"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactNode, type ReactElement } from "react";
import { Briefcase } from "lucide-react";

export const JobFeedWrapper = ({
	children,
}: {
	children: ReactNode;
}): ReactElement => {
	return (
		<div className="relative z-10 flex h-[174px] w-full gap-4 overflow-hidden rounded-2xl border border-blue-lighter bg-[#F1FBFF] px-4 pl-2">
			{children}

			<div className="absolute right-0 top-16 -z-[1] translate-x-1/3">
				<Briefcase size={200} color="#C9F0FF" />
			</div>
		</div>
	);
};
