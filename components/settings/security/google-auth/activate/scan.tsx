"use client";

/* eslint-disable react/jsx-pascal-case */
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Image from "next/image";
import { Text, Button } from "pakt-ui";
import { Copy, CopyCheck, XCircleIcon } from "lucide-react";
// import { useActivateAuthApp2FA, useDeactivateAuthApp2FA, useInitializeAuthApp2FA } from "@/lib/api";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useCopyToClipboard } from "usehooks-ts";
import { useAuthApp2FAState } from "@/lib/store/security";
import { type SlideItemProps } from "@/components/common/slider";

export const ScanAuthApp = ({
	goToNextSlide,
}: SlideItemProps): React.JSX.Element => {
	const { secret, qrCode, closeModal } = useAuthApp2FAState();
	const [value, copy] = useCopyToClipboard();
	return (
		<div className="flex w-full shrink-0 flex-col items-center gap-8 text-center">
			<div className="flex w-full flex-row justify-between">
				<Text.h3 size="xs">Authenticator App</Text.h3>
				<XCircleIcon
					className="my-auto cursor-pointer text-body"
					onClick={closeModal}
				/>
			</div>
			<Text.p size="base">
				Scan this QR in your Authenticator application
			</Text.p>
			<Image src={qrCode} width={200} height={200} alt="" />
			<div className="flex flex-col gap-2">
				<Text.p size="sm" className="!text-white">
					Or copy this key
				</Text.p>
				<div className="flex items-center gap-[30px]">
					<p className="text-sm font-bold leading-[21px] tracking-tight text-neutral-600">
						{secret}
					</p>
					<Button
						className="!px-4 !py-2"
						onClick={async () => copy(secret)}
						type="button"
						variant="transparent"
					>
						{value !== null ? (
							<CopyCheck size={14} strokeWidth={2} />
						) : (
							<Copy size={14} strokeWidth={2} />
						)}
					</Button>
				</div>
			</div>
			<Button
				className="mt-auto w-full"
				onClick={goToNextSlide}
				fullWidth
			>
				Next
			</Button>
		</div>
	);
};
