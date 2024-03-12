"use client";

/* eslint-disable react/jsx-pascal-case */
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Text, Button } from "pakt-ui";
import { XCircleIcon } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useDeActivate2FAEmailInitiate } from "@/lib/api/account";
import { useUserState } from "@/lib/store/account";
import { useEmail2FAState } from "@/lib/store/security";
import { Spinner } from "@/components/common/loader";
import { type SlideItemProps } from "@/components/common/slider";

export const InitiateDeactivateOTP = ({
	goToNextSlide,
}: SlideItemProps): React.JSX.Element => {
	const { email } = useUserState();
	const { closeModal } = useEmail2FAState();
	const { mutateAsync, isLoading } = useDeActivate2FAEmailInitiate();

	const handleInitiateOtp = async (): Promise<void> => {
		await mutateAsync();
		goToNextSlide();
	};

	return (
		<div className="flex w-full shrink-0 flex-col items-center gap-8">
			<div className="flex w-full flex-row justify-between gap-2 text-center">
				<Text.h3 size="xs">Deactivate Email OTP</Text.h3>
				<XCircleIcon
					className="my-auto cursor-pointer text-body"
					onClick={closeModal}
				/>
			</div>
			<Text.p size="sm" className="my-auto">
				A code will be sent to{" "}
				<span className="text-success">{email}</span>
			</Text.p>

			<Button onClick={handleInitiateOtp} className="w-full" fullWidth>
				{isLoading ? <Spinner /> : "Send OTP"}
			</Button>
		</div>
	);
};
