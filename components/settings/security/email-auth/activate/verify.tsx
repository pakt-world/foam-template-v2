"use client";

/* eslint-disable react/jsx-pascal-case */
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Text, Button } from "pakt-ui";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { ChevronLeft, Timer, XCircleIcon } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useActivate2FA, useInitialize2FA } from "@/lib/api/account";
import { useUserState } from "@/lib/store/account";
import { TWO_FA_CONSTANTS } from "@/lib/constants";
import { useEmail2FAState } from "@/lib/store/security";
import { Spinner } from "@/components/common/loader";
import { type SlideItemProps } from "@/components/common/slider";
import { InputErrorMessage } from "@/components/common/InputErrorMessage";
import { OtpInput } from "@/components/common/otp-input";
import { formatCountdown } from "@/lib/utils";

const otpSchema = z.object({
	otp: z.string().min(6).max(6),
});

type EmailOtpFormValues = z.infer<typeof otpSchema>;

export const VerifyActivateOTP = ({
	goToNextSlide,
	goToPreviousSlide,
}: SlideItemProps): React.JSX.Element => {
	const [countdown, setCountdown] = useState(0);
	const [isResendDisabled, setIsResendDisabled] = useState(true);
	const { email } = useUserState();
	const { mutateAsync, isLoading } = useActivate2FA();
	const { closeModal } = useEmail2FAState();
	const initiate = useInitialize2FA();

	const handleInitiateOtp = async (): Promise<void> => {
		await initiate.mutateAsync({ type: TWO_FA_CONSTANTS.EMAIL });
		setIsResendDisabled(true);
	};

	// TODO:: move to a useCountdown timer react-hook
	useEffect(() => {
		if (isResendDisabled) {
			setCountdown(60);
			const timer = setInterval(() => {
				setCountdown((prev) => (prev > 1 ? prev - 1 : 0));
			}, 1000);
			setTimeout(() => {
				setIsResendDisabled(false);
			}, 60000);

			return () => {
				clearInterval(timer);
			};
		}
		return () => {};
	}, [isResendDisabled]);

	const {
		handleSubmit,
		formState: { errors },
		control,
	} = useForm<EmailOtpFormValues>({
		resolver: zodResolver(otpSchema),
	});

	const onSubmit: SubmitHandler<EmailOtpFormValues> = async ({ otp }) => {
		await mutateAsync({ code: otp });
		goToNextSlide();
	};

	return (
		<div className="flex w-full shrink-0 flex-col items-center gap-8">
			<div className="flex w-full flex-col gap-2 text-center">
				<div className="flex w-full flex-row justify-between">
					<ChevronLeft
						className="cursor-pointer"
						onClick={goToPreviousSlide}
					/>
					<Text.h3 size="xs">Email Authentication</Text.h3>
					<XCircleIcon
						className="my-auto cursor-pointer text-body"
						onClick={closeModal}
					/>
				</div>
				<Text.p size="base">
					Enter the 6 digit code sent to{" "}
					<span className="text-success">{email}</span>
				</Text.p>
			</div>

			<form
				className="flex w-full flex-col items-center gap-8"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="relative">
					<Controller
						name="otp"
						control={control}
						render={({ field: { onChange, value } }) => (
							<OtpInput
								value={value}
								onChange={onChange}
								numInputs={6}
							/>
						)}
					/>
					<div className="my-2 flex justify-center text-center">
						<InputErrorMessage message={errors.otp?.message} />
					</div>
				</div>

				<Button className="w-full" fullWidth>
					{isLoading ? <Spinner /> : "Confirm"}
				</Button>
			</form>
			<Text.p>{formatCountdown(countdown)}</Text.p>
			<Button
				variant="outline"
				className="!rounded-xl !border-body"
				size="xs"
				disabled={isResendDisabled}
				onClick={handleInitiateOtp}
			>
				<div className="flex flex-row gap-2">
					<Timer size={15} /> Resend Code
				</div>
			</Button>
		</div>
	);
};
