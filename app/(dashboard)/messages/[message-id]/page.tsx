"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React, {
	type ReactElement,
	useEffect,
	useState,
	useCallback,
} from "react";
import { SendHorizonal, Paperclip } from "lucide-react";
import { useDropzone } from "react-dropzone";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { MessageTypeEnums, useMessaging } from "@/providers/socketProvider";
import { Spinner } from "@/components/common";
import { formatBytes, getPreviewByType } from "@/lib/utils";
import { ChatBoxHeader } from "@/components/messages/chatbox-header";
import { Messages } from "@/components/messages/messages";
import { RenderAttachmentPreviewer } from "@/components/messages/render-attachment-viewer";
import { type SendAttachmentsProps } from "@/providers/socket-types";
import { toast } from "@/components/common/toaster";

interface Props {
	params: {
		"message-id": string;
	};
}

interface FileProps {
	file: File;
	errors: Array<{ code: string; message: string }>;
}

export default function ChatPage({ params }: Props): ReactElement {
	const { "message-id": messageId } = params;
	const {
		currentConversation,
		loadingChats,
		setActiveConversation,
		sendUserMessage,
		markUserMessageAsSeen,
		handleTyping,
		isTyping,
	} = useMessaging();

	const [loadingMessage, setLoadingMessages] = useState(true);
	const [text, setText] = useState("");
	const [imageFiles, setImageFiles] = useState<SendAttachmentsProps[] | []>(
		[],
	);

	const loadMessages = async (): Promise<void> => {
		setActiveConversation(messageId);
		setLoadingMessages(false);
		markUserMessageAsSeen(messageId);
	};

	const messages = currentConversation?.messages ?? [];

	useEffect(() => {
		if (!loadingChats) void loadMessages();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loadingChats]);

	const scrollMessages = (): void => {
		setTimeout(() => {
			const objDiv = document.getElementById("chat_div");
			if (objDiv) {
				objDiv.scrollTop = objDiv.scrollHeight;
			}
		}, 50);
	};

	useEffect(() => {
		scrollMessages();
	}, [currentConversation?.messages]);

	const onDrop = React.useCallback(async (acceptedFiles: File[]) => {
		const files = acceptedFiles.map((f, i) => ({
			file: f,
			preview: getPreviewByType(f).preview,
			type: getPreviewByType(f).type,
			_id: String(i),
			name: f.name,
			size: formatBytes(f.size, 0),
		}));
		setImageFiles(files);
	}, []);

	const onDropError = useCallback((data: FileProps[]) => {
		const rejectedFiles = data.map((f: FileProps) => ({
			file: f.file,
			errors: f.errors[0],
		}));

		rejectedFiles.forEach((f) => {
			toast.error(`${f.file.name}: ${f.errors?.message}`);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const { getRootProps, getInputProps, open } = useDropzone({
		onDrop,
		onDropRejected: onDropError,
		// maxSize: 2000000,
		maxSize: 500 * 1024,
		maxFiles: 5,
		accept: {
			"image/*": [],
			"application/pdf": [".pdf"],
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document":
				[".docx"],
			"text/*": [".csv"],
			"application/vnd.ms-excel": [".csv"],
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
				[".xlsx"],
			"image/avif": [".avif"],
			"image/webp": [".webp"],
		},
		noClick: true,
	});

	if (loadingMessage)
		return (
			<div className="flex h-full w-full grow flex-col items-center justify-center gap-1">
				<Spinner />
			</div>
		);

	const sendMessage = async (): Promise<void> => {
		if (text !== "" || imageFiles.length > 0) {
			if (
				currentConversation?.recipient?._id &&
				currentConversation?.sender?._id &&
				currentConversation?.id
			) {
				await sendUserMessage(
					currentConversation?.recipient?._id,
					currentConversation?.sender?._id,
					MessageTypeEnums.TEXT,
					text,
					currentConversation.id,
					imageFiles,
				);
				setText("");
				setImageFiles([]);
			} else {
				// Handle the case where currentConversation or its properties are null or undefined
				toast.error(
					"currentConversation, recipient, or sender is null or undefined",
				);
			}
		}
	};

	const removeImg = (id: string): void => {
		const newImages = imageFiles.filter((f) => f._id !== id);
		setImageFiles(newImages);
	};

	const onKeyDownPress = async (
		e: React.KeyboardEvent<HTMLTextAreaElement>,
	): Promise<void> => {
		handleTyping();
		if (e.which === 13 && !e.shiftKey) {
			e.preventDefault();
			return sendMessage();
		}
	};

	return (
		<div className="flex h-full flex-col">
			<ChatBoxHeader
				_id={currentConversation?.header?._id ?? ""}
				title={currentConversation?.header?.title ?? ""}
				description={currentConversation?.header?.description ?? ""}
				time={currentConversation?.createdAt ?? "0"}
				avatar={currentConversation?.header?.avatar ?? ""}
				score={currentConversation?.header?.score ?? 0}
			/>
			<div className="w-full grow basis-0 overflow-y-auto">
				<Messages messages={messages} />
			</div>
			<div className="flex w-full  flex-row gap-2" {...getRootProps()}>
				<div className="flex w-10 items-end">
					<button
						className="flex h-8 w-8 items-center justify-center rounded-full border bg-[#008D6C1A] text-primary"
						onClick={open}
						type="button"
					>
						<Paperclip size={16} />
						<input {...getInputProps()} />
					</button>
				</div>
				<div className="flex w-64 flex-1 flex-col rounded-2xl border bg-gray-50 p-4">
					<textarea
						rows={1}
						className="w-full grow resize-none rounded-t-lg bg-gray-50 p-2 focus:outline-none"
						placeholder="Write your message..."
						value={text}
						onChange={(e) => {
							setText(e.target.value);
						}}
						onKeyDown={onKeyDownPress}
					/>
					<RenderAttachmentPreviewer
						images={imageFiles}
						removeImage={removeImg}
					/>
				</div>
				<div className="flex w-10 items-end">
					<button
						className="flex h-8 w-8 items-center justify-center rounded-full border bg-primary-gradient text-white"
						onClick={sendMessage}
						type="button"
						aria-label="Send"
					>
						<SendHorizonal size={16} />
					</button>
				</div>
			</div>
			{isTyping !== "" && (
				<p className="text-sky font-normal italic text-sm ml-12 mt-1">
					{isTyping}
				</p>
			)}
		</div>
	);
}
