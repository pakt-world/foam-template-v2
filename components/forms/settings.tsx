"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement, useMemo } from "react";
import { Button, Input } from "pakt-ui";
import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { spChars } from "@/lib/utils";
import { PasswordCriteria } from "@/components/common/password-criteria";
import { changePasswordFormSchema } from "@/lib/validations";
import { useChangePassword } from "@/lib/api/account";
import { Spinner } from "../common";

type EditProfileFormValues = z.infer<typeof changePasswordFormSchema>;

const SettingsForm = (): ReactElement => {
	const changePassword = useChangePassword();

	const form = useForm<EditProfileFormValues>({
		resolver: zodResolver(changePasswordFormSchema),
		reValidateMode: "onChange",
	});

	const onSubmit: SubmitHandler<EditProfileFormValues> = (values) => {
		changePassword.mutate(
			{
				oldPassword: values.currentPassword,
				newPassword: values.newPassword,
			},
			{
				onSuccess: () => {
					form.reset({
						currentPassword: "",
						newPassword: "",
						confirmNewPassword: "",
					});
				},
			},
		);
	};

	const { newPassword } = form.getValues();
	const { confirmNewPassword } = form.getValues();

	const newPasswordWatch = form.watch("newPassword");
	const confirmNewPasswordWatch = form.watch("confirmNewPassword");

	const validatingErr = useMemo(
		() => ({
			isMinLength: newPassword?.length >= 8 || false,
			checkLowerUpper:
				(/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword)) ||
				false,
			checkNumber: !(newPassword?.match(/\d+/g) == null),
			specialCharacter: spChars.test(newPassword) || false,
			confirmedPassword:
				(newPassword === confirmNewPassword &&
					newPassword !== "" &&
					newPassword !== undefined &&
					newPassword !== null) ||
				false,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[newPasswordWatch, confirmNewPasswordWatch],
	);

	return (
		<div className="flex h-fit w-1/4 flex-col rounded-lg bg-white">
			{/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
			<form
				className="flex flex-col gap-4 p-4"
				onSubmit={form.handleSubmit(onSubmit)}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						e.preventDefault();
					}
				}}
			>
				<h3 className="text-lg font-bold">Change Password</h3>
				<Input
					{...form.register("currentPassword")}
					type="password"
					className="w-full !border-[#E8E8E8] !bg-[#FCFCFD]"
					placeholder="enter current password"
					label="Current Password"
				/>
				{form.formState.errors.currentPassword?.message && (
					<span className="text-sm text-red-500">
						{form.formState.errors.currentPassword?.message}
					</span>
				)}
				<Input
					{...form.register("newPassword")}
					type="password"
					className="w-full !border-[#E8E8E8] !bg-[#FCFCFD]"
					placeholder="enter new password"
					label="New Password"
				/>
				<p className="text-sm text-body">Password must contain</p>
				<div className="flex flex-col gap-4 p-4 text-xs text-body">
					<PasswordCriteria
						isValidated={validatingErr.isMinLength}
						criteria="At least 8 characters"
					/>
					<PasswordCriteria
						isValidated={validatingErr.checkLowerUpper}
						criteria="Upper and lower case characters"
					/>
					<PasswordCriteria
						isValidated={validatingErr.checkNumber}
						criteria="1 or more numbers"
					/>
					<PasswordCriteria
						isValidated={validatingErr.specialCharacter}
						criteria="1 or more special characters"
					/>
					<PasswordCriteria
						isValidated={validatingErr.confirmedPassword}
						criteria="Passwords must be match"
					/>
				</div>
				<Input
					{...form.register("confirmNewPassword")}
					type="password"
					className="w-full !border-[#E8E8E8] !bg-[#FCFCFD]"
					placeholder="re-enter new password"
					label="Confirm New Password"
				/>
				{form.formState.errors.confirmNewPassword?.message && (
					<span className="text-sm text-red-500">
						{form.formState.errors.confirmNewPassword?.message}
					</span>
				)}
				<Button
					title="Save Changes"
					variant="secondary"
					size="sm"
					type="submit"
					className="min-w-[136px]"
					disabled={
						!form.formState.isValid || changePassword.isLoading
					}
				>
					{changePassword.isLoading ? <Spinner /> : "Save Changes"}
				</Button>
			</form>
		</div>
	);
};

export default SettingsForm;
