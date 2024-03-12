"use client";

/* eslint-disable react/jsx-pascal-case */
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useAnswerSecurityQuestion, useGetSecurityQuestions, useSetUserSecurityQuestion } from "@/lib/api";
import Image from "next/image";
import { Button, Checkbox, Input, Select, Text } from "pakt-ui";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { XCircleIcon } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useSecurityQuestion2FAState } from "@/lib/store";
import {
	InputErrorMessage,
	Modal,
	type SlideItemProps,
	Slider,
	Spinner,
} from "@/components/common";
import {
	useActivate2FA,
	useDeActivate2FA,
	useInitialize2FA,
} from "@/lib/api/account";
import { TWO_FA_CONSTANTS } from "@/lib/constants";
import { toast } from "@/components/common/toaster";

const securityQuestionsSchema = z
	.object({
		question: z.string().nonempty("Select a question"),
		answer: z.string().nonempty("Answer cannot be empty"),
		confirmAnswer: z.string().nonempty("Confirm answer cannot be empty"),
	})
	.refine((data) => data.answer === data.confirmAnswer, {
		path: ["confirmAnswer"],
		message: "Answers do not match",
	});

type SecurityQuestionFormValues = z.infer<typeof securityQuestionsSchema>;

// @ts-expect-error --- Unused variable
const InitiateActivateSecurityQuestion = ({
	goToNextSlide,
}: SlideItemProps): React.JSX.Element => {
	const { closeModal } = useSecurityQuestion2FAState();
	const { isLoading } = useInitialize2FA();
	// const { closeModal, setSecurityQuestions } = useSecurityQuestion2FAState();
	// const { mutateAsync, isLoading } = useInitialize2FA();

	const handleInitiateOtp = async (): Promise<void> => {
		// const data = await mutateAsync({ type: TWO_FA_CONSTANTS.SECURITY_QUESTION });
		// if (data.securityQuestions) {
		//   setSecurityQuestions(data.securityQuestions)
		goToNextSlide();
		// }
	};

	return (
		<div className="flex w-full shrink-0 flex-col items-center">
			<div className="flex w-full flex-row justify-between gap-2 text-center">
				<Text.h3 size="xs">Security Question</Text.h3>
				<XCircleIcon
					className="my-auto cursor-pointer text-body"
					onClick={closeModal}
				/>
			</div>

			<Text.p size="base">
				To begin, you will need to select a question from the predefined
				questions.
			</Text.p>
			<div className="m-auto flex items-center">
				<Image
					src="/icons/security-question.svg"
					width={150}
					height={210}
					alt=""
				/>
			</div>

			<Button onClick={handleInitiateOtp} className="w-full" fullWidth>
				{isLoading ? <Spinner /> : "Proceed"}
			</Button>
		</div>
	);
};

const ActivateSecurityQuestion = ({
	goToNextSlide,
}: SlideItemProps): React.JSX.Element => {
	const { isModalOpen, closeModal, securityQuestions, setSecurityQuestions } =
		useSecurityQuestion2FAState();
	const { mutateAsync, isLoading } = useActivate2FA();
	const Initialize = useInitialize2FA();

	const handleInitiateOtp = async (): Promise<void> => {
		if (!Initialize.isLoading) {
			const data = await Initialize.mutateAsync({
				type: TWO_FA_CONSTANTS.SECURITY_QUESTION,
			});
			if (data.securityQuestions) {
				setSecurityQuestions(data.securityQuestions);
			}
		}
	};

	useEffect(() => {
		if (!Initialize.isSuccess) void handleInitiateOtp();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isModalOpen]);

	const questionOptions = useMemo(
		() =>
			(securityQuestions || []).map((s: string) => ({
				label: s,
				value: s,
			})),
		[securityQuestions],
	);

	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
	} = useForm<SecurityQuestionFormValues>({
		resolver: zodResolver(securityQuestionsSchema),
	});

	const onSubmit: SubmitHandler<SecurityQuestionFormValues> = async ({
		answer,
		question,
	}) => {
		await mutateAsync({ code: answer, securityQuestion: question });
		goToNextSlide();
	};

	return (
		<div className="flex w-full shrink-0 flex-col items-center gap-6">
			<div className="flex w-full flex-row justify-between">
				<Text.h3 size="xs">Security Question</Text.h3>
				<XCircleIcon
					className="my-auto cursor-pointer text-body"
					onClick={closeModal}
				/>
			</div>
			<Text.p size="base" className="max-w-sm text-center">
				Choose your security question. It will be asked you want to sign
				in or make a withdrawal.
			</Text.p>
			{Initialize.isLoading ? (
				<Spinner />
			) : (
				<form
					className="flex w-full flex-col gap-6"
					onSubmit={handleSubmit(onSubmit)}
				>
					<div className="relative">
						<Controller
							control={control}
							{...register("question")}
							render={({ field: { onChange } }) => {
								return (
									<Select
										label="Select Question"
										placeholder="Select Question"
										options={questionOptions}
										onChange={(value) => {
											onChange(value);
										}}
									/>
								);
							}}
						/>
						<InputErrorMessage message={errors.question?.message} />
					</div>

					<div className="relative">
						<Input
							label="Enter Answer"
							placeholder=""
							{...register("answer")}
						/>
						<InputErrorMessage message={errors.answer?.message} />
					</div>

					<div className="relative">
						<Input
							label="Confirm Answer"
							placeholder=""
							{...register("confirmAnswer")}
						/>
						<InputErrorMessage
							message={errors.confirmAnswer?.message}
						/>
					</div>

					<Button className="w-full" fullWidth>
						{isLoading ? <Spinner /> : "Set Security Question"}
					</Button>
				</form>
			)}
		</div>
	);
};

