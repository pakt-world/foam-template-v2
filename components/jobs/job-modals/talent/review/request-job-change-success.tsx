"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import Image from "next/image";
import Lottie from "lottie-react";
import { Button } from "pakt-ui";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import success from "@/lottiefiles/success.json";

export const RequestJobChangeSuccess: FC<{ closeModal: () => void }> = ({ closeModal }) => {
    const router = useRouter();

    return (
        <div className="flex h-full flex-col items-center justify-center px-4">
            <div className="flex h-fit flex-col items-center justify-center gap-20">
                <div className="">
                    <Image src="/images/logo-dark.svg" width={300} height={100} alt="logo" />
                </div>

                <div className="max-w-[200px]">
                    <Lottie animationData={success} loop={false} />
                </div>
                <div className="x-mt-40 flex flex-col items-center  gap-9 text-center">
                    <div className="flex flex-col items-center gap-9 text-center">
                        <p className="max-w-[80%] text-lg text-body">
                            The Client has been notified and will have the opportunity to reopen the job.
                        </p>
                        <div className="w-full max-w-[200px]">
                            <Button
                                fullWidth
                                size="sm"
                                onClick={() => {
                                    closeModal();
                                    router.push("/overview");
                                }}
                            >
                                Go To Dashboard
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
