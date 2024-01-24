"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useCallback, useEffect, useState } from "react";
import { Button } from "pakt-ui";
import * as RadixTabs from "@radix-ui/react-tabs";
import { Plus } from "lucide-react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { OpenJobs } from "@/components/jobs/open-jobs";
import { CreatedJobs } from "@/components/jobs/created-jobs";
import { AcceptedJobs } from "@/components/jobs/assigned-jobs";

interface TabTriggerProps {
    value: string;
    label: string;
}

function TabTrigger({ label, value }: TabTriggerProps): React.JSX.Element {
    return (
        <RadixTabs.Trigger
            value={value}
            className="flex items-center justify-center rounded-lg px-6 py-1 duration-200 hover:bg-white radix-state-active:bg-white"
        >
            {label}
        </RadixTabs.Trigger>
    );
}

export default function JobsPage(): React.JSX.Element {
    const router = useRouter();
    const pathname = usePathname();

    const searchParams = useSearchParams();

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams);
            params.set(name, value);
            return params.toString();
        },
        [searchParams],
    );

    const urlTab = searchParams.get("jobs-type");
    const [activeTab, setActiveTab] = useState(urlTab ?? "open");

    const handleTabChange = (value: string): void => {
        setActiveTab(value);
        router.push(`${pathname}?${createQueryString("jobs-type", value)}`);
    };

    useEffect(() => {
        if (urlTab != null) {
            setActiveTab(urlTab);
        }
    }, [urlTab]);

    return (
        <RadixTabs.Root
            value={activeTab}
            defaultValue="open"
            onValueChange={handleTabChange}
            className="flex h-full w-full flex-col gap-4"
        >
            <div className="flex w-full items-center justify-between gap-4">
                <RadixTabs.List className="grid w-fit grid-cols-3 gap-1 rounded-lg bg-[#F0F2F5] p-0.5 text-base text-[#828A9B]">
                    <TabTrigger value="open" label="Open" />
                    <TabTrigger value="created" label="Created" />
                    <TabTrigger value="accepted" label="Accepted" />
                </RadixTabs.List>

                <Button
                    size="sm"
                    onClick={() => {
                        router.push("/jobs/create");
                    }}
                >
                    <div className="flex items-center gap-2">
                        <Plus size={20} />
                        <span>Create Job</span>
                    </div>
                </Button>
            </div>

            <RadixTabs.Content value="open" className="h-full overflow-y-auto">
                <OpenJobs />
            </RadixTabs.Content>
            <RadixTabs.Content value="created" className="h-full">
                <CreatedJobs />
            </RadixTabs.Content>
            <RadixTabs.Content value="accepted" className="h-full">
                <AcceptedJobs />
            </RadixTabs.Content>
        </RadixTabs.Root>
    );
}
