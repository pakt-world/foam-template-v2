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

import { useEmail2FAState } from "@/lib/store/security";

export const OTPActivateSuccess = (): React.JSX.Element => {
	const { closeModal } = useEmail2FAState();

	return (
		<div className="flex w-full shrink-0 flex-col items-center gap-4">
			<div className="flex w-full flex-row justify-between gap-2 text-center">
				<Text.h3 size="xs">Email Authentication</Text.h3>
				<XCircleIcon
					className="my-auto cursor-pointer text-body"
					onClick={closeModal}
				/>
			</div>
			<Text.p size="sm">
				You have successfully secured your account with 2FA.
			</Text.p>

			<Image
				src="/icons/success.gif"
				className="my-auto"
				width={230}
				height={230}
				alt=""
			/>
			<Button className="w-full" onClick={closeModal} fullWidth>
				Done
			</Button>
		</div>
	);
};
