"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import dayjs from "dayjs";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { RenderAttachmentViewer } from "@/components/messages/single-attachment-view";
import { type ConversationMessage } from "@/providers/socket-types";
import { formatTimestampForDisplay } from "@/lib/utils";

interface MessagesProps {
	messages: ConversationMessage[];
}

const Message = ({
	content,
	className,
	linkClassName,
	timestamp,
}: {
	content: string;
	className: string;
	timestamp: string;
	linkClassName?: string;
}): JSX.Element => {
	const renderContentWithLinks = (): Array<string | JSX.Element> => {
		const urlRegex = /(\bhttps?:\/\/\S+)/gi;
		return content.split(urlRegex).map((part, index) => {
			if (part.match(urlRegex)) {
				return (
					<a
						key={index}
						href={part}
						target="_blank"
						rel="noopener noreferrer"
						className={`cursor-pointer ${linkClassName}`}
					>
						{part}
					</a>
				);
			}
			return part;
		});
	};

	return (
		<div
			className={` w-fit max-w-[37.5rem] whitespace-pre-line break-words flex items-end px-5 py-2 ${className}`}
		>
			<p>{renderContentWithLinks()}</p>
			<span className="float-right text-sm ml-4 whitespace-pre">
				{formatTimestampForDisplay(timestamp)}
			</span>
		</div>
	);
};

export const Messages = ({ messages }: MessagesProps): ReactElement => {
	function groupMessagesByDate(
		msgs: ConversationMessage[],
	): Array<[string, ConversationMessage[]]> {
		// Helper function to extract just the date part from the timestamp
		const extractDate = (timestamp: string): string => {
			const date = new Date(timestamp);
			return date.toISOString().split("T")[0] as string;
		};

		// Grouping the messages by date
		const grouped = msgs.reduce<Record<string, ConversationMessage[]>>(
			(acc, message) => {
				const dateKey = extractDate(message.timestamp);
				if (!acc[dateKey]) {
					acc[dateKey] = [];
				}
				acc[dateKey]?.push(message);
				return acc;
			},
			{},
		);

		// Converting the object into an array and sorting by date
		return Object.entries(grouped).sort(
			(a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime(),
		);
	}

	const groupedMessages = groupMessagesByDate(messages);
	return (
		<>
			{messages.length > 0 && (
				<div
					id="chat_div"
					className="flex h-full basis-0 flex-col overflow-y-auto py-6"
				>
					{groupedMessages.map(([date, messagesForDate]) => (
						<div
							className="flex flex-col items-center justify-center w-full"
							key={date}
						>
							<h2 className="text-[#DEDEDE] h-[48px] text-center flex items-center">
								{dayjs(date).format("MMMM D, YYYY")}
							</h2>
							{messagesForDate.map((message, i) => (
								<div className="w-full" key={i}>
									{!message.isSent ? (
										<div className="mr-auto flex w-fit max-w-[37.5rem] flex-col my-1 px-5">
											{message.attachments.length > 0 && (
												<RenderAttachmentViewer
													// @ts-expect-error ---
													images={message.attachments}
													align="right"
												/>
											)}
											{message.content && (
												<Message
													content={message.content}
													className="rounded-r-[1.875rem] rounded-tl-[1.875rem] bg-[#ECFCE5] text-title"
													linkClassName="underline"
													timestamp={
														message.timestamp
													}
												/>
											)}
										</div>
									) : (
										<div className="ml-auto flex w-fit max-w-[37.5rem] !items-end flex-col my-1 px-5">
											{message.attachments.length > 0 && (
												<RenderAttachmentViewer
													// @ts-expect-error ---
													images={message.attachments}
													align="left"
												/>
											)}
											{message.content && (
												<Message
													content={message.content}
													className="rounded-l-[1.875rem] rounded-tr-[1.875rem] bg-[#007C5B] text-white"
													linkClassName="underline"
													timestamp={
														message.timestamp
													}
												/>
											)}
										</div>
									)}
								</div>
							))}
						</div>
					))}
				</div>
			)}
			{messages.length === 0 && (
				<div className="flex h-full w-full grow flex-col items-center justify-center gap-1">
					<div className="text-2xl text-slate-300">
						No messages yet
					</div>
				</div>
			)}
		</>
	);
};
