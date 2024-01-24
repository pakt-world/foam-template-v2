/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Tabs } from "@/components/common/tabs";
import { ProfileView } from "@/components/settings/profile";
// import { NotificationView } from '@/components/settings/notification';
import { SecurityView } from "@/components/settings/security";

export default function SettingsPage(): JSX.Element {
    return (
        <div className="relative flex h-full flex-col gap-8 overflow-y-auto">
            <Tabs
                tabs={[
                    { label: "Profile", value: "profile", content: <ProfileView /> },
                    { label: "Security", value: "security", content: <SecurityView /> },
                    // { label: 'Notification', value: 'notification', content: <NotificationView /> },
                ]}
            />
        </div>
    );
}
