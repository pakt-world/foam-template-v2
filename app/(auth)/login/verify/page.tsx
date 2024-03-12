"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useSearchParams } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Container } from "@/components/common/container";
import { TWO_FA_CONSTANTS } from "@/lib/constants";
import LoginVerificationForm from "@/components/forms/login-verify";

export default function LoginVerificationPage(): React.JSX.Element {
	const searchParams = useSearchParams();
	const email = searchParams.get("email");
	const verifyType = searchParams.get("type");

	return (
		<Container className="mt-28 flex w-full max-w-2xl flex-col items-center gap-6">
			<div className="flex flex-col items-center gap-2 text-center text-white">
				<h3 className="font-sans text-3xl font-bold">2FA Security</h3>
				<p className="font-sans text-base">
					{verifyType === TWO_FA_CONSTANTS.AUTHENTICATOR
						? "Enter the OTP from your authenticator"
						: `Enter the code that was sent to ${email}`}
				</p>
			</div>
			<LoginVerificationForm />
		</Container>
	);
}
