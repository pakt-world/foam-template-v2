"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { AfroProfile } from "../../common/afro-profile";

interface ChatListItemProps {
    _id: string;
    name: string;
    avatar?: string;
    score?: number;
    time: string;
    chatId: string;
    lastMessage: string;
    unreadCount: number;
}

export const ChatListItem: React.FC<ChatListItemProps> = ({
    _id,
    name,
    avatar,
    score,
    unreadCount,
    lastMessage,
    time,
    chatId,
}) => {
    const pathname = usePathname();
    const urlChatId = pathname.split("/")[2];
    const isActiveChat = urlChatId === chatId;

    return (
        <Link href={`/messages/${chatId}`} className="border-b">
            <div
                className={`flex w-full items-center gap-2 border-l-4 px-3 py-3 duration-200 hover:bg-[#ECFCE5] ${
                    isActiveChat ? "border-primary bg-[#ECFCE5]" : "border-transparent bg-white"
                }`}
            >
                <AfroProfile score={score ?? 0} src={avatar} size="sm" url={`/talents/${_id}`} />
                <div className="flex grow flex-col">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <div className="text-base font-medium text-title">{name}</div>
                            {unreadCount > 0 && (
                                <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-gradient text-xs text-white text-opacity-80">
                                    {unreadCount}
                                </div>
                            )}
                        </div>
                        <div className="text-xs text-body">{time}</div>
                    </div>
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-body">
                        {lastMessage && lastMessage.length > 30 ? `${lastMessage.slice(0, 30)}...` : lastMessage}
                    </div>
                </div>
            </div>
        </Link>
    );
};
