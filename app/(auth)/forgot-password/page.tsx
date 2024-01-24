/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Container } from "@/components/common/container";
import ForgotPasswordForm from "@/components/forms/forgot-password";

export default function ForgotPasswordPage(): React.JSX.Element {
    return (
        <Container className="mt-28 flex w-full max-w-2xl flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-2 text-center text-white">
                <h3 className="font-sans text-3xl font-bold">Forgot Password</h3>
                <p className="max-w-md font-sans text-base">
                    Enter the email you used to create your account so we can send you instructions on how to reset your
                    password.
                </p>
            </div>
            <ForgotPasswordForm />
        </Container>
    );
}
