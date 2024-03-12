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
import { useGetAccount } from "@/lib/api/account";

export const ActivateAuthAppSuccess = (): React.JSX.Element => {
	const { closeModal } = useAuthApp2FAState();
	const { refetch: fetchAccount, isFetching } = useGetAccount();
	const Close = async (): Promise<void> => {
		if (!isFetching) void fetchAccount();
		closeModal();
	};
	return (
		<div className="flex w-full shrink-0 flex-col items-center">
			<div className="flex w-full flex-row justify-between">
				<Text.h3 size="xs">Authenticator App</Text.h3>
				<XCircleIcon
					className="my-auto cursor-pointer text-body"
					onClick={Close}
				/>
			</div>

			<Image
				src="/icons/success.gif"
				className="my-auto"
				width={230}
				height={230}
				alt=""
			/>
			<Text.p size="base" className="text-center">
				You have successfully secured your account with 2FA. You will
				input your Authentication App’s generated code each time you
				want to login or make a withdrawal.
			</Text.p>
			<Button className="mt-auto w-full" onClick={Close} fullWidth>
				Done
			</Button>
		</div>
	);
};
