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

import { useAuthApp2FAState, useMscState } from "@/lib/store";
import { Modal, Slider } from "@/components/common";

import { VerifyDeactivateAuthApp } from "./deactivate/verify";
import { DeactivateAuthAppSuccess } from "./deactivate/success";

import { InitiateAuthApp } from "./activate/initiate";
import { ScanAuthApp } from "./activate/scan";
import { VerifyActivateAuthApp } from "./activate/verify";
import { ActivateAuthAppSuccess } from "./activate/success";

interface AuthApp2FAProps {
	isEnabled: boolean;
	disabled?: boolean;
}

export const GoogleAuth2FA = ({
	isEnabled,
	disabled,
}: AuthApp2FAProps): React.JSX.Element => {
	const { isModalOpen, closeModal, openModal } = useAuthApp2FAState();
	const { isInput6DigitCode } = useMscState();
	const [isActive, _setIsActive] = useState(isEnabled);

	useEffect(() => {
		if (!isModalOpen) _setIsActive(isEnabled);
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
						src="/icons/authenticator-app.svg"
						width={76}
						height={76}
						alt=""
					/>
				</div>
				<Text.p size="lg">Authenticator app</Text.p>
			</button>

			<Modal
				isOpen={isModalOpen}
				onOpenChange={closeModal}
				className={`h-fit rounded-2xl bg-white p-6 !overflow-hidden ${
					isInput6DigitCode ? "max-h-[266px]" : "max-h-auto"
				} `}
				disableClickOutside
			>
				{isActive ? (
					<Slider
						items={[
							{ SlideItem: VerifyDeactivateAuthApp },
							{ SlideItem: DeactivateAuthAppSuccess },
						]}
					/>
				) : (
					<Slider
						items={[
							{ SlideItem: InitiateAuthApp },
							{ SlideItem: ScanAuthApp },
							{ SlideItem: VerifyActivateAuthApp },
							{ SlideItem: ActivateAuthAppSuccess },
						]}
					/>
				)}
			</Modal>
		</>
	);
};
