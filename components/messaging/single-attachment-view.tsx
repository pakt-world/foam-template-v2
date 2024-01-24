"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { Dot, DownloadIcon, Loader } from "lucide-react";
import Image from "next/image";
import dayJs from "dayjs";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { getPreviewByType, getPreviewByTypeUrl } from "@/lib/utils";
import { useDownloadAttachment } from "@/lib/api/upload";
import { type AttachmentsSendingProps } from "@/providers/socket-types";

const MAX_LEN = 15;

const SingleAttachmentView = ({ img }: { img: AttachmentsSendingProps }): ReactElement => {
    const downloadAttachments = useDownloadAttachment();
    const DownloadAttachment = (url: string): void => {
        downloadAttachments.mutate(url);
    };
    return (
        <div className="flex h-fit w-fit gap-2 rounded-lg bg-[#F7F9FA] p-4">
            <div className="flex w-10 flex-col items-center">
                <Image
                    className="min-h-[38px] min-w-[38px] rounded-lg"
                    src={
                        img?.file
                            ? getPreviewByType(img.file).preview
                            : getPreviewByTypeUrl(img?.url as string, img?.type).preview
                    }
                    alt="upload-picture"
                    width={38}
                    height={38}
                    objectFit="contain"
                />
            </div>
            <div className="flex w-64 flex-1 flex-col">
                <p className="text-sm text-title">
                    {img?.name.length > MAX_LEN ? `${img?.name.slice(0, MAX_LEN)}...` : img?.name}
                </p>
                <p className="flex items-center text-sm text-body">
                    {img?.file ? `${img.progress ?? 0}%` : dayJs(img?.createdAt).format("DD mmm, YYYY")}{" "}
                    <Dot size={20} /> <span>{img?.size}</span>
                </p>
            </div>
            <div className="flex w-10 items-center">
                {img?.file ?? downloadAttachments.isLoading ? (
                    <Loader size={20} className="animate-spin text-primary" />
                ) : (
                    <DownloadIcon
                        size={20}
                        className="cursor-pointer text-primary"
                        onClick={() => {
                            DownloadAttachment(img?.url as string);
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export const RenderAttachmentViewer = ({
    images = [],
    align,
}: {
    images: AttachmentsSendingProps[];
    align?: "left" | "right";
}): ReactElement => {
    return (
        <div className={`flex w-fit flex-col gap-2 ${align === "left" ? "ml-auto" : "mr-auto"}`}>
            {images?.map((img, i) => <SingleAttachmentView key={i} img={img} />)}
        </div>
    );
};
