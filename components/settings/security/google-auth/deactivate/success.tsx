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

import { useAuthApp2FAState } from "@/lib/store/security";

export const DeactivateAuthAppSuccess = (): React.JSX.Element => {
	const { closeModal } = useAuthApp2FAState();
	return (
		<div className="flex w-full shrink-0 flex-col items-center gap-4">
			<div className="flex flex-row gap-2 text-center">
				<Text.h3 size="xs">Authenticator App</Text.h3>
				<XCircleIcon
					className="my-auto cursor-pointer text-body"
					onClick={closeModal}
				/>
			</div>
			<Text.p size="sm">
				You have successfully deactivated Auth 2FA.
			</Text.p>

			<Image
				src="/icons/success.gif"
				className="my-auto"
				width={200}
				height={200}
				alt=""
			/>

			<Button className="mt-auto w-full" onClick={closeModal} fullWidth>
				Done
			</Button>
		</div>
	);
};
