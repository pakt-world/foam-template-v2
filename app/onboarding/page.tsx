"use client";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Slider } from "@/components/common";
import { Skills } from "@/components/onboarding/skills";
import { UploadProfileImage } from "@/components/onboarding/upload-profile-image";

export default function OnBoardingPage(): React.JSX.Element {
	return (
		<Slider
			items={[{ SlideItem: Skills }, { SlideItem: UploadProfileImage }]}
		/>
	);
}
