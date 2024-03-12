"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React, { type FC, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import * as RadixTabs from "@radix-ui/react-tabs";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { createQueryString, cn } from "@/lib/utils";

interface Tab {
	label: string;
	value: string;
	content: React.ReactNode;
}

interface Props {
	tabs: Tab[];
	urlKey?: string;
	defaultTab?: string;
	className?: string;
}

export const Tabs: FC<Props> = ({ tabs, defaultTab, urlKey, className }) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const urlTab = searchParams.get(urlKey ?? "tab");
	const initialTab = urlTab ?? defaultTab ?? tabs[0]?.value;
	const [activeTab, setActiveTab] = React.useState(initialTab);

	const handleTabChange = (value: string): void => {
		setActiveTab(value);
		// update the URL whenever the tab changes
		router.push(`${pathname}?${createQueryString(urlKey ?? "tab", value)}`);
	};

	// update the state whenever the URL changes
	useEffect(() => {
		if (urlTab) {
			setActiveTab(urlTab);
		}
	}, [urlTab]);

	return (
		<RadixTabs.Root
			value={activeTab}
			defaultValue={initialTab}
			onValueChange={handleTabChange}
			className={cn(
				"gap-4relative flex w-full flex-col items-start justify-start",
				className,
			)}
		>
			<RadixTabs.List className="flex w-full items-center border-b">
				{tabs.map((tab) => (
					<RadixTabs.Trigger
						key={tab.value}
						value={tab.value}
						className="min-w-[100px] border-b-2 border-transparent px-8 py-2 text-center text-sm font-medium text-title transition-all duration-200 hover:text-primary radix-state-active:border-primary"
					>
						{tab.label}
					</RadixTabs.Trigger>
				))}
			</RadixTabs.List>
			<div className="scrollbar-hide mt-4 w-full grow overflow-y-auto">
				{tabs.map((tab) => (
					<RadixTabs.Content
						key={tab.value}
						value={tab.value}
						className="w-full grow-0 justify-start overflow-y-auto radix-state-active:flex radix-state-active:h-full radix-state-active:flex-col"
					>
						{tab.content}
					</RadixTabs.Content>
				))}
			</div>
		</RadixTabs.Root>
	);
};
