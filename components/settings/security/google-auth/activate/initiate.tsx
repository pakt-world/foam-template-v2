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
import { useInitialize2FA } from "@/lib/api/account";
import { TWO_FA_CONSTANTS } from "@/lib/constants";
import { toast } from "@/components/common/toaster";
import { useErrorService } from "@/lib/store/error-service";
import { Spinner } from "@/components/common/loader";
import { type SlideItemProps } from "@/components/common/slider";

export const InitiateAuthApp = ({
	goToNextSlide,
}: SlideItemProps): React.JSX.Element => {
	const { mutateAsync, isLoading } = useInitialize2FA();
	const { setSecret, setQrCode, closeModal } = useAuthApp2FAState();
	const { setErrorMessage } = useErrorService();

	const handleInitiateAuthApp = async (): Promise<void> => {
		try {
			const data = await mutateAsync({
				type: TWO_FA_CONSTANTS.AUTHENTICATOR,
			});
			// console.log(data);
			if (data.qrCodeUrl) {
				setSecret(data?.secret ?? "A5treyQJHS-JHFNKE-OPJ0unekVyt");
				setQrCode(data.qrCodeUrl);
				goToNextSlide();
			} else toast.error("An Error Occurred, Try Again!!!");
		} catch (error) {
			if (error instanceof Error) {
				setErrorMessage({
					title: "handleInitiateAuthApp",
					message: error.message,
				});
			}
		}
	};

	return (
		<div className="flex w-full shrink-0 flex-col items-center gap-14 text-center">
			<div className="flex w-full flex-row justify-between">
				<Text.h3 size="xs">Authenticator App</Text.h3>
				<XCircleIcon
					className="my-auto cursor-pointer text-body"
					onClick={closeModal}
				/>
			</div>
			<Text.p size="base" className="max-w-xs">
				To begin, you will need to install an Authenticator app on your
				phone.
			</Text.p>
			<div className="my-auto flex -translate-x-7 items-center">
				<Image
					src="/icons/authenticator-app.svg"
					width={150}
					height={210}
					alt=""
				/>
			</div>
			<Button
				onClick={handleInitiateAuthApp}
				className="mt-auto w-full"
				fullWidth
			>
				{isLoading ? <Spinner /> : "Next"}
			</Button>
		</div>
	);
};
