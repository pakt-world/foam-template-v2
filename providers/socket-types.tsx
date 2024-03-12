/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type Socket } from "socket.io-client";

// ====== SOCKET RESPONSE ===== //

export interface SocketResponse<T> {
	data: T;
	error: boolean;
	message: string;
	statusCode: number;
}

// ====== SOCKET RESPONSE ===== //

// ====== ALL CHATS ===== //

interface Bio {
	title: string;
	description: string;
}

interface Profile {
	bio: Bio;
}

interface SocketProps {
	status: string;
}

interface ProfileImage {
	_id: string;
	url: string;
}

export interface RecipientResponseProps {
	profile: Profile;
	socket: SocketProps;
	_id: string;
	firstName: string;
	lastName: string;
	score: number;
	profileImage: ProfileImage;
}

export interface AttachmentsResponseProps {
	_id: string;
	name?: string;
	type?: string;
	size?: number;
	url?: string;

	progress?: number;
}

export interface MessageResponseProps {
	_id: string;
	user: string;
	type: string;
	content: string;
	attachments: AttachmentsResponseProps[];
	seen: string | null;
	readBy: string[];
	conversation: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

export interface ConversationResponseProps {
	_id: string;
	type: string;
	recipients: RecipientResponseProps[];
	messages: MessageResponseProps[];
	createdAt: string;
	updatedAt: string;
	__v: number;
	// conversation.type !== "DIRECT" the below properties will be available
	title?: string;
	description?: string;
}

export interface GetAllChatsResponseProps {
	messages: ConversationResponseProps[];
}

// ====== ALL CHATS ===== //

export interface ParsedAttachmentProps {
	_id: string;
	name?: string;
	type?: string;
	size?: string;
	url?: string;
}

export interface ParsedMessagesProps {
	content?: string;
	isSent?: boolean;
	isRead?: boolean;
	attachments?: ParsedAttachmentProps[];
	sending?: boolean;
}

// ====== POP-UP MESSAGE ===== //

interface PopUpMessageProps {
	_id: string;
	user: string;
	type: string;
	content: string;
	attachments: string[];
	seen: string | null;
	readBy: string[];
	conversation: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

interface Bio {
	title: string;
	description: string;
}

interface Profile {
	bio: Bio;
}

interface PopUpProfileImageProps {
	_id: string;
	url: string;
}

export interface PopUpRecipientProps {
	profile: Profile;
	socket: SocketProps;
	_id: string;
	firstName: string;
	lastName: string;
	score: number;
	profileImage: PopUpProfileImageProps;
}

interface PopUpChatDataProps {
	messages: PopUpMessageProps[];
	totalMessagesCount: number;
}

export interface PopUpConversationDataProps {
	_id: string;
	chats: PopUpChatDataProps;
	recipients: PopUpRecipientProps[];
	createdAt: string;
	updatedAt: string;
	currentMessage: PopUpMessageProps;
	unreadMessagesCount: number;
}

// ====== POP-UP MESSAGE ===== //

// ====== INITIALIZE CONVERSATION ===== //

interface InitializeConversationProps {
	type: string;
	recipients: string[]; // Array of recipient IDs
	messages: string[]; // Define a 'Message' type if you have a structure for messages
	_id: string;
	createdAt: string; // ISO date string, consider using Date type
	updatedAt: string; // ISO date string, consider using Date type
	__v: number;
}

export interface InitializeMessageProps {
	conversation: InitializeConversationProps;
}

// ====== INITIALIZE CONVERSATION ===== //

// ====== SEND USER MESSAGE PROPS ===== //

export interface SendAttachmentsProps {
	file: File;
	_id: string;
	name: string;
	preview: string;
	size: string;
	type: string;
}

export interface AttachmentsSendingProps {
	file: File;
	id: string;
	name: string;
	preview: string;
	size: string;
	type: string;
	progress?: number;
	createdAt?: string;
	url?: string | undefined;
}

// ====== SEND USER MESSAGE PROPS ===== //

// ====== CONVERSATION PROPS ===== //

// Message Type
export interface ConversationMessage {
	content: string;
	isSent: boolean;
	isRead?: boolean;
	attachments: AttachmentsResponseProps[] | SendAttachmentsProps[];
	// Added from sending message
	sending: boolean;
	timestamp: string;
}

// Profile Type
interface Profile {
	bio: Bio;
	socket: SocketProps;
}

// User Type
export interface ConversationUserProps {
	profile: Profile;
	_id: string;
	firstName: string;
	lastName: string;
	score: number;
	profileImage: ProfileImage;
	socket: SocketProps;
}

// Header Type
export interface ConversationHeaderProps {
	_id: string;
	title: string;
	description: string;
	avatar: string;
	score: number;
}

// Main Data Type
export interface ConversationProps {
	id: string;
	messages: ConversationMessage[];
	sender: ConversationUserProps;
	recipient: ConversationUserProps;
	recipients: ConversationUserProps[];
	header: ConversationHeaderProps;
	createdAt: string;
	type: string;
	unreadcount: number;
	lastMessage: string;
	lastMessageTime: string;
}

// ====== CONVERSATION PROPS ===== //

export interface SocketContextType {
	currentConversation: ConversationProps | null;
	loadingChats: boolean;
	status: string;
	conversations: ConversationProps[];
	socket: Socket | null;
	startingNewChat: boolean;
	fetchUserChats: () => void;
	startUserInitializeConversation: (recipientId: string) => Promise<void>;
	sendUserMessage: (
		sender: string,
		recipient: string,
		type: string,
		message: string,
		conversation: string,
		images: SendAttachmentsProps[],
	) => Promise<void>;
	markUserMessageAsSeen: (conversation: string) => void;
	getConversationById: (id: string) => void;
	setActiveConversation: (id: string) => void;
	unreadChatCount: number;
	handleTyping: () => void;
	isTyping: string;
}
