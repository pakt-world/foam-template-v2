"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "pakt-ui";
import { type SubmitHandler, useForm } from "react-hook-form";
import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { InputErrorMessage, Spinner } from "@/components/common";
import { useSignUp } from "@/lib/api";
import { createQueryStrings, spChars } from "@/lib/utils";
import { signupSchema } from "@/lib/validations";
import { PasswordCriteria } from "@/components/common/password-criteria";

type FormValues = z.infer<typeof signupSchema>;

const SignupForm = (): React.JSX.Element => {
    const signup = useSignUp();

    const router = useRouter();

    const form = useForm<FormValues>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit: SubmitHandler<FormValues> = (values) => {
        signup.mutate(
            { ...values },
            {
                onSuccess: ({ tempToken, email }) => {
                    router.push(
                        `/signup/verify?${createQueryStrings([
                            {
                                name: "email",
                                value: email,
                            },
                            {
                                name: "token",
                                value: tempToken.token,
                            },
                        ])}`,
                    );
                },
            },
        );
    };

    const { password } = form.getValues();
    const { confirmPassword } = form.getValues();

    const passwordWatch = form.watch("password");
    const confirmPasswordWatch = form.watch("confirmPassword");

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

    return (
        <form
            method="post"
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-[rgba(0, 124, 91, 0.20)] relative z-[100] mx-auto flex w-full max-w-[600px] flex-col items-center gap-6 rounded-2xl border border-white border-opacity-20 bg-[rgba(0,124,91,0.20)] px-[40px] py-10 backdrop-blur-md"
        >
            <div className="flex w-full flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="relative mb-2 flex flex-col gap-2">
                        <label htmlFor="firstName" className="text-sm text-white">
                            First Name
                        </label>
                        <Input id="firstName" {...form.register("firstName")} placeholder="First Name" />
                        <InputErrorMessage message={form.formState.errors.firstName?.message} />
                    </div>
                    <div className="relative flex flex-col gap-2">
                        <label htmlFor="lastName" className="text-sm text-white">
                            Last Name
                        </label>
                        <Input id="lastName" {...form.register("lastName")} placeholder="Last Name" />
                        <InputErrorMessage message={form.formState.errors.lastName?.message} />
                    </div>
                </div>

                <div className="relative mb-2 flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm text-white">
                        Email Address
                    </label>
                    <Input id="email" {...form.register("email")} placeholder="Email Address" />
                    <InputErrorMessage message={form.formState.errors.email?.message} />
                </div>

                <div className="relative mb-2 flex flex-col gap-2">
                    <label htmlFor="password" className="text-sm text-white">
                        Create Password
                    </label>
                    <Input
                        id="password"
                        {...form.register("password")}
                        className=""
                        placeholder="Password"
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
                        {...form.register("confirmPassword")}
                        className=""
                        placeholder="Confirm Password"
                        type="password"
                    />
                </div>
            </div>

            <Button className="" fullWidth disabled={!form.formState.isValid || signup.isLoading}>
                {signup.isLoading ? <Spinner /> : "Signup"}
            </Button>
        </form>
    );
};

export default SignupForm;
