/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Tabs } from "@/components/common/tabs";
import { Feeds } from "@/components/overview/feeds";
import { Header } from "@/components/overview/header";
import { LeaderBoard } from "@/components/overview/leaderboard";
import { Invites } from "@/components/overview/invites";
import { ActiveJobs } from "@/components/overview/active-jobs";
import { FeedsBookmark } from "@/components/overview/bookmark";
import { JobHeader } from "@/components/overview/job-header";

export default function Overview(): React.JSX.Element {
    return (
        <div className="flex h-screen flex-col gap-6 overflow-hidden">
            <div className="flex h-full w-full justify-start gap-6">
                <div className="flex h-full w-full grow flex-col gap-7">
                    <Header />
                    <JobHeader />
                    <div className="flex flex-1 basis-0 overflow-y-auto">
                        <Tabs
                            tabs={[
                                { label: "Your Feed", value: "feed", content: <Feeds /> },
                                { label: "Active Jobs", value: "active", content: <ActiveJobs /> },
                                { label: "Invites", value: "invites", content: <Invites /> },
                                { label: "Bookmarks", value: "bookmarks", content: <FeedsBookmark /> },
                            ]}
                        />
                    </div>
                </div>

                <div className="xw-fit flex min-h-full w-full shrink-0 basis-[270px] flex-col items-center overflow-y-auto">
                    <div className="scrollbar-hide flex w-full flex-1 basis-0 flex-col gap-2 overflow-y-auto">
                        <LeaderBoard />
                    </div>
                </div>
            </div>
        </div>
    );
}
