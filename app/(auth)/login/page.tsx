/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Container } from "@/components/common/container";
import LoginForm from "@/components/forms/login";

export default function LoginPage(): React.JSX.Element {
	return (
		<Container className="mt-28 flex w-full max-w-2xl flex-col items-center gap-6">
			<div className="flex flex-col items-center gap-2 text-center text-white">
				<h3 className="font-sans text-3xl font-bold">
					Login to your account
				</h3>
				<p className="font-sans text-base">
					Connecting African Talent to Global Opportunity
				</p>
			</div>
			<LoginForm />
		</Container>
	);
}
