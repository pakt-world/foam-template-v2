"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { Search } from "lucide-react";

export const ChatListSearch = (): ReactElement => {
    return (
        <div className="relative flex items-center gap-2 p-4 py-4">
            <div className="absolute left-6">
                <Search size={18} className="text-body" />
            </div>
            <input
                type="text"
                className="w-full resize-none rounded-lg border bg-gray-50 px-2 py-2 pl-8 focus:outline-none"
                placeholder="Search"
            />
        </div>
    );
};