const ActivateSecuritySuccess = (): React.JSX.Element => {
	const { closeModal } = useSecurityQuestion2FAState();
	return (
		<div className="flex w-full shrink-0 flex-col items-center">
			<div className="flex w-full flex-row justify-between">
				<Text.h3 size="xs">Security Question</Text.h3>
				<XCircleIcon
					className="my-auto cursor-pointer text-body"
					onClick={closeModal}
				/>
			</div>

			<Image
				src="/icons/success.gif"
				className="my-auto"
				width={230}
				height={230}
				alt=""
			/>
			<Text.p size="base" className="text-center">
				You have successfully secured your account with 2FA.
			</Text.p>
			<Button className="mt-auto w-full" onClick={closeModal} fullWidth>
				Done
			</Button>
		</div>
	);
};

const DeactivateSecurityQuestion = ({
	goToNextSlide,
}: SlideItemProps): React.JSX.Element => {
	const { closeModal } = useSecurityQuestion2FAState();
	const { mutate, isLoading } = useDeActivate2FA();
	// const { refetch: fetchAccount } = useGetAccount();
	const [answer, setAnswer] = useState("");
	// const [_loading, _setLoading] = useState(isLoading);

	const handleDeactivate = async (): Promise<void> => {
		if (!answer || answer === "") {
			toast.error("Answer is required");
			return;
		}
		mutate(
			{ code: answer },
			{
				onSuccess: async () => {
					goToNextSlide();
				},
			},
		);
	};

	return (
		<div className="flex w-full shrink-0 flex-col items-center gap-6">
			<div className="flex w-full flex-row justify-between">
				<Text.h3 size="xs">Deactivate Security Question</Text.h3>
				<XCircleIcon
					className="my-auto cursor-pointer text-body"
					onClick={closeModal}
				/>
			</div>
			<Text.p size="sm">
				Answer your security question to deactivate 2FA.
			</Text.p>

			<div className="flex w-full max-w-full flex-col gap-6">
				<Input
					label="Enter Answer"
					placeholder="Enter your answer"
					onChange={(e) => {
						setAnswer(e.target.value);
					}}
				/>
			</div>
			<Button className="w-full" onClick={handleDeactivate} fullWidth>
				{isLoading ? <Spinner /> : "Deactivate"}
			</Button>
		</div>
	);
};

const DeactivateSecuritySuccess = (): React.JSX.Element => {
	const { closeModal } = useSecurityQuestion2FAState();
	return (
		<div className="flex w-full shrink-0 flex-col items-center">
			<div className="flex w-full flex-row justify-between">
				<Text.h3 size="xs">Security Question</Text.h3>
				<XCircleIcon
					className="my-auto cursor-pointer text-body"
					onClick={closeModal}
				/>
			</div>

			<Image
				src="/icons/success.gif"
				className="my-auto"
				width={230}
				height={230}
				alt=""
			/>
			<Text.p size="base" className="my-4 text-center">
				You have successfully deactivate 2FA from your account.
			</Text.p>
			<Button className="mt-auto w-full" onClick={closeModal} fullWidth>
				Done
			</Button>
		</div>
	);
};

interface SecurityQuestion2FAProps {
	isEnabled: boolean;
	disabled?: boolean;
	// refetchAccount?: () => void;
}

export const SecurityQuestion2FA = ({
	isEnabled,
	disabled,
	// refetchAccount,
}: SecurityQuestion2FAProps): React.JSX.Element => {
	const { isModalOpen, closeModal, openModal } =
		useSecurityQuestion2FAState();
	const [isActive, _setIsActive] = useState(isEnabled);
	useEffect(() => {
		if (!isModalOpen) _setIsActive(isEnabled);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isEnabled]);

	useEffect(() => {
		if (!isModalOpen) _setIsActive(isEnabled);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isModalOpen]);

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
				<div className="flex h-[75px] items-center">
					<Image
						src="/icons/security-question.svg"
						width={50}
						height={70}
						alt=""
					/>
				</div>
				<Text.p size="lg">Security Question</Text.p>
			</button>

			<Modal
				isOpen={isModalOpen}
				onOpenChange={closeModal}
				className="rounded-xl bg-white p-8"
			>
				{isActive ? (
					<Slider
						items={[
							{ SlideItem: DeactivateSecurityQuestion },
							{ SlideItem: DeactivateSecuritySuccess },
						]}
					/>
				) : (
					<Slider
						items={[
							{ SlideItem: ActivateSecurityQuestion },
							{ SlideItem: ActivateSecuritySuccess },
						]}
					/>
				)}
			</Modal>
		</>
	);
};
