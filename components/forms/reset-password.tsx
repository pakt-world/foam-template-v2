"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMemo, useState } from "react";
import Lottie from "lottie-react";
import Link from "next/link";
import { type ReadonlyURLSearchParams, useRouter } from "next/navigation";
import { Button, Input } from "pakt-ui";
import { type SubmitHandler, useForm } from "react-hook-form";
import type * as z from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/common";
import { Container } from "@/components/common/container";
import { useResetPassword } from "@/lib/api";
import { spChars } from "@/lib/utils";
import success from "@/lottiefiles/success.json";
import { resetPasswordSchema } from "@/lib/validations";
import { PasswordCriteria } from "@/components/common/password-criteria";

type ResetFormValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm({
    otp,
    token,
}: {
    searchParams: ReadonlyURLSearchParams;
    otp: string;
    token: string;
}): React.JSX.Element {
    const changePassword = useResetPassword();
    const [isCompleted, _setIsCompleted] = useState(false);
    const loading = changePassword.isLoading;
    const router = useRouter();

    const resetForm = useForm<ResetFormValues>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit: SubmitHandler<ResetFormValues> = (values) => {
        // console.log(values);
        changePassword.mutate(
            { tempToken: token, token: otp, password: values.password },
            {
                onSuccess: () => {},
            },
        );
    };

    const { password } = resetForm.getValues();
    const { confirmPassword } = resetForm.getValues();

    const passwordWatch = resetForm.watch("password");
    const confirmPasswordWatch = resetForm.watch("confirmPassword");

    const validatingErr = useMemo(
        () => ({
            isMinLength: password?.length >= 8 || false,
            checkLowerUpper: (/[A-Z]/.test(password) && /[a-z]/.test(password)) || false,
            checkNumber: !(password?.match(/\d+/g) == null),
            specialCharacter: spChars.test(password) || false,
            confirmedPassword:
                (password === confirmPassword && password !== "" && password !== undefined && password !== null) ||
                false,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [passwordWatch, confirmPasswordWatch],
    );

    // console.log(resetForm.formState.errors);

    return (
        <>
            <Container className="-mt-[2.7rem] flex items-center justify-between">
                <div />
                {!loading && (
                    <Link
                        className="rounded-lg border-2 bg-white !bg-opacity-10 px-5 py-2 text-white duration-200 hover:bg-opacity-30"
                        href="/login"
                    >
                        Login
                    </Link>
                )}
            </Container>
            {!isCompleted && (
                <Container className="flex h-full w-full max-w-2xl flex-col items-center justify-center gap-6">
                    <div className="flex flex-col items-center gap-2 text-center text-white">
                        <h3 className="font-sans text-3xl font-bold">Reset Password</h3>
                        <p className="font-sans text-base">Choose a new password for your account</p>
                    </div>
                    <form
                        onSubmit={resetForm.handleSubmit(onSubmit)}
                        className="bg-[rgba(0, 124, 91, 0.20)] relative z-[100] mx-auto flex w-full max-w-[600px] flex-col items-center gap-6 rounded-2xl border border-white border-opacity-20 bg-[rgba(0,124,91,0.20)] px-[40px] py-10 backdrop-blur-md"
                    >
                        <div className="flex w-full flex-col gap-4">
                            <div className="relative mb-2 flex flex-col gap-2">
                                <label htmlFor="password" className="text-sm text-white">
                                    Create Password
                                </label>
                                <Input
                                    id="password"
                                    {...resetForm.register("password")}
                                    className=""
                                    placeholder="create password"
                                    type="password"
                                />
                                <div className="flex flex-col gap-4 p-4 text-xs text-body">
                                    <PasswordCriteria
                                        isValidated={validatingErr.isMinLength}
                                        criteria="At least 8 characters"
                                        isSignUp
                                    />
                                    <PasswordCriteria
                                        isValidated={validatingErr.checkLowerUpper}
                                        criteria="Upper and lower case characters"
                                        isSignUp
                                    />
                                    <PasswordCriteria
                                        isValidated={validatingErr.checkNumber}
                                        criteria="1 or more numbers"
                                        isSignUp
                                    />
                                    <PasswordCriteria
                                        isValidated={validatingErr.specialCharacter}
                                        criteria="1 or more special characters"
                                        isSignUp
                                    />
                                    <PasswordCriteria
                                        isValidated={validatingErr.confirmedPassword}
                                        criteria="passwords must be match"
                                        isSignUp
                                    />
                                </div>
                            </div>

                            <div className="relative mb-2 flex flex-col gap-2">
                                <label htmlFor="confirmPassword" className="text-sm text-white">
                                    Confirm Password
                                </label>
                                <Input
                                    id="confirmPassword"
                                    {...resetForm.register("confirmPassword")}
                                    className=""
                                    placeholder="re-type password"
                                    type="password"
                                />
                            </div>
                        </div>

                        <Button
                            className=""
                            fullWidth
                            disabled={!resetForm.formState.isValid || changePassword.isLoading}
                        >
                            {changePassword.isLoading ? <Spinner /> : "Reset Password"}
                        </Button>
                    </form>
                </Container>
            )}
            {isCompleted && (
                <Container className="bg-[rgba(0, 124, 91, 0.20)] mx-auto mt-28 flex w-full max-w-xl flex-col items-center justify-center gap-2  rounded-2xl border border-white border-opacity-20 bg-[rgba(0,124,91,0.20)] p-8 px-[40px] py-10 text-center text-white backdrop-blur-lg backdrop-blur-md">
                    <div className="flex w-full max-w-[150px] items-center justify-center">
                        <Lottie animationData={success} />
                    </div>
                    <h6 className="my-4 flex-wrap text-lg font-thin opacity-[0.8]">Password Reset Successful.</h6>
                    <Button
                        className=""
                        fullWidth
                        onClick={() => {
                            router.push("/login");
                        }}
                    >
                        Login
                    </Button>
                </Container>
            )}
        </>
    );
}

export default ResetPasswordForm;
