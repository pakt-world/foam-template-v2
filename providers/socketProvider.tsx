'use client';
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { getCookie } from "cookies-next";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useUserState } from "@/lib/store/account";
import { AUTH_TOKEN_KEY, formatBytes } from "@/lib/utils";
import { usePathname } from "next/navigation";
import dayjs from "dayjs";
import { toast } from "@/components/common/toaster";
import { useRouter } from "next/navigation";
import { ImageUp } from "@/lib/types";
import { postUploadImages } from "@/lib/api/upload";

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
  CURRENT_RECIPIENT: "CURRENT_RECIPIENT",
  USER_TYPING: "USER_TYPING",
  SENDER_IS_TYPING: "SENDER_IS_TYPING",
  SENDER_STOPS_TYPING: "SENDER_STOPS_TYPING",
  POPUP_MESSAGE: "POPUP_MESSAGE",
  MARK_MESSAGE_AS_SEEN: "MARK_MESSAGE_AS_SEEN",
  USER_STATUS: "USER_STATUS",
};

export type SocketContextType = {
  currentConversation: Object | any;
  loadingChats: boolean;
  status: string;
  conversations: any;
  socket: Socket | any;
  startingNewChat: boolean,
  fetchUserChats: () => any;
  startUserInitializeConversation: (recipientId: string) => Promise<any>;
  sendUserMessage: (
    sender: string,
    recipient: string,
    type: string,
    message: string,
    conversation: string,
    images: ImageUp[]
  ) => Promise<any>;
  markUserMessageAsSeen: (conversation: string) => Promise<any>;
  getConversationById: (id: string) => Promise<any>;
  setActiveConversation: (id: string) => void;
  unreadChatCount: number
};
interface chatImage {
  size: string,
  type: string,
  name: string,
  url: string,
  _id: string,
}
const MIN_LEN = 25;
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
export const SocketContext = createContext<SocketContextType>(
  {} as SocketContextType
);
interface SocketResponse<T> { error: boolean, statusCode: number, message: string, data: T }

