"use client";

/* eslint-disable react/jsx-pascal-case */
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useState } from "react";
import Image from "next/image";
import { Checkbox, Text } from "pakt-ui";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEmail2FAState } from "@/lib/store";
import { Modal, Slider } from "@/components/common";

import { InitiateDeactivateOTP } from "./deactivate/initiate";
import { VerifyDeactivateOTP } from "./deactivate/verify";
import { OTPDeactivateSuccess } from "./deactivate/success";

import { InitiateActivateOTP } from "./activate/initiate";
import { VerifyActivateOTP } from "./activate/verify";
import { OTPActivateSuccess } from "./activate/success";

interface Email2FAProps {
	isEnabled: boolean;
	disabled?: boolean;
}

export const EmailAuth2FA = ({
	isEnabled,
	disabled,
}: Email2FAProps): React.JSX.Element => {
	const { isModalOpen, closeModal, openModal } = useEmail2FAState();
	const [isActive, _setIsActive] = useState(isEnabled);

	useEffect(() => {
		if (!isModalOpen) _setIsActive(isEnabled);
	}, [isEnabled, isModalOpen]);

	return (
		<>
			<button
				onClick={openModal}
				className="relative flex shrink grow basis-0 cursor-pointer flex-col items-center gap-6 rounded-md border-transparent bg-[#F2F2F2] px-7 py-9 disabled:cursor-not-allowed disabled:opacity-[0.5]"
				disabled={disabled}
				type="button"
			>
				<div className="absolute right-4 top-4">
					<Checkbox checked={isEnabled} />
				</div>
				<div className="flex h-[100px] items-center">
					<Image
						src="/icons/email-auth.svg"
						width={76}
						height={76}
						alt=""
					/>
				</div>
				<Text.p size="lg">Email Auth</Text.p>
			</button>

			<Modal
				isOpen={isModalOpen}
				onOpenChange={closeModal}
				className="rounded-2xl bg-white p-6"
			>
				{isActive ? (
					<Slider
						items={[
							{ SlideItem: InitiateDeactivateOTP },
							{ SlideItem: VerifyDeactivateOTP },
							{ SlideItem: OTPDeactivateSuccess },
						]}
					/>
				) : (
					<Slider
						items={[
							{ SlideItem: InitiateActivateOTP },
							{ SlideItem: VerifyActivateOTP },
							{ SlideItem: OTPActivateSuccess },
						]}
					/>
				)}
			</Modal>
		</>
	);
};
