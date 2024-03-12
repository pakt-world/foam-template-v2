"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement, useMemo } from "react";
import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useGetAccount, useUpdateAccount } from "@/lib/api/account";
import { Spinner } from "../../common";
import { editProfileFormSchema } from "@/lib/validations";
import ProfileForm from "../../forms/profile";
import BasicInfo from "./basic-info";

export type EditProfileFormValues = z.infer<typeof editProfileFormSchema>;

export const ProfileView = (): ReactElement => {
	const {
		data: userAccount,
		refetch: refetchUser,
		isLoading: accountIsLoading,
	} = useGetAccount();
	const updateAccount = useUpdateAccount();
	const router = useRouter();

	const userData = useMemo(
		() => ({
			...userAccount,
			firstName: userAccount?.firstName ?? "",
			lastName: userAccount?.lastName ?? "",
			title: userAccount?.profile?.bio?.title ?? "",
			bio: userAccount?.profile?.bio?.description ?? "",
			location: userAccount?.profile?.contact?.city ?? "",
			country: userAccount?.profile?.contact?.country ?? "",
			avatar: userAccount?.profileImage?.url ?? "",
			kycVerified: false,
			tags: userAccount?.profile?.talent?.tags ?? [],
			isPrivate: userAccount?.isPrivate ?? false,
		}),
		[userAccount],
	);

	const form = useForm<EditProfileFormValues>({
		resolver: zodResolver(editProfileFormSchema),
		defaultValues: userData,
	});

	const updateAccountFunc = (values: EditProfileFormValues): void => {
		const payload = {
			firstName: values.firstName,
			lastName: values.lastName,
			profile: {
				contact: {
					state: values.location,
					city: values.location,
					country: values.country,
				},
				bio: {
					title: values.title,
					description: values.bio,
				},
				talent: {
					tags: [...(values.tags || [])],
				},
			},
		};
		updateAccount.mutate(
			{ ...payload },
			{
				onSuccess: () => {
					void refetchUser();
					router.push("/profile");
				},
			},
		);
	};

	const toggleUserProfile = (state: string): void => {
		const validState = state === "true";
		form.setValue("isPrivate", validState);
		updateAccountFunc({ ...form.getValues(), isPrivate: validState });
	};

	if (accountIsLoading) return <Spinner />;

	return (
		<div className="relative flex h-full grow flex-row gap-6 overflow-y-auto">
			<BasicInfo
				userData={{ ...userData, email: userData.email ?? "" }}
				form={form}
				toggleUserProfile={toggleUserProfile}
				refetchUser={refetchUser}
			/>
			<ProfileForm form={form} updateAccountFunc={updateAccountFunc} />
		</div>
	);
};