const prefix = "messaging";
export const MessagingProvider = ({ children }: { children: React.ReactNode }) => {
  const authToken = getCookie(AUTH_TOKEN_KEY);
  const { _id: loggedInUser } = useUserState();
  const [socket, setSocket] = useState<Socket | null | any>(null);
  const [currentConversation, setCurrentConversation] = useState<any>(null);
  const [conversations, setConversations] = useState<any>([]);
  const [status, setStatus] = useState<string>("pending");
  const [loadingChats, setLoadingChats] = useState<boolean>(true);
  const [socketReconnect, setSocketReconnect] = useState<boolean>(false);
  const [unreadChatCount, setUnreadChatCount] = useState<number>(0);
  const [startingNewChat, setStartingNewChat] = useState(false);
  const router = useRouter();
  const initiated = useRef(false);

  const pathname = usePathname();
  const messagingScreen = pathname.includes(prefix);

  const SocketConnection = async () => {
    if (socket && loggedInUser && !initiated.current) {
      initiated.current = true
      socket.on("connect", function () {
        setSocket(socket);
        socket.emit(conversationEnums.USER_CONNECT, { userId: loggedInUser }, (response: SocketResponse<any>) => {
          if (!response.error) {
            const parsedConversation = parseUserChats(response.data.messages);
            setConversations(parsedConversation);
            setLoadingChats(false);
            setUnreadChats(parsedConversation);
          }
        });

        // Join Old Conversation If any
        socket?.emit(conversationEnums.JOIN_OLD_CONVERSATIONS, { userId: loggedInUser }, () => { });
        socket?.on("disconnect", () => {
          // TODO:: Perform Disconnect Function
        });

        // notifies if user status is either offline/ online in an active chat
        socket?.on(conversationEnums.USER_STATUS, function (data: any) {
          if (currentConversation && currentConversation._id === data.currentConversation) {
            if (Array.isArray(currentConversation.recipients)) {
              const updatedRecipients = currentConversation.recipients.map((r: any) => {
                if (typeof r === "string" && r === data.user) return data;
                else if (typeof r === "object" && r.user === data.user) return data;
                return r;
              });
              currentConversation.recipients = updatedRecipients;
            }
          }
        });
      });
      return () => socket?.off();
    }
  };

  useEffect(() => {
    // Here we listen to popup events
    socket?.on(conversationEnums.POPUP_MESSAGE, async (response: any) => {
      const c = response.data;
      await fetchUserChats(c._id);
      // notify user
      const messageContent =
        c.currentMessage.content.length > MIN_LEN
          ? c.currentMessage.content.slice(0, MIN_LEN) + "..."
          : c.currentMessage.content;
      const messageSender = c.recipients.find(
        (r: any) => r._id != loggedInUser
      );
      const messageTitle = `${messageSender.firstName} ${messageSender.lastName}`;
      const senderImage = messageSender?.profileImage?.url;
      const senderScore = messageSender?.score ?? 0;
      const senderId = messageSender._id;
      // show toast if not on messaging screen
      if (!messagingScreen) {
        toast.message(messageTitle, messageContent, senderId, senderImage, senderScore)
      }
    });

    return () => {
      socket?.off(conversationEnums.POPUP_MESSAGE);
    };
  }, [socket]);

  // listen to notification to broadcast to app
  useEffect(() => {
    SocketConnection();
  }, [socket]);

  // connect to chat socket
  useEffect(() => {
    connectChatInit();
  }, [loggedInUser]);

  useEffect(() => {
    if (socketReconnect) {
      connectChatInit()
    }
  }, [socketReconnect]);

  const Reconnect = () => setTimeout(() => { setSocketReconnect(true) }, MAX_RECONNECT_TIME);

  const connectChatInit = async () => {
    const isSocketConnected = socket && socket.connected;
    if (loggedInUser && !isSocketConnected && authToken) {
      try {
        const newSocket = io(SOCKET_URL as string, {
          extraHeaders: {
            "authorization": "Bearer " + authToken,
          },
        });
        setSocket(newSocket);
        setSocketReconnect(false);
      } catch (error: any) {
        console.log("socket--er", error)
        Reconnect();
      }
    } else {
      Reconnect()
    }
  };

  const getSender = (recipients = []) => recipients.find((r: any) => r._id != loggedInUser);
  const getRecipient = (recipients = []) => recipients.find((r: any) => r._id == loggedInUser);

  const getConversationHeader = (conversation: any) => {
    const sender = conversation.recipients.find((r: any) => r._id !== loggedInUser);
    return conversation.type == "DIRECT" ? { _id: sender._id, title: `${sender?.firstName} ${sender?.lastName}`, description: sender?.profile?.bio?.title, avatar: sender?.profileImage?.url, score: sender?.score } : { title: conversation.title, description: conversation.description, score: 0, avatar: "" };
  };
  const getUnreadCount = (messages: any[]) => messages.filter((r: any) => !!!(r.readBy && !!r.readBy.includes(loggedInUser)) && r.user != loggedInUser).length;
  const getLastMessage = (messages: any[]) => messages.length > 0 ? messages[messages.length - 1].content : null;
  const getLastMessageTime = (messages: any[]) => messages.length > 0 ? dayjs(messages[messages.length - 1].createdAt).format("HH:ss A") : null;
  const getConversationById = (id: string) => conversations.find((c: any) => c.id == id);

  const parseMessageAttachments = (attachments: chatImage[]) => attachments && attachments.length > 0 ? attachments.map((a) => ({
    size: formatBytes(Number(a.size), 0),
    type: a.type,
    name: a.name,
    url: a.url,
  })) : [];

  const parseMessages = (messages: []) => messages.map((m: any) => ({
    content: m.content,
    isSent: m.user == loggedInUser,
    isRead: !!(m.readBy && m.readBy.includes(loggedInUser)),
    attachments: parseMessageAttachments(m.attachments),
  }));
  const setUnreadChats = (conversations: any[]) => {
    const unread = conversations.reduce((a: any, b) => a + b.unreadcount, 0);
    setUnreadChatCount(unread);
  }

  const setActiveConversation = (_id: string) => {
    const conversation = getConversationById(_id);
    return setCurrentConversation(conversation);
  }

  const parseUserChats = (payload: any[]) => payload.map((c: any) => ({
    id: c._id,
    messages: parseMessages(c.messages),
    sender: getSender(c.recipients),
    recipient: getRecipient(c.recipients),
    recipients: c.recipients,
    header: getConversationHeader(c),
    createdAt: dayjs(c.createdAt).format("MMMM D, YYYY"),
    type: c.type,
    unreadcount: getUnreadCount(c.messages),
    lastMessage: getLastMessage(c.messages),
    lastMessageTime: getLastMessageTime(c.messages),
  })
  );

  const fetchUserChats = async (currentConversationId?: string) => {
    await socket.emit(conversationEnums.GET_ALL_CONVERSATIONS, { userId: loggedInUser },
      (response: SocketResponse<any>) => {
        if (!response.error) {
          const payload = response?.data?.messages;
          const parsedConversation = parseUserChats(payload);
          setConversations(parsedConversation);
          setLoadingChats(false);
          setUnreadChats(parsedConversation);
          if (currentConversationId) {
            const cOV = parsedConversation.find((c: any) => c.id == currentConversationId);
            setCurrentConversation(cOV);
          }
          return payload.messages;
        }
      }
    );
  }

  const startUserInitializeConversation = async (recipientId: string) => {
    try {
      setStartingNewChat(true);
      return await socket.emit(
        conversationEnums.INITIALIZE_CONVERSATION,
        {
          senderId: loggedInUser,
          recipientId,
          type: "DIRECT"
        },
        async (response: SocketResponse<any>) => {
          if (response.error) {
            toast.error(response.message);
            return router.push("/messages");
          }
          const { conversation } = response.data;
          await fetchUserChats(conversation._id);
          setStartingNewChat(false)
          if (conversation.error) return router.back();
          return router.push(`/messages/${conversation._id}`);
        }
      );
    } catch (error) {
      return null;
    }
  };

  const UploadFiles = async (images: ImageUp[]) => {
    const uploadFll = [];
    const updateProgress = (id: string, progress: number) => {
      // set upload progress for images
      const currentMessage = currentConversation.messages ? currentConversation.messages.find((m: any) => !!m.sending) : null;
      if (currentMessage) {
        // update progress with value
        const currentImage = currentMessage.attachments.find((img: ImageUp) => img.id == id);
        if (currentImage) {
          const imgData = { ...currentImage, progress };
          const newImages = [...currentMessage.attachments, imgData];
        }
      }
    }
    // create 
    for (let i = 0; i < images.length; i++) {
      const em = images[i];
      const callbackFunc = (progress: number) => updateProgress(em.id, progress);
      uploadFll.push({
        file: em.file,
        onProgress: callbackFunc
      })
    }
    const resp = await postUploadImages(uploadFll);
    return resp.map((r: any) => r._id);
  }

  const sendUserMessage = async (
    sender: string,
    recipient: string,
    type = MessageTypeEnums.TEXT,
    message: string,
    conversation: string,
    images: ImageUp[],
  ) => {
    let attachments: string[] = [];
    try {
      await markUserMessageAsSeen(conversation);
      const currentConversation = getConversationById(conversation);
      setCurrentConversation({ ...currentConversation, messages: [...currentConversation.messages, { content: message, isSent: true, sending: true, attachments: images }] });
      if (images.length > 0) {
        // perform image Uploads first before sending message
        attachments = await UploadFiles(images);
      }
      return await socket.emit(conversationEnums.SEND_MESSAGE, {
        senderId: sender,
        recipientId: recipient,
        type,
        message,
        conversationId: conversation,
        attachments,
      }, async (_response: any) => {
        const currentConversationId = currentConversation.id;
        await fetchUserChats(currentConversationId);
        return;
      }
      );
    } catch (error: any) {
      return toast.error(error?.response?.data.message || 'Failed to Send Message Try again');
    }
  };

  const markUserMessageAsSeen = async (conversation: string) => {
    try {
      await socket.emit(conversationEnums.MARK_MESSAGE_AS_SEEN, {
        conversationId: conversation,
        recipientId: loggedInUser,
        seen: new Date(),
      });
      await fetchUserChats();
    } catch (e) {
      return null;
    }
  };

  const SocketServer: SocketContextType = {
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
  };

  return (
    <SocketContext.Provider value={{ ...SocketServer }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useMessaging = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be use inside SocketProvider");
  return context;
};
