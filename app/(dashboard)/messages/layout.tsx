"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import {
	type ReactElement,
	// useState
} from "react";
// import { Button, Slider } from "pakt-ui";
// import { XCircle } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

// import { Spinner } from "@/components/common";
// import { TagInput } from "@/components/common/tag-input";
// import { AfroScore } from "@/components/common/afro-profile";
// import { useGetConnectionPreference, useUpdateConnectionPreference } from "@/lib/api/connection";
import { useMessaging } from "@/providers/socketProvider";
import { ChatList } from "@/components/messages/chat-list/chatlist";
import { ChatListSearch } from "@/components/messages/chat-list/chat-list-search";

interface Props {
	children: React.ReactNode;
}

export default function MessagesLayout({ children }: Props): ReactElement {
	// const [settingsModalOpen, setSettingsModalOpen] = React.useState(false);
	const { conversations, loadingChats } = useMessaging();

	return (
		<div className="flex h-full flex-col gap-0">
			{/* <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Modal isOpen={settingsModalOpen} onOpenChange={setSettingsModalOpen} className="max-w-xl">
            <SettingsModal />
          </Modal>
        </div>
      </div> */}

			<div className="mb-4 flex w-full grow h-[90%]">
				<div className="flex h-full shrink-0 grow-0 basis-[370px] flex-col rounded-lg rounded-r-none border border-line bg-white">
					<ChatListSearch />
					{/* <div className="flex relative items-center gap-2 px-4 pb-6">
            <Button variant={'outline'} className="!px-4 !py-2" onClick={() => setSettingsModalOpen(true)}>
              <span className="flex flex-row text-sm font-bold items-center">
                Set Connection Preference <Settings className="ml-2" size={16} />
              </span>
            </Button>
          </div> */}
					<ChatList
						conversations={conversations}
						loading={loadingChats}
					/>
				</div>

				<div className="flex h-full w-full grow flex-col rounded-lg rounded-l-none border border-l-0 border-line bg-white p-6 pt-3">
					{children}
				</div>
			</div>
		</div>
	);
}

// const SettingsModal = (): React.JSX.Element => {
//     const connectionPreference = useGetConnectionPreference();
//     const updateConnectionPreference = useUpdateConnectionPreference();

//     const [skills, setSkills] = useState<string[]>(connectionPreference.data?.skills ?? []);
//     const [minimumScore, setMinimumScore] = useState<number>(connectionPreference.data?.minimumScore ?? 0);
//     const [minimumSkills, setMinimumSkills] = useState<number>(connectionPreference.data?.minimumSkills ?? 0);

//     const handleMinimumScoreChange = (value: number[]): void => {
//         if (typeof value[0] === "number") {
//             setMinimumScore(value[0]);
//         }
//     };

//     const handleMinimumSkillsChange = (value: number[]): void => {
//         if (typeof value[0] === "number") {
//             setMinimumSkills(value[0]);
//         }
//     };

//     return (
//         <div className="flex flex-col gap-8 rounded-md bg-white p-4">
//             <div className="flex flex-col gap-1">
//                 <div className="flex items-center justify-between">
//                     <div className="text-lg font-bold">Connection Preference Filter</div>
//                     <XCircle size={24} className="text-body" />
//                 </div>
//                 <span className="text-body">Set the criteria for the AfroFund users who can message you.</span>
//             </div>

//             <div className="flex gap-4 rounded-lg border border-[#23C16B] bg-[#F9FFF6] p-4 pb-8">
//                 <div className="flex flex-col gap-5">
//                     <div>
//                         <h3 className="text-lg font-bold">Afroscore</h3>
//                         <span className="text-sm text-body">
//                             Set minimum talent AfroScore required to message you by dragging the slider
//                         </span>
//                     </div>

//                     <Slider
//                         value={[minimumScore]}
//                         onValueChange={handleMinimumScoreChange}
//                         min={0}
//                         max={100}
//                         thumbLabel={minimumScore.toString()}
//                     />
//                 </div>
//                 <div>
//                     <AfroScore size="sm" score={minimumScore} />
//                 </div>
//             </div>

//             <div className="flex flex-col gap-3">
//                 <div>
//                     <h3 className="text-lg font-bold">Set Skills</h3>
//                     <span className="text-body">
//                         Select up to 10 skills. Users will need at least one to reach out.
//                     </span>
//                 </div>
//                 <TagInput tags={skills} setTags={setSkills} className="min-h-[125px] items-start" />
//             </div>

//             <div className="mb-4 flex flex-col gap-3">
//                 <div>
//                     <h3 className="text-body">Set minimum number of these skills a talent must have to message you</h3>
//                 </div>
//                 <Slider
//                     min={0}
//                     max={10}
//                     value={[minimumSkills]}
//                     thumbLabel={minimumSkills.toString()}
//                     onValueChange={handleMinimumSkillsChange}
//                 />
//             </div>

//             <Button
//                 fullWidth
//                 onClick={() => {
//                     updateConnectionPreference.mutate({
//                         skills,
//                         minimumScore,
//                         minimumSkills,
//                     });
//                 }}
//             >
//                 {updateConnectionPreference.isLoading ? <Spinner /> : "Set Preferences"}
//             </Button>
//         </div>
//     );
// };
