"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Image from "next/image";
import { AfroScore as AfroScorePrimitive } from "@/components/common/afro-profile";

interface Props {
    score?: number;
}

const ZeroAfroScore = (): React.ReactElement => {
    return (
        <div className="flex flex-col gap-6 px-6 pt-4">
            <div className="flex flex-col items-center gap-2 text-center">
                <span className="text-2xl font-bold text-title">Afroscore</span>
                <span className="max-w-[90%] text-sm text-body">Complete your first job to get your Afro Score</span>
            </div>

            <div className="mx-auto mt-auto flex w-[80%] items-center justify-center rounded-t-[60px] bg-[#6FCF97] bg-opacity-10 p-10 py-5">
                <div className="h-[90px] w-[90px]">
                    <Image src="/images/afrofund.png" alt="" width={100} height={100} />
                </div>
            </div>
        </div>
    );
};

const NonZeroAfroScore = ({ score = 0 }: Props): React.ReactElement => {
    return (
        <div className="flex flex-col items-center gap-1 p-4 pt-0">
            <AfroScorePrimitive score={score} size="xl">
                <div className="relative mx-auto h-[50%] w-[50%] translate-y-1/2">
                    <Image src="/images/afrofund.png" alt="logo" layout="fill" />
                </div>
            </AfroScorePrimitive>
            <span className="text-2xl font-bold text-title">Afroscore</span>
        </div>
    );
};

export const AfroScore = ({ score = 0 }: Props): React.ReactElement => {
    return (
        <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-line bg-white">
            {score > 0 ? <NonZeroAfroScore score={score} /> : <ZeroAfroScore />}
        </div>
    );
};
