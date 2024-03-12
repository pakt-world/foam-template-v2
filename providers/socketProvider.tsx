"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { getCookie } from "cookies-next";
import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { io, type Socket } from "socket.io-client";
import { usePathname, useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useUserState } from "@/lib/store/account";
import { AUTH_TOKEN_KEY, formatBytes } from "@/lib/utils";
import { toast } from "@/components/common/toaster";
import { postUploadImages } from "@/lib/api/upload";
import { useErrorService } from "@/lib/store/error-service";

import {
	type InitializeMessageProps,
	type SocketResponse,
	type ParsedMessagesProps,
	type AttachmentsResponseProps,
	type ConversationResponseProps,
	type GetAllChatsResponseProps,
	type MessageResponseProps,
	type ParsedAttachmentProps,
	type PopUpConversationDataProps,
	type RecipientResponseProps,
	type SendAttachmentsProps,
	type ConversationProps,
	type SocketContextType,
	type ConversationHeaderProps,
	type ConversationUserProps,
	type ConversationMessage,
	type PopUpRecipientProps,
} from "./socket-types";

const MAX_RECONNECT_TIME = 1000;

export const MessageTypeEnums = {
	TEXT: "TEXT",
	MEDIA: "MEDIA",
};

export const conversationEnums = {
	USER_CONNECT: "USER_CONNECT",
	GET_ALL_CONVERSATIONS: "GET_ALL_CONVERSATIONS",
	JOIN_OLD_CONVERSATIONS: "JOIN_OLD_CONVERSATIIONS",
	GET_ALL_USERS: "GET_ALL_USERS",
	INITIALIZE_CONVERSATION: "INITIALIZE_CONVERSATION",
	FETCH_CONVERSATION_MESSAGES: "FETCH_CONVERSATION_MESSAGES",
	SEND_MESSAGE: "SEND_MESSAGE",
	// CURRENT_RECIPIENT: "CURRENT_RECIPIENT",
	// USER_TYPING: "USER_TYPING",
	SENDER_IS_TYPING: "SENDER_IS_TYPING",
	SENDER_STOPS_TYPING: "SENDER_STOPS_TYPING",
	POPUP_MESSAGE: "POPUP_MESSAGE",
	MARK_MESSAGE_AS_SEEN: "MARK_MESSAGE_AS_SEEN",
	USER_STATUS: "USER_STATUS",
	// BROADCAST_MESSAGE: "BROADCAST_MESSAGE",
	// DELETE_CONVERSATION: "DELETE_CONVERSATION",
	// DELETE_MESSAGE: "DELETE_MESSAGE",
};

interface TypingProps {
	message: string;
	sender: string;
}

const MIN_LEN = 25;

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

// @ts-expect-error --- TODO: Fix this
const defaultContext: SocketContextType = {};

export const SocketContext = createContext<SocketContextType>(defaultContext);

const prefix = "messages";

