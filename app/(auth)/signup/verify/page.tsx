/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Container } from "@/components/common/container";
import SignupVerificationForm from "@/components/forms/signup-verify";

export default function SignupVerificationPage(): React.JSX.Element {
    return (
        <Container className="mt-28 flex w-full max-w-2xl flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-2 text-center text-white">
                <h3 className="font-sans text-3xl font-bold">Verify Email</h3>
                <p className="font-sans text-base">
                    A code has been sent to your email address. Enter it to verify your email.
                </p>
            </div>
            <SignupVerificationForm />
        </Container>
    );
}
