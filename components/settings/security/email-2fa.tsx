"use client";

/* eslint-disable react/jsx-pascal-case */
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Button, Checkbox, Text } from "pakt-ui";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { ChevronLeft, Timer, XCircleIcon } from "lucide-react";
// import { useActivateEmailOTP, useDeactivateEmailOTP, useIssueEmailOTP, useSendEmailOTP } from "@/lib/api";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import {
    useActivate2FA,
    useDeActivate2FA,
    useDeActivate2FAEmailInitiate,
    // useGetAccount,
    useInitialize2FA,
} from "@/lib/api/account";
import { useUserState } from "@/lib/store/account";
import { TWO_FA_CONSTANTS } from "@/lib/constants";
import { useEmail2FAState } from "@/lib/store";
import { InputErrorMessage, Modal, OtpInput, type SlideItemProps, Slider, Spinner } from "@/components/common";
import { formatCountdown } from "@/lib/utils";

const InitiateActivateOTP = ({ goToNextSlide }: SlideItemProps): React.JSX.Element => {
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
                <XCircleIcon className="my-auto cursor-pointer text-body" onClick={closeModal} />
            </div>

            <Text.p size="base">
                A code will be sent to <span className="text-success">{email}</span>
            </Text.p>
            <div className="m-auto flex items-center">
                <Image src="/icons/email-auth.svg" width={150} height={210} alt="" />
            </div>

            <Button onClick={handleInitiateOtp} className="w-full" fullWidth>
                {isLoading ? <Spinner /> : "Send Code"}
            </Button>
        </div>
    );
};

const otpSchema = z.object({
    otp: z.string().min(6).max(6),
});

type EmailOtpFormValues = z.infer<typeof otpSchema>;

const VerifyActivateOTP = ({ goToNextSlide, goToPreviousSlide }: SlideItemProps): React.JSX.Element => {
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
                    <ChevronLeft className="cursor-pointer" onClick={goToPreviousSlide} />
                    <Text.h3 size="xs">Email Authentication</Text.h3>
                    <XCircleIcon className="my-auto cursor-pointer text-body" onClick={closeModal} />
                </div>
                <Text.p size="base">
                    Enter the 6 digit code sent to <span className="text-success">{email}</span>
                </Text.p>
            </div>

            <form className="flex w-full flex-col items-center gap-8" onSubmit={handleSubmit(onSubmit)}>
                <div className="relative">
                    <Controller
                        name="otp"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <OtpInput value={value} onChange={onChange} numInputs={6} />
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

const OTPActivateSuccess = (): React.JSX.Element => {
    const { closeModal } = useEmail2FAState();

    return (
        <div className="flex w-full shrink-0 flex-col items-center gap-4">
            <div className="flex w-full flex-row justify-between gap-2 text-center">
                <Text.h3 size="xs">Email Authentication</Text.h3>
                <XCircleIcon className="my-auto cursor-pointer text-body" onClick={closeModal} />
            </div>
            <Text.p size="sm">You have successfully secured your account with 2FA.</Text.p>

            <Image src="/icons/success.gif" className="my-auto" width={230} height={230} alt="" />
            <Button className="w-full" onClick={closeModal} fullWidth>
                Done
            </Button>
        </div>
    );
};

// DEACTIVATION
const InitiateDeactivateOTP = ({ goToNextSlide }: SlideItemProps): React.JSX.Element => {
    const { email } = useUserState();
    const { closeModal } = useEmail2FAState();
    const { mutateAsync, isLoading } = useDeActivate2FAEmailInitiate();

    const handleInitiateOtp = async (): Promise<void> => {
        await mutateAsync();
        goToNextSlide();
    };

    return (
        <div className="flex w-full shrink-0 flex-col items-center gap-8">
            <div className="flex w-full flex-row justify-between gap-2 text-center">
                <Text.h3 size="xs">Deactivate Email OTP</Text.h3>
                <XCircleIcon className="my-auto cursor-pointer text-body" onClick={closeModal} />
            </div>
            <Text.p size="sm" className="my-auto">
                A code will be sent to <span className="text-success">{email}</span>
            </Text.p>

            <Button onClick={handleInitiateOtp} className="w-full" fullWidth>
                {isLoading ? <Spinner /> : "Send OTP"}
            </Button>
        </div>
    );
};

const VerifyDeactivateOTP = ({ goToNextSlide }: SlideItemProps): React.JSX.Element => {
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
                <XCircleIcon className="my-auto cursor-pointer text-body" onClick={closeModal} />
            </div>
            <Text.p size="sm">
                Enter the 6 digit code sent to <span className="text-success">{email}</span>
            </Text.p>

            <form className="flex flex-col items-center gap-8" onSubmit={handleSubmit(onSubmit)}>
                <div className="relative">
                    <Controller
                        name="otp"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <OtpInput value={value} onChange={onChange} numInputs={6} />
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

const OTPDeactivateSuccess = (): React.JSX.Element => {
    const { closeModal } = useEmail2FAState();

    return (
        <div className="flex w-full shrink-0 flex-col items-center gap-4">
            <div className="flex w-full flex-row justify-between gap-2 text-center">
                <Text.h3 size="xs">Email</Text.h3>
                <XCircleIcon className="my-auto cursor-pointer text-body" onClick={closeModal} />
            </div>
            <Text.p size="sm" className="my-auto">
                You have successfully deactivated Email OTP.
            </Text.p>

            <Button className="w-full" onClick={closeModal} fullWidth>
                Done
            </Button>
        </div>
    );
};

interface Email2FAProps {
    isEnabled: boolean;
    disabled?: boolean;
}

export const Email2FA = ({ isEnabled, disabled }: Email2FAProps): React.JSX.Element => {
    const { isModalOpen, closeModal, openModal } = useEmail2FAState();

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
                    <Image src="/icons/email-auth.svg" width={76} height={76} alt="" />
                </div>
                <Text.p size="lg">Email Auth</Text.p>
            </button>

            <Modal isOpen={isModalOpen} onOpenChange={closeModal} className="rounded-2xl bg-white p-6">
                {isEnabled ? (
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
