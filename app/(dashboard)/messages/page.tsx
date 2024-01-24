"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement, useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMessaging } from "@/providers/socketProvider";
import { PageLoading } from "@/components/common/page-loading";

export default function MessagesPage(): ReactElement {
    const { startUserInitializeConversation, startingNewChat } = useMessaging();
    const searchParams = useSearchParams();
    const queryParams = new URLSearchParams(searchParams as unknown as string);
    const userId = queryParams.get("userId");
    const initialized = useRef(false);

    useEffect(() => {
        if (userId && !initialized.current) {
            initialized.current = true;
            void startUserInitializeConversation(userId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    if (startingNewChat) return <PageLoading color="#007C5B" />;

    return (
        <div className="flex h-full w-full items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-2 text-center text-body">
                <MessageCircle size={120} className="text-slate-400" />
                <span>Send private messages to a client or talent</span>
            </div>
        </div>
    );
}
