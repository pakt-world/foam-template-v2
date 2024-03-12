"use client";

/* eslint-disable react/jsx-pascal-case */
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Image from "next/image";
import { Text, Button } from "pakt-ui";
import { XCircleIcon } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useInitialize2FA } from "@/lib/api/account";
import { useUserState } from "@/lib/store/account";
import { TWO_FA_CONSTANTS } from "@/lib/constants";
import { useEmail2FAState } from "@/lib/store/security";
import { Spinner } from "@/components/common/loader";
import { type SlideItemProps } from "@/components/common/slider";

export const InitiateActivateOTP = ({
	goToNextSlide,
}: SlideItemProps): React.JSX.Element => {
	const { email } = useUserState();
	const { closeModal } = useEmail2FAState();
	const { mutateAsync, isLoading } = useInitialize2FA();

	const handleInitiateOtp = async (): Promise<void> => {
		await mutateAsync({ type: TWO_FA_CONSTANTS.EMAIL });
		goToNextSlide();
	};

	return (
		<div className="flex w-full shrink-0 flex-col items-center justify-center gap-8 p-6">
			<div className="flex w-full flex-row justify-between gap-2 text-center">
				<Text.h3 size="xs">Email Authentication</Text.h3>
				<XCircleIcon
					className="my-auto cursor-pointer text-body"
					onClick={closeModal}
				/>
			</div>

			<Text.p size="base">
				A code will be sent to{" "}
				<span className="text-success">{email}</span>
			</Text.p>
			<div className="m-auto flex items-center">
				<Image
					src="/icons/email-auth.svg"
					width={150}
					height={210}
					alt=""
				/>
			</div>

			<Button onClick={handleInitiateOtp} className="w-full" fullWidth>
				{isLoading ? <Spinner /> : "Send Code"}
			</Button>
		</div>
	);
};
