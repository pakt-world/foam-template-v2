/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import Lottie from "lottie-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { cn } from "@/lib/utils";
import empty from "@/lottiefiles/empty.json";

interface Props {
    label?: string;
    className?: string;
    children?: React.ReactNode;
}

export const PageEmpty: FC<Props> = ({ className, label, children }) => {
    return (
        <div
            aria-live="polite"
            aria-busy="true"
            className={cn("flex h-screen w-full items-center justify-center border bg-white", className)}
        >
            <div className="flex flex-col items-center">
                <div className="flex w-full max-w-[250px] items-center justify-center">
                    <Lottie animationData={empty} loop={false} />
                </div>
                <span className="max-w-md text-center text-lg text-body">{label ?? "Nothing to show yet."}</span>
                {children}
            </div>
        </div>
    );
};
