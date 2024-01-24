"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "pakt-ui";
import { type SubmitHandler, useForm } from "react-hook-form";
import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Spinner } from "@/components/common";
import { useRequestPasswordReset } from "@/lib/api";
import { createQueryStrings } from "@/lib/utils";
import { forgotPasswordSchema } from "@/lib/validations";

type FormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm = (): JSX.Element => {
    const router = useRouter();
    const requestPasswordReset = useRequestPasswordReset();

    const form = useForm<FormValues>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit: SubmitHandler<FormValues> = (values) => {
        requestPasswordReset.mutate(values, {
            onSuccess: (data) => {
                router.push(
                    `/forgot-password/reset?${createQueryStrings([
                        {
                            name: "email",
                            value: values.email,
                        },
                        {
                            name: "token",
                            value: data.tempToken.token,
                        },
                    ])}`,
                );
            },
        });
    };

    return (
        <form
            className="bg-[rgba(0, 124, 91, 0.20)] relative z-[100] mx-auto flex w-full max-w-[600px] flex-col items-center gap-6 rounded-2xl border border-white border-opacity-20 bg-[rgba(0,124,91,0.20)] px-[40px] py-10 backdrop-blur-md"
            onSubmit={form.handleSubmit(onSubmit)}
        >
            <div className="relative flex w-full flex-col gap-2">
                <label className="font-sans text-sm text-white" htmlFor="email">
                    Email
                </label>
                <Input {...form.register("email")} placeholder="Email" type="email" className="w-full" id="email" />
            </div>

            <Button fullWidth disabled={!form.formState.isValid || requestPasswordReset.isLoading}>
                {requestPasswordReset.isLoading ? <Spinner /> : "Reset Password"}
            </Button>

            <Link href="/login" className="mt-4 font-sans text-sm text-white">
                Back to login
            </Link>
        </form>
    );
};

export default ForgotPasswordForm;
