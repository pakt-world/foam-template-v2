/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { OverviewHeader } from "@/components/overview/header";
import { JobHeader } from "@/components/overview/header/sub-header";
import { LeaderBoard } from "@/components/overview/leaderboard";
import { Tabs } from "@/components/common/tabs";
import { Feeds } from "@/components/overview/tabs/feeds";
import { Invites } from "@/components/overview/tabs/invites";
import { ActiveJobs } from "@/components/overview/tabs/active-jobs";
import { FeedsBookmark } from "@/components/overview/tabs/bookmark";
import Kyc from "@/components/kyc";

export default function Overview(): React.JSX.Element {
	return (
		<div className="flex h-screen flex-col gap-6 overflow-hidden">
			<div className="flex h-full w-full justify-start gap-6">
				<div className="flex h-full w-full grow flex-col gap-7">
					<OverviewHeader />
					<Kyc />
					<JobHeader />
					<div className="flex flex-1 basis-0 overflow-y-auto">
						<Tabs
							tabs={[
								{
									label: "Your Feed",
									value: "feed",
									content: <Feeds />,
								},
								{
									label: "Active Jobs",
									value: "active",
									content: <ActiveJobs />,
								},
								{
									label: "Invites",
									value: "invites",
									content: <Invites />,
								},
								{
									label: "Bookmarks",
									value: "bookmarks",
									content: <FeedsBookmark />,
								},
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
