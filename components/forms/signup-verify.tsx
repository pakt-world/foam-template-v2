"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type * as z from "zod";
import { useEffect, useState } from "react";
import { setCookie } from "cookies-next";
import { Button } from "pakt-ui";
import ReactOTPInput from "react-otp-input";
import { useSearchParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm, Controller } from "react-hook-form";
import { Timer } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useVerifyEmail, useResendOTP } from "@/lib/api";
import { formatCountdown, AUTH_TOKEN_KEY } from "@/lib/utils";
import { Spinner } from "@/components/common";
import { useUserState } from "@/lib/store/account";
import { otpSchema } from "@/lib/validations";

type FormValues = z.infer<typeof otpSchema>;

const SignupVerificationForm = (): React.JSX.Element => {
    const { setUser } = useUserState();
    const [countdown, setCountdown] = useState(0);
    const [isResendDisabled, setIsResendDisabled] = useState(true);

    const router = useRouter();
    const resendOTP = useResendOTP();
    const verifyEmail = useVerifyEmail();
    const searchParams = useSearchParams();

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

    const form = useForm<FormValues>({
        resolver: zodResolver(otpSchema),
    });

    const onSubmit: SubmitHandler<FormValues> = ({ otp }) => {
        const email = searchParams.get("email");
        const token = searchParams.get("token");

        if (typeof email !== "string" || typeof token !== "string") {
            router.push("/signup");
            return;
        }

        verifyEmail.mutate(
            {
                otp,
                token,
            },
            {
                onSuccess: (data) => {
                    setCookie(AUTH_TOKEN_KEY, data.token);

                    // @ts-expect-error TODO: Fix this
                    setUser(data);
                    router.push("/onboarding");
                },
            },
        );
    };

    const handleResendOTP = (): void => {
        const email = searchParams.get("email");

        if (typeof email !== "string") {
            router.push("/signup");
            return;
        }

        resendOTP.mutate(
            {
                email,
            },
            {
                onSuccess: () => {
                    setIsResendDisabled(true);
                },
            },
        );
    };

    return (
        <form
            className="bg-[rgba(0, 124, 91, 0.20)] relative z-[100] mx-auto flex w-full max-w-[600px] flex-col items-center gap-6 rounded-2xl border border-white border-opacity-20 bg-[rgba(0,124,91,0.20)] px-[40px] py-10 backdrop-blur-md"
            onSubmit={form.handleSubmit(onSubmit)}
        >
            <div className="flex w-fit flex-col gap-4">
                <Controller
                    name="otp"
                    control={form.control}
                    render={({ field: { onChange, value } }) => {
                        return (
                            <ReactOTPInput
                                value={value}
                                onChange={onChange}
                                shouldAutoFocus
                                numInputs={6}
                                containerStyle="gap-3 flex"
                                inputStyle={{
                                    width: "46px",
                                    height: "46px",
                                    borderRadius: "4px",
                                    border: "1px solid #D0DDD5",
                                }}
                                renderInput={(props) => (
                                    <input
                                        {...props}
                                        className="w-full !select-none rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                )}
                            />
                        );
                    }}
                />

                <Button fullWidth disabled={verifyEmail.isLoading || !form.formState.isValid}>
                    {verifyEmail.isLoading ? <Spinner /> : "Verify Email"}
                </Button>

                <div className="flex w-full flex-col items-center gap-4">
                    <span className="text-white">{formatCountdown(countdown)}</span>
                    <div className="w-full max-w-[150px]">
                        <Button
                            size="xs"
                            fullWidth
                            variant="outline"
                            onClick={!(resendOTP.isLoading || isResendDisabled) ? handleResendOTP : () => {}}
                            disabled={resendOTP.isLoading || isResendDisabled}
                            className="!border-white !text-white"
                            style={{ opacity: resendOTP.isLoading || isResendDisabled ? 0.2 : 1 }}
                        >
                            <span className="flex flex-row gap-2">
                                <Timer size={16} className="text-white" />
                                {resendOTP.isLoading ? <Spinner size={16} /> : "Resend Code"}
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default SignupVerificationForm;
