"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { Checkbox } from "pakt-ui";

const NotificationTypes = [
    { label: "Account Activity", email: true, browser: true },
    { label: "New Browser Sign in", email: true, browser: true },
    { label: "Withdrawals", email: true, browser: true },
    { label: "Deposits", email: true, browser: true },
    { label: "Payments", email: true, browser: true },
];

export const NotificationView = (): ReactElement => {
    return (
        <div className="flex h-full flex-col">
            <div className="flex flex-col gap-4 rounded-lg bg-white p-4 pb-20">
                <h2 className="text-lg font-bold">Set Notification Preferences</h2>
                <p className="text-sm text-body">We need permissions to show notifications</p>
                <div className="flex flex-col">
                    <div className="flex flex-row px-8 py-4 text-sm text-body">
                        <p className="w-64 flex-1">Type</p>
                        <p className="w-32 flex-initial text-right">EMAIL</p>
                        <p className="w-32 flex-initial text-right">BROWSER</p>
                    </div>
                    {NotificationTypes.map((n, i) => (
                        <div
                            key={i}
                            className={`flex flex-row px-8 py-4 text-base text-title ${
                                i % 2 === 0 ? "bg-preference" : ""
                            }`}
                        >
                            <p className="w-64 flex-1">{n.label}</p>
                            <div className="w-32 flex-initial text-right">
                                <Checkbox checked={n.email} />
                            </div>
                            <div className="w-32 flex-initial text-right">
                                <Checkbox checked={n.browser} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
