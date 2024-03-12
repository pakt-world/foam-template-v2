"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Spinner } from "../../common";
import { ChatListItem } from "./chat-list-item";
import { type ConversationProps } from "@/providers/socket-types";

interface ChatListProps {
	conversations: ConversationProps[];
	loading: boolean;
}

export const ChatList = ({
	conversations,
	loading,
}: ChatListProps): ReactElement => {
	return (
		<div className="flex w-full grow flex-col divide-line overflow-y-auto h-full border-t">
			{loading && (
				<div className="flex h-full w-full grow flex-col items-center  justify-center gap-1">
					<Spinner />
				</div>
			)}
			{conversations.map((c: ConversationProps, i: number) => (
				<ChatListItem
					key={i}
					chatId={c?.id}
					_id={c.sender?._id}
					name={`${c?.sender?.firstName} ${c?.sender?.lastName}`}
					avatar={c?.sender?.profileImage?.url}
					score={c?.sender?.score}
					unreadCount={c?.unreadcount}
					lastMessage={c?.lastMessage ?? ""}
					time={c?.lastMessageTime}
					status={c?.sender?.socket?.status}
				/>
			))}
		</div>
	);
};
