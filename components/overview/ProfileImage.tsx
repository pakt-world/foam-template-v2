"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Image from "next/image";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { AfroScore } from "../common/afro-profile";

const DefaultAvatar = "/images/defaultuser.svg";

type Size = "sm" | "md" | "lg" | "xl";

export const ProfileImage = ({
    imageUrl = DefaultAvatar,
    score = 0,
    size = "lg",
}: {
    imageUrl?: string;
    score?: number;
    size?: Size;
}): React.ReactElement => {
    const srcUrl = imageUrl;
    return (
        <AfroScore score={score} size={size}>
            <div className="flex h-full w-full items-center rounded-[100%]">
                <Image
                    src={srcUrl}
                    alt="profile"
                    layout="fill"
                    objectFit="cover"
                    fill
                    className="h-full w-full rounded-[100%] p-1"
                />
            </div>
        </AfroScore>
    );
};
