/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { FileWarning } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useUploadImage } from "@/lib/api/upload";
import { useUpdateAccount } from "@/lib/api/account";
import { GallerySvg } from "@/components/common/gallery-svg";
import { DefaultAvatar } from "./default-avatar";
import { useErrorService } from "@/lib/store/error-service";

interface UploadProgressProps {
	progress: number;
}

const UploadProgress: FC<UploadProgressProps> = ({ progress }) => {
	return (
		<div className="flex h-[28px] w-full items-center justify-center rounded-lg border border-primary bg-green-200 px-2">
			<div className="h-[8px] w-full overflow-hidden rounded-full bg-green-100">
				<div
					className="h-full rounded-full bg-primary-gradient"
					style={{
						width: `${progress}%`,
					}}
				/>
			</div>
		</div>
	);
};

interface Props {
	size?: number;
	image?: string;
	onUploadComplete?: () => void;
}

const MB_IN_BYTES = 1024 * 1024;
const maxSize = 2 * MB_IN_BYTES; // 2MB

export const UploadAvatar: FC<Props> = ({
	image,
	size: previewImageSize = 180,
	onUploadComplete,
}) => {
	const uploadImage = useUploadImage();
	const updateAccount = useUpdateAccount();
	const [uploadProgress, setUploadProgress] = useState(0);
	const [previewImage, setPreviewImage] = useState<{
		file: File;
		preview: string;
	} | null>();
	const { setErrorMessage } = useErrorService();

	const onDrop = useCallback(async (acceptedFiles: File[]) => {
		const file = acceptedFiles[0] as File;
		setPreviewImage({
			file,
			preview: window.URL.createObjectURL(file),
		});
	}, []);

	useEffect(() => {
		return () => {
			if (previewImage) {
				URL.revokeObjectURL(previewImage.preview);
			}
		};
	}, [previewImage]);

	const { getRootProps, getInputProps, fileRejections, isDragReject } =
		useDropzone({
			onDrop,
			maxSize,
			minSize: 0,
			maxFiles: 1,

			accept: {
				"image/png": [],
				"image/jpg": [],
				"image/jpeg": [],
			},
		});
	const isFileTooLarge =
		fileRejections.length > 0 &&
		fileRejections[0] &&
		fileRejections[0].file.size > maxSize;

	const handleUpload = async (): Promise<void> => {
		if (!previewImage) return;
		uploadImage.mutate(
			{ file: previewImage.file, onProgress: setUploadProgress },
			{
				onSuccess: ({ _id }) => {
					updateAccount.mutate(
						{
							profileImage: _id,
						},
						{
							onSuccess: () => {
								onUploadComplete?.();
							},
						},
					);
					setPreviewImage(null);
				},
				onError: (err): void => {
					setErrorMessage({
						title: "handleUpload Function",
						message: err,
					});
					setPreviewImage(null);
				},
			},
		);
	};

	return (
		<div className="flex flex-col items-center gap-2">
			<div
				{...getRootProps()}
				className="group relative flex cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#ECFCE5] duration-200"
				style={{
					width: previewImageSize,
					height: previewImageSize,
				}}
			>
				<input {...getInputProps()} />

				<div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full">
					{previewImage ? (
						<Image
							src={previewImage.preview}
							alt="profile picture"
							layout="fill"
							objectFit="cover"
						/>
					) : image ? (
						<Image
							src={image}
							alt="profile picture"
							layout="fill"
							objectFit="cover"
						/>
					) : (
						<DefaultAvatar />
					)}
				</div>

				<div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 rounded-full p-2 text-center text-[#23C16B] opacity-0 duration-200 group-hover:bg-black group-hover:bg-opacity-70 group-hover:opacity-100">
					<div>
						<GallerySvg size={24} />
					</div>
					<span className="flex flex-col gap-1 text-xs text-green-200">
						<span>
							<span className="">Click</span>
							<span> or drag and drop</span>
						</span>
						<span> to upload image</span>
					</span>
				</div>

				<div
					className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center gap-1 rounded-full border border-red-200 bg-red-100 px-4 text-sm text-red-500 duration-200"
					style={{
						opacity: isDragReject ? 1 : 0,
					}}
				>
					<FileWarning size={36} />
					<span className="text-xs">File type not supported</span>
				</div>
			</div>

			{uploadImage.isLoading && (
				<UploadProgress progress={uploadProgress} />
			)}

			{previewImage && !uploadImage.isLoading && !isFileTooLarge && (
				<button
					type="button"
					onClick={handleUpload}
					className="h-[28px] w-full rounded-lg border border-primary bg-green-200 px-2 text-xs font-medium capitalize text-green-700 duration-200 hover:bg-opacity-50"
				>
					Set new profile picture
				</button>
			)}

			{isFileTooLarge && (
				<div
					className="flex items-center gap-1 text-sm text-red-500"
					style={{
						maxWidth: previewImageSize,
					}}
				>
					<span>Please upload a picture smaller than 2 MB</span>
				</div>
			)}
		</div>
	);
};
