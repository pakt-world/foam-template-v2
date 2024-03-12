"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Lottie from "lottie-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Container } from "@/components/common/container";
import { useValidateReferral } from "@/lib/api/referral";
import { Spinner } from "@/components/common";
import warning from "@/lottiefiles/warning-2.json";
import SignupReferralForm from "@/components/forms/signup-referral";

export default function SignupReferralPage(): React.JSX.Element {
	const validateRef = useValidateReferral();
	const params = useParams();
	const [isLoading, _setIsLoading] = useState(true);
	const [errorMsg, _setErrorMsg] = useState(false);
	const referralCode = String(params.code);

	const validateReferral = (): void => {
		if (referralCode === "") {
			// throw error
			_setErrorMsg(true);
			_setIsLoading(false);
		}
		// validate code here
		validateRef.mutate(
			{ token: referralCode },
			{
				onSuccess: () => {
					_setIsLoading(false);
				},
				onError: () => {
					_setErrorMsg(true);
					_setIsLoading(false);
				},
			},
		);
	};

	useEffect(() => {
		validateReferral();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<Container className="-mt-[2.7rem] flex items-center justify-between">
				<div />

				{!isLoading && (
					<Link
						className="rounded-lg border-2 bg-white !bg-opacity-10 px-5 py-2 text-white duration-200 hover:bg-opacity-30"
						href="/login"
					>
						Login
					</Link>
				)}
			</Container>
			{!isLoading && !errorMsg && (
				<Container className="flex h-full w-full max-w-2xl flex-col items-center justify-center gap-6">
					<div className="flex flex-col items-center gap-2 text-center text-white">
						<h3 className="font-sans text-3xl font-bold">
							Create Your Account
						</h3>
					</div>
					<SignupReferralForm referralCode={referralCode} />
				</Container>
			)}
			{isLoading && (
				<div className="flex h-full justify-center text-white">
					<Spinner />
				</div>
			)}
			{!isLoading && errorMsg && (
				<Container className="bg-[rgba(0, 124, 91, 0.20)] mx-auto mt-28 flex w-full max-w-xl flex-col items-center justify-center gap-2  rounded-2xl border border-white border-opacity-20 bg-[rgba(0,124,91,0.20)] p-8 px-[40px] py-10 text-center text-white backdrop-blur-md">
					<div className="flex w-full max-w-[150px] items-center justify-center">
						<Lottie animationData={warning} />
					</div>
					<h3 className="text-3xl font-bold">
						Invalid Referral Code
					</h3>
					<h6 className="flex-wrap text-lg font-thin opacity-[0.8]">
						You need a valid referral code to be able to sign up to
						Afrofund.{" "}
					</h6>
				</Container>
			)}
		</>
	);
}
