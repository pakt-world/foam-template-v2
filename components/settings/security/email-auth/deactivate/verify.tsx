"use client";

/* eslint-disable react/jsx-pascal-case */
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { zodResolver } from "@hookform/resolvers/zod";
import { Text, Button } from "pakt-ui";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { XCircleIcon } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useDeActivate2FA } from "@/lib/api/account";
import { useUserState } from "@/lib/store/account";
import { useEmail2FAState } from "@/lib/store/security";
import { Spinner } from "@/components/common/loader";
import { type SlideItemProps } from "@/components/common/slider";
import { InputErrorMessage } from "@/components/common/InputErrorMessage";
import { OtpInput } from "@/components/common/otp-input";

const otpSchema = z.object({
	otp: z.string().min(6).max(6),
});

type EmailOtpFormValues = z.infer<typeof otpSchema>;

export const VerifyDeactivateOTP = ({
	goToNextSlide,
}: SlideItemProps): React.JSX.Element => {
	const { closeModal } = useEmail2FAState();
	const { mutateAsync, isLoading } = useDeActivate2FA();
	const { email } = useUserState();

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
			<div className="flex w-full flex-row justify-between gap-2 text-center">
				<Text.h3 size="xs">Email</Text.h3>
				<XCircleIcon
					className="my-auto cursor-pointer text-body"
					onClick={closeModal}
				/>
			</div>
			<Text.p size="sm">
				Enter the 6 digit code sent to{" "}
				<span className="text-success">{email}</span>
			</Text.p>

			<form
				className="flex flex-col items-center gap-8"
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
					<InputErrorMessage message={errors.otp?.message} />
				</div>

				<Button className="w-full" fullWidth>
					{isLoading ? <Spinner /> : "Deactivate"}
				</Button>
			</form>
		</div>
	);
};
