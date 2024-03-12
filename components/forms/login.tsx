"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type * as z from "zod";
import Link from "next/link";
import { Input, Button, PasswordInput } from "pakt-ui";
import { setCookie } from "cookies-next";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { createQueryStrings, AUTH_TOKEN_KEY } from "@/lib/utils";
import { useLogin } from "@/lib/api";
import { Spinner } from "@/components/common";
import { useUserState } from "@/lib/store/account";
import { loginSchema } from "@/lib/validations";

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = (): React.JSX.Element => {
	const login = useLogin();
	const router = useRouter();
	const { setUser } = useUserState();

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit: SubmitHandler<LoginFormValues> = (values) => {
		login.mutate(values, {
			onSuccess: (data) => {
				if (!data.isVerified) {
					router.push(
						`/signup/verify?${createQueryStrings([
							{ name: "email", value: data.email },
							{
								name: "token",
								value: data.tempToken?.token ?? "",
							},
							{ name: "verifyType", value: "email" },
						])}`,
					);
					return;
				}
				if (data.twoFa?.status) {
					router.push(
						`/login/verify?${createQueryStrings([
							{
								name: "token",
								value: data.tempToken?.token ?? "",
							},
							{ name: "verifyType", value: "2fa" },
							{ name: "type", value: data.twoFa.type },
						])}`,
					);
					return;
				}
				setUser(data);
				setCookie(AUTH_TOKEN_KEY, data.token);
				router.push("/overview");
			},
		});
	};

	return (
		<form
			method="post"
			onSubmit={form.handleSubmit(onSubmit)}
			className="mx-auto flex w-full max-w-[600px] flex-col items-center gap-6 rounded-2xl border border-white border-opacity-20 bg-primary bg-opacity-20 px-[40px] py-10 backdrop-blur-md"
		>
			<div className="flex w-full flex-col gap-4">
				<div className="flex flex-col gap-2">
					<label htmlFor="email" className="text-sm text-white">
						Email Address
					</label>

					<Input
						{...form.register("email")}
						className=""
						placeholder="Email Address"
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label htmlFor="email" className="text-sm text-white">
						Password
					</label>
					<PasswordInput
						{...form.register("password")}
						className=""
						placeholder="Password"
					/>
				</div>

				<div className="flex items-center justify-end">
					<Link
						href="/forgot-password"
						className="text-sm text-white"
					>
						Forgot Password?
					</Link>
				</div>
			</div>

			<Button
				fullWidth
				disabled={!form.formState.isValid || login.isLoading}
			>
				{login.isLoading ? <Spinner /> : "Login"}
			</Button>
		</form>
	);
};

export default LoginForm;