export const MessagingProvider = ({
	children,
}: {
	children: React.ReactNode;
}): React.JSX.Element => {
	const authToken = getCookie(AUTH_TOKEN_KEY);
	const [socket, setSocket] = useState<Socket | null>(null);

	const [socketReconnect, setSocketReconnect] = useState<boolean>(false);

	const { _id: loggedInUser } = useUserState();

	const [currentConversation, setCurrentConversation] =
		useState<ConversationProps | null>(null);
	const [conversations, setConversations] = useState<ConversationProps[]>([]);

	// @ts-expect-error --- Unused variable
	const [status, setStatus] = useState<string>("pending");
	const [loadingChats, setLoadingChats] = useState<boolean>(true);
	const [unreadChatCount, setUnreadChatCount] = useState<number>(0);
	const [startingNewChat, setStartingNewChat] = useState(false);

	const [isTyping, setIsTyping] = useState<string>("");
	const typingTimer = useRef<NodeJS.Timeout | null>(null);

	const router = useRouter();
	const initiated = useRef(false);

	const pathname = usePathname();
	const messagingScreen = pathname.includes(prefix);

	const { setErrorMessage } = useErrorService();

	const getSender = (
		recipients: RecipientResponseProps[] = [],
	): RecipientResponseProps | undefined => {
		return recipients.find(
			(r: RecipientResponseProps) => r._id !== loggedInUser,
		);
	};
	const getRecipient = (
		recipients: RecipientResponseProps[] = [],
	): RecipientResponseProps | undefined => {
		return recipients.find(
			(r: RecipientResponseProps) => r._id === loggedInUser,
		);
	};

	const getUnreadCount = (messages: MessageResponseProps[]): number =>
		messages.filter(
			(r: MessageResponseProps) =>
				!(r.readBy && !!r.readBy.includes(loggedInUser)) &&
				r.user !== loggedInUser,
		).length;

	const getLastMessage = (
		messages: MessageResponseProps[],
	): string | null => {
		const lastMessage = messages[messages.length - 1];
		return lastMessage ? lastMessage.content : null;
	};

	const getLastMessageTime = (
		messages: MessageResponseProps[],
	): string | null => {
		const lastMessage = messages[messages.length - 1];
		return lastMessage ? lastMessage.createdAt : null;
	};

	const setUnreadChats = (convo: ConversationProps[]): void => {
		const unread = convo?.reduce((a, b) => a + b.unreadcount, 0);
		setUnreadChatCount(unread);
	};

	const getConversationById = useCallback(
		(id: string): ConversationProps | undefined => {
			const convo = conversations.find(
				(c: ConversationProps) => c.id === id,
			);
			return convo;
		},
		[conversations],
	);

	const setActiveConversation = useCallback(
		(_id: string): void => {
			const conversation = getConversationById(_id);
			setCurrentConversation(conversation ?? null);
		},
		[getConversationById],
	);

	const parseMessageAttachments = (
		attachments: AttachmentsResponseProps[],
	): ParsedAttachmentProps[] =>
		attachments && attachments.length > 0
			? attachments.map((a: AttachmentsResponseProps) => ({
					_id: a._id,
					size: formatBytes(Number(a.size), 0),
					type: a.type,
					name: a.name,
					url: a.url,
				}))
			: [];

	const parseMessages = (
		messages: MessageResponseProps[],
	): ParsedMessagesProps[] =>
		messages.map((m: MessageResponseProps) => ({
			content: m.content,
			isSent: m.user === loggedInUser,
			isRead: !!m.readBy?.includes(loggedInUser),
			attachments: parseMessageAttachments(m.attachments),
			timestamp: m.createdAt,
		}));

	const getConversationHeader = (
		conversation: ConversationResponseProps,
	):
		| {
				_id: string | undefined;
				title: string;
				description: string;
				avatar: string;
				score: number;
		  }
		| {
				title: string | undefined;
				description: string | undefined;
				score: number;
				avatar: string;
				_id?: undefined;
		  } => {
		const sender = conversation.recipients?.find(
			(r: RecipientResponseProps) => r._id !== loggedInUser,
		);

		return conversation.type === "DIRECT"
			? {
					_id: sender?._id,
					title: `${sender?.firstName} ${sender?.lastName}`,
					description: sender?.profile?.bio?.title ?? "",
					avatar: sender?.profileImage?.url ?? "",
					score: sender?.score ?? 0,
				}
			: {
					title: conversation.title,
					description: conversation.description,
					score: 0,
					avatar: "",
				};
	};

	const parseUserChats = useCallback(
		(payload: ConversationResponseProps[]) =>
			payload.map(
				(c: ConversationResponseProps): ConversationProps => ({
					id: c._id,
					messages: parseMessages(
						c.messages,
					) as ConversationMessage[],
					sender: getSender(c.recipients) as ConversationUserProps,
					recipient: getRecipient(
						c.recipients,
					) as ConversationUserProps,
					recipients: c.recipients,
					header: getConversationHeader(c) as ConversationHeaderProps,
					// createdAt: dayjs(c.createdAt).format("MMMM D, YYYY"),
					createdAt: c.createdAt,
					type: c.type,
					unreadcount: getUnreadCount(c.messages),
					lastMessage: getLastMessage(c.messages) as string,
					lastMessageTime: getLastMessageTime(c.messages) as string,
				}),
			),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);
	const activeConversationId = pathname.includes(prefix)
		? pathname.split("/")[2]
		: null;
	// Fetch Updated Chats
	const fetchUserChats = useCallback(
		async (currentConversationId?: string): Promise<void> => {
			if (!socket) {
				return;
			}

			socket.emit(
				conversationEnums.GET_ALL_CONVERSATIONS,
				{ userId: loggedInUser },
				(response: SocketResponse<GetAllChatsResponseProps>) => {
					if (!response.error) {
						const payload = response?.data?.messages;
						const parsedConversation = parseUserChats(payload);
						setConversations(parsedConversation);
						setLoadingChats(false);
						setUnreadChats(parsedConversation);
						if (
							currentConversationId
							// && activeConversationId === currentConversationId
						) {
							const cOV = parsedConversation.find(
								(c: ConversationProps) =>
									c.id === currentConversationId,
							);
							setCurrentConversation(cOV ?? null);
							// eslint-disable-next-line @typescript-eslint/no-use-before-define
							void markUserMessageAsSeen(currentConversationId);
						}
						return payload.map(
							(c: ConversationResponseProps) => c.messages,
						);
					}
					return null;
				},
			);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[loggedInUser, parseUserChats, socket, activeConversationId],
	);

	const UploadFiles = useCallback(
		async (images: SendAttachmentsProps[]): Promise<string[]> => {
			const uploadFll: Array<{
				file: File;
				onProgress: (progress: number) => void;
			}> = [];

			const currentMessage = currentConversation?.messages
				? currentConversation.messages.find((m) => !!m.sending)
				: null;

			const updateProgress = (id: string, progress: number): void => {
				// set upload progress for images
				if (currentMessage) {
					const attachments = currentMessage.attachments ?? [];
					const index = attachments.findIndex(
						(img) => img._id === id,
					);
					if (index !== -1) {
						attachments[index] = {
							...attachments[index],
							_id: attachments[index]?._id ?? "",
							progress,
						};
					}
				}
			};
			// create
			for (let i = 0; i < images.length; i++) {
				const em = images[i];
				if (em) {
					const callbackFunc = (progress: number): void => {
						updateProgress(em._id, progress);
					};
					uploadFll.push({
						file: em.file,
						onProgress: callbackFunc,
					});
				}
			}
			try {
				const resp = await postUploadImages(uploadFll);
				return resp.map((r: AttachmentsResponseProps) => r._id);
			} catch (error) {
				// Handle the error appropriately
				// Maybe return an empty array or throw the error further
				return [];
			}
		},
		[currentConversation],
	);

	const markUserMessageAsSeen = useCallback(
		async (conversation: string): Promise<null> => {
			try {
				if (!socket) {
					setErrorMessage({
						title: "Socket Connection Error (markUserMessageAsSeen Function)",
						message: "Socket is null",
					});
					return null;
				}
				socket.emit(conversationEnums.MARK_MESSAGE_AS_SEEN, {
					conversationId: conversation,
					recipientId: loggedInUser,
					seen: new Date(),
				});
				await fetchUserChats();
				return null;
			} catch (e) {
				return null;
			}
		},
		[fetchUserChats, loggedInUser, setErrorMessage, socket],
	);

	const sendUserMessage = useCallback(
		async (
			sender: string,
			recipient: string,
			// eslint-disable-next-line @typescript-eslint/default-param-last
			type: string = MessageTypeEnums.TEXT,
			message: string,
			conversation: string,
			images: SendAttachmentsProps[],
		): Promise<void> => {
			let attachments: string[] = [];
			try {
				await markUserMessageAsSeen(conversation);
				const currentConv = getConversationById(conversation);

				if (!currentConv) {
					// Handle the case where currentConv is undefined
					return undefined;
				}
				setCurrentConversation({
					...currentConv,
					messages: [
						...currentConv.messages,
						{
							content: message,
							isSent: true,
							sending: true,
							attachments: images,
							timestamp: new Date().toISOString(),
						},
					],
				});
				if (images.length > 0) {
					// perform image Uploads first before sending message
					attachments = await UploadFiles(images);
				}
				if (!socket) {
					setErrorMessage({
						title: "Socket Connection Error (markUserMessageAsSeen Function)",
						message: "Socket is null",
					});
					return;
				}
				socket.emit(
					conversationEnums.SEND_MESSAGE,
					{
						senderId: sender,
						recipientId: recipient,
						type,
						message,
						conversationId: conversation,
						attachments,
					},
					async () => {
						const currentConversationId = currentConversation?.id;
						await fetchUserChats(currentConversationId);
					},
				);
			} catch (error) {
				toast.error(
					// @ts-expect-error --- TODO: Fix this
					error?.response?.data.message ??
						"Failed to Send Message Try again",
				);
			}
		},
		[
			UploadFiles,
			currentConversation?.id,
			fetchUserChats,
			getConversationById,
			markUserMessageAsSeen,
			setErrorMessage,
			socket,
		],
	);

	// =========== Initialize User Conversation e.g when user clicks on a user to chat from profile or for the first time
	const startUserInitializeConversation = useCallback(
		async (recipientId: string): Promise<void> => {
			try {
				setStartingNewChat(true);
				if (!socket) {
					setErrorMessage({
						title: "Socket Connection Error (startUserInitializeConversation Function)",
						message: "Socket is null",
					});
					return;
				}
				socket.emit(
					conversationEnums.INITIALIZE_CONVERSATION,
					{
						senderId: loggedInUser,
						recipientId,
						type: "DIRECT",
					},
					async (
						response: SocketResponse<InitializeMessageProps>,
					) => {
						if (response.error) {
							toast.error(response.message);
							router.push("/messages");
							return;
						}
						const { conversation } = response.data;
						await fetchUserChats(conversation._id);
						setStartingNewChat(false);
						if (response.error) {
							router.back();
							return;
						}
						router.push(`/messages/${conversation._id}`);
					},
				);
				setStartingNewChat(false);
			} catch (error) {
				setErrorMessage({
					title: "Socket Connection Error (startUserInitializeConversation Function)",
					message: error,
				});
			}
		},
		[fetchUserChats, loggedInUser, router, setErrorMessage, socket],
	);

	// =========== Establish Connection to the WebSocket Server =========== //
	const SocketConnection = async (): Promise<(() => void) | null> => {
		if (socket && loggedInUser && !initiated.current) {
			initiated.current = true;
			socket.on("connect", () => {
				setSocket(socket);
				socket.emit(
					conversationEnums.USER_CONNECT,
					{ userId: loggedInUser },
					(response: SocketResponse<GetAllChatsResponseProps>) => {
						if (!response.error) {
							const parsedConversation = parseUserChats(
								response.data.messages,
							);
							setConversations(parsedConversation);
							setLoadingChats(false);
							setUnreadChats(parsedConversation);
						}
					},
				);

				// Join Old Conversation If any
				// socket?.emit(conversationEnums.JOIN_OLD_CONVERSATIONS, { userId: loggedInUser }, () => {});
				// socket?.on("disconnect", () => {
				//     // TODO:: Perform Disconnect Function
				// });

				// notifies if user status is either offline/ online in an active chat
				// socket?.on(conversationEnums.USER_STATUS, (data: UserStatusProps) => {
				//     if (currentConversation && currentConversation.id === data.currentConversation) {
				//         if (Array.isArray(currentConversation.recipients)) {
				//             const updatedRecipients = currentConversation.recipients.map((r: RecipientProps) => {
				//                 if (typeof r === "string" && r === data.user) return data;
				//                 if (typeof r === "object" && r.user === data.user) return data;
				//                 return r;
				//             });
				//             currentConversation.recipients = updatedRecipients;
				//         }
				//     }
				// });
			});
			return () => socket?.off();
		}
		return null;
	};

	// listen to notification to broadcast to app
	useEffect(() => {
		void SocketConnection();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket]);

	const Reconnect = (): void => {
		setTimeout(() => {
			setSocketReconnect(true);
		}, MAX_RECONNECT_TIME);
	};

	const connectChatInit = async (): Promise<void> => {
		const isSocketConnected = socket?.connected;
		if (loggedInUser && !isSocketConnected && authToken) {
			try {
				const newSocket = io(SOCKET_URL as string, {
					extraHeaders: {
						"authorization": `Bearer ${authToken}`,
					},
				});
				setSocket(newSocket);
				setSocketReconnect(false);
			} catch (error: unknown) {
				setErrorMessage({
					title: "Socket Connection Error (connectChatInit Function)",
					message: error,
				});
				Reconnect();
			}
		} else {
			Reconnect();
		}
	};

	// connect to chat socket
	useEffect(() => {
		void connectChatInit();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loggedInUser]);

	// reconnect to chat socket
	useEffect(() => {
		if (socketReconnect) {
			void connectChatInit();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socketReconnect]);

	// ===========  LISTEN TO POPUP EVENTS =========== //
	useEffect(() => {
		// Here we listen to popup events
		socket?.on(
			conversationEnums.POPUP_MESSAGE,
			async (response: SocketResponse<PopUpConversationDataProps>) => {
				const c = response.data;
				if (c.currentMessage) {
					const messageContent =
						c.currentMessage.content?.length > MIN_LEN
							? `${c.currentMessage.content.slice(0, MIN_LEN)}...`
							: c.currentMessage.content;
					if (messageContent) {
						await fetchUserChats(c._id);

						// notify user
						const messageSender = c.recipients?.find(
							(r: PopUpRecipientProps) => r._id !== loggedInUser,
						);
						if (messageSender) {
							const messageTitle = `${messageSender.firstName} ${messageSender.lastName}`;
							const senderImage =
								messageSender?.profileImage?.url;
							const senderScore = messageSender?.score ?? 0;
							const senderId = messageSender._id;
							const messageId = c._id;
							const audio = new Audio("/sound/notification.mp3");
							void audio.play();
							// show toast if not on messaging screen
							if (!messagingScreen) {
								// Play notification sound
								toast.message(
									messageTitle,
									messageContent,
									senderId,
									senderImage,
									senderScore,
									messageId,
								);
							}
						}
					}
				}
			},
		);

		return () => {
			socket?.off(conversationEnums.POPUP_MESSAGE);
		};
	}, [fetchUserChats, loggedInUser, messagingScreen, pathname, socket]);

	const handleTyping = useCallback(() => {
		// setIsTyping(true);
		socket?.emit(conversationEnums.SENDER_IS_TYPING, {
			isTyping: true,
			senderId: loggedInUser,
			recipientId: currentConversation?.sender?._id,
		});
		// Clear existing timer
		if (typingTimer.current) {
			clearTimeout(typingTimer.current);
		}
		// Set a new timer
		typingTimer.current = setTimeout(() => {
			// setIsTyping(false);
			socket?.emit(conversationEnums.SENDER_STOPS_TYPING, {
				isTyping: false,
				senderId: loggedInUser,
				recipientId: currentConversation?.sender?._id,
			});
		}, 5000); // 5 seconds timeout
	}, [currentConversation?.sender?._id, loggedInUser, socket]);

	useEffect(() => {
		// Listen for when user is typing
		socket?.on(conversationEnums.SENDER_IS_TYPING, (data: TypingProps) => {
			const { message, sender: id } = data;
			// Get user that is typing
			const sender = currentConversation?.recipients.find(
				(r: ConversationUserProps) => r._id === id,
			);
			// Get sender name
			const senderName = `${sender?.firstName} ${sender?.lastName}`;
			// Show typing notification
			if (id !== loggedInUser) {
				setIsTyping(`${senderName} ${message}`);
			} else {
				setIsTyping("");
			}
		});

		// Listen for when user stops typing
		socket?.on(
			conversationEnums.SENDER_STOPS_TYPING,
			(data: TypingProps) => {
				if (data.sender) {
					setIsTyping("");
				}
			},
		);

		return () => {
			clearTimeout(typingTimer.current as NodeJS.Timeout);
			// socket.disconnect();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket, currentConversation]);

	const SocketServer: SocketContextType = useMemo(
		() => ({
			currentConversation,
			loadingChats,
			status,
			conversations,
			socket,
			unreadChatCount,
			startingNewChat,
			fetchUserChats,
			startUserInitializeConversation,
			sendUserMessage,
			markUserMessageAsSeen,
			getConversationById,
			setActiveConversation,
			handleTyping,
			isTyping,
		}),
		[
			currentConversation,
			loadingChats,
			status,
			conversations,
			socket,
			unreadChatCount,
			startingNewChat,
			fetchUserChats,
			startUserInitializeConversation,
			sendUserMessage,
			markUserMessageAsSeen,
			getConversationById,
			setActiveConversation,
			handleTyping,
			isTyping,
		],
	);

	return (
		<SocketContext.Provider value={SocketServer}>
			{children}
		</SocketContext.Provider>
	);
};

export const useMessaging = (): SocketContextType => {
	const context = useContext(SocketContext);
	if (!context)
		throw new Error("useSocket must be use inside SocketProvider");
	return context;
};
