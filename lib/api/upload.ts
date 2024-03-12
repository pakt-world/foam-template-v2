/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type UseMutationResult, useMutation } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { axios, type ApiError } from "@/lib/axios";
import { toast } from "@/components/common/toaster";

// upload image
interface UploadImageResponse {
	fileName: string;
	storageUrl: string;
	_id: string;
}

interface UploadImageParams {
	file: File;
	onProgress?: (progress: number) => void;
}

async function postUploadImage({
	file,
	onProgress,
}: UploadImageParams): Promise<UploadImageResponse> {
	const formData = new FormData();
	formData.append("file", file);
	const res = await axios.post("/upload", formData, {
		headers: { "Content-Type": "multipart/form-data" },
		onUploadProgress: (progressEvent) => {
			const percentCompleted = Math.round(
				(progressEvent.loaded * 100) / (progressEvent.total ?? 1),
			);
			onProgress?.(percentCompleted);
		},
	});
	return res.data.data;
}

export async function postUploadImages(
	uploadParams: UploadImageParams[],
): Promise<UploadImageResponse[]> {
	const allReqs = [];
	for (let i = 0; i < uploadParams.length; i++) {
		const uploadParam = uploadParams[i];
		if (uploadParam) {
			const { file, onProgress } = uploadParam;
			allReqs.push(postUploadImage({ file, onProgress }));
		}
	}
	const response = await Promise.all(allReqs);
	return response;
}

async function postDownloadAttachment(url: string): Promise<void> {
	const mainUrl = String(url);
	return fetch(mainUrl, { mode: "no-cors" })
		.then(async (response) => {
			return response.blob();
		})
		.then((blob) => {
			const blobUrl = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			// eslint-disable-next-line no-useless-escape
			a.download = url.replace(/^.*[\\\/]/, "");
			a.href = url;
			document.body.appendChild(a);
			a.click();
			a.remove();
			window.URL.revokeObjectURL(blobUrl);
		});
}

export function useUploadImage(): UseMutationResult<
	UploadImageResponse,
	ApiError,
	UploadImageParams,
	unknown
> {
	return useMutation({
		mutationFn: postUploadImage,
		mutationKey: ["upload-image"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}

export function useDownloadAttachment(): UseMutationResult<
	void,
	ApiError,
	string,
	unknown
> {
	return useMutation({
		mutationFn: postDownloadAttachment,
		mutationKey: ["download-attachment"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}
