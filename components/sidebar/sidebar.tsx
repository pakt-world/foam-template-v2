/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import Image from "next/image";
import { LayoutDashboard, Users, LayoutList, Wallet, MessageSquare, Settings } from "lucide-react";
import Link from "next/link";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { LogOut } from "./logout";
import { NavLink } from "./nav-link";
import { UserProfile } from "@/components/sidebar/user-profile";
import { useMessaging } from "@/providers/socketProvider";

export const Sidebar = (): ReactElement => {
    const { unreadChatCount } = useMessaging();
    return (
        <div className="px flex h-screen shrink-0 basis-[280px] flex-col gap-6 overflow-y-auto bg-sidebar-gradient px-6 pb-4 pt-6 text-white">
            <div className="flex w-full flex-col items-center">
                <Link href="/profile">
                    <UserProfile />
                </Link>
            </div>
            <div className="border-b border-line opacity-20" />

            <div className="mx-auto flex w-fit flex-col gap-4">
                <NavLink href="/overview">
                    <LayoutDashboard size={20} />
                    <span>Overview</span>
                </NavLink>

                <NavLink href="/jobs">
                    <LayoutList size={20} />
                    <span>Jobs</span>
                </NavLink>

                <NavLink href="/talents">
                    <Users size={20} />
                    <span>Talents</span>
                </NavLink>

                {/* <NavLink href="/projects">
          <Briefcase size={20} />
          <span>Projects</span>
        </NavLink> */}

                <NavLink href="/wallet">
                    <Wallet size={20} />
                    <span>Wallet</span>
                </NavLink>

                <NavLink href="/messages">
                    <MessageSquare size={20} />
                    <span>Messages</span>
                    {unreadChatCount > 0 && (
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ECFCE5] text-xs text-primary text-opacity-80">
                            {unreadChatCount}
                        </div>
                    )}
                </NavLink>

                <NavLink href="/settings">
                    <Settings size={20} />
                    <span>Settings</span>
                </NavLink>
            </div>

            <div className="mx-auto mt-auto">
                <LogOut />
            </div>
            <div className="border-b border-line opacity-20" />
            <Image src="/images/logo.svg" alt="Logo" width={250} height={60} className="mx-auto max-w-[80%]" />
        </div>
    );
};
