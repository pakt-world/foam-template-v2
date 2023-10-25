/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { SendHorizonal, Paperclip, X, Dot, DownloadIcon, Loader } from 'lucide-react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { MessageTypeEnums, useMessaging } from '@/providers/socketProvider';
import { Spinner } from '@/components/common';
import { formatBytes, getPreviewByType, getPreviewByTypeUrl } from '@/lib/utils';
import { ImageUp } from '@/lib/types';
import dayJs from 'dayjs';
import { useDownloadAttachment } from '@/lib/api/upload';
import { AfroProfile } from '@/components/common/afro-profile';
import Link from 'next/link';

interface Props {
  params: {
    'message-id': string;
  };
}

export default function Chat({ params }: Props) {
  const { 'message-id': messageId } = params;
  const { currentConversation, loadingChats, setActiveConversation, sendUserMessage, markUserMessageAsSeen } =
    useMessaging();
  const [loadingMessage, setLoadingMessages] = useState(true);
  const [text, setText] = useState('');
  const [imageFiles, setImageFiles] = React.useState<ImageUp[] | []>([]);

  const loadMessages = async () => {
    await setActiveConversation(messageId);
    setLoadingMessages(false);
    await markUserMessageAsSeen(messageId);
  };

  const messages = currentConversation?.messages || [];

  useEffect(() => {
    if (!loadingChats) loadMessages();
  }, [loadingChats]);

  const scrollMessages = () => {
    setTimeout(() => {
      const objDiv = document.getElementById('chat_div');
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
      id: String(i),
      name: f.name,
      size: formatBytes(f.size, 0),
    }));
    setImageFiles(files);
  }, []);

  const onDropError = React.useCallback(async (data: any) => {
    console.log('Rr-->', data);
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    onError: onDropError,
    maxSize: 2000000,
    maxFiles: 5,
    accept: {
      'image/*': [],
      'application/*': ['.pdf', '.doc', '.docx'],
      'text/*': ['.csv'],
    },
    noClick: true,
  });

  if (loadingMessage)
    return (
      <div className="h-full w-full grow flex items-center flex-col gap-1 justify-center">
        <Spinner />
      </div>
    );

  const sendMessage = async () => {
    if (text != '' || imageFiles.length > 0) {
      await sendUserMessage(
        currentConversation?.recipient?._id,
        currentConversation?.sender?._id,
        MessageTypeEnums.TEXT,
        text,
        currentConversation.id,
        imageFiles,
      );
      setText('');
      setImageFiles([]);
    }
  };

  const removeImg = (id: string) => {
    const newImages = imageFiles.filter((f) => f.id != id);
    setImageFiles(newImages);
  };

  const onKeyDownPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.which === 13 && !e.shiftKey) {
      e.preventDefault();
      return sendMessage();
    }
  };
  return (
    <div className="flex flex-col h-full">
      <ChatBoxHeader
        _id={currentConversation?.header._id ?? ''}
        title={currentConversation?.header?.title}
        description={currentConversation?.header?.description}
        time={currentConversation?.createdAt}
        avatar={currentConversation?.header?.avatar}
        score={currentConversation?.header?.score}
      />
      <div className="w-full overflow-y-auto basis-0 grow">
        <Messages messages={messages} />
      </div>
      <div className="flex flex-row  gap-2 w-full" {...getRootProps()}>
        <div className="flex items-end w-10">
          <button
            className="border h-8 w-8 bg-[#008D6C1A] text-primary rounded-full flex items-center justify-center"
            onClick={open}
          >
            <Paperclip size={16} />
            <input {...getInputProps()} />
          </button>
        </div>
        <div className="flex flex-col rounded-2xl border p-4 bg-gray-50 w-64 flex-1">
          <textarea
            rows={1}
            className="grow focus:outline-none p-2 resize-none rounded-t-lg w-full bg-gray-50"
            placeholder="Write your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDownPress}
          />
          <RenderAttachmentPreviewer images={imageFiles} removeImage={removeImg} />
        </div>
        <div className="flex w-10 items-end">
          <button
            className="border h-8 w-8 bg-primary-gradient rounded-full text-white flex items-center justify-center"
            onClick={sendMessage}
          >
            <SendHorizonal size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

const ChatBoxHeader = ({
  _id,
  title,
  description,
  time,
  score,
  avatar,
}: {
  _id: string;
  title: string;
  description: string;
  time: string;
  score: number;
  avatar: string;
}) => {
  return (
    <div className="flex gap-2 justify-between items-center border-b pb-3 border-line mb-3">
      <div className="flex gap-2 items-center">
        {/* <div className="h-[50px] flex w-[50px] bg-black rounded-full"></div> */}
        <AfroProfile score={score} src={avatar} size="sm" url={`/talents/${_id}`} />
        <div className="flex flex-col gap-1">
          <div className="text-title text-lg leading-none font-medium">{title}</div>
          <div className="text-body text-sm leading-none">{description}</div>
        </div>
      </div>
      <div>
        <span className="text-body">Started: {time}</span>
      </div>
    </div>
  );
};

const Messages = ({ messages }: { messages: [] }) => {
  return (
    <>
      {messages.length > 0 && (
        <div id="chat_div" className="basis-0 flex flex-col h-full overflow-y-auto py-6">
          {messages.map((message: any, i) => (
            <div className="w-full" key={i}>
              {!message.isSent ? (
                <div className="flex flex-col mr-auto w-fit gap-2 max-w-[600px] px-5">
                  <RenderAttachmentViewer images={message.attachments} align={'right'} />
                  {message.content && (
                    <div className="mr-auto w-fit max-w-[600px] bg-[#ECFCE5] px-5 py-2 text-title rounded-r-[30px] rounded-tl-[30px] break-words whitespace-pre-line">
                      {message.content}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col ml-auto w-fit gap-2 max-w-[600px] px-5">
                  <RenderAttachmentViewer images={message.attachments} align={'left'} />
                  {message.content && (
                    <div className="ml-auto w-fit max-w-[600px] text-white px-5 py-2 bg-[#007C5B] rounded-l-[30px] rounded-tr-[30px]  break-words whitespace-pre-line">
                      {message.content}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {messages.length == 0 && (
        <div className="h-full w-full grow flex items-center flex-col gap-1 justify-center">
          <div className="text-slate-300 text-2xl">No messages yet</div>
        </div>
      )}
    </>
  );
};

const RenderAttachmentViewer = ({ images = [], align }: { images: any[]; align?: 'left' | 'right' }) => {
  const MAX_LEN = 15;
  const SingleAttachmentView = ({ img }: { img: any }) => {
    const downloadAttachments = useDownloadAttachment();
    const DownloadAttachment = (url: string) => {
      return downloadAttachments.mutate(url);
    };
    return (
      <div className="flex gap-2 bg-[#F7F9FA] w-fit h-fit p-4 rounded-lg">
        <div className="flex flex-col w-10 items-center">
          <Image
            className="min-w-[38px] min-h-[38px] rounded-lg"
            src={img?.file ? getPreviewByType(img.file).preview : getPreviewByTypeUrl(img?.url, img?.type).preview}
            alt="upload-picture"
            width={38}
            height={38}
            objectFit="contain"
          />
        </div>
        <div className="flex flex-col w-64 flex-1">
          <p className="text-sm text-title">
            {img?.name.length > MAX_LEN ? `${img?.name.slice(0, MAX_LEN)}...` : img?.name}
          </p>
          <p className="flex items-center text-sm text-body">
            {img?.file ? `${img.progress || 0}%` : dayJs(img?.createdAt).format('DD mmm, YYYY')} <Dot size={20} />{' '}
            <span>{img?.size}</span>
          </p>
        </div>
        <div className="flex w-10 items-center">
          {img?.file || downloadAttachments.isLoading ? (
            <Loader size={20} className="text-primary animate-spin" />
          ) : (
            <DownloadIcon
              size={20}
              className="text-primary cursor-pointer"
              onClick={() => DownloadAttachment(img?.url)}
            />
          )}
        </div>
      </div>
    );
  };
  return (
    <div className={`flex w-fit flex-col gap-2 ${align == 'left' ? 'ml-auto' : 'mr-auto'}`}>
      {images && images.map((img, i) => <SingleAttachmentView key={i} img={img} />)}
    </div>
  );
};

const RenderAttachmentPreviewer = ({ images, removeImage }: { images: any[]; removeImage: (id: string) => void }) => {
  const MAX_LEN = 10;
  return (
    <>
      {images.length > 0 && (
        <div className="flex flex-row gap-4 overflow-x-auto h-fit py-4">
          {images.map((img, i) => (
            <div key={i} className="flex flex-row relative border gap-2 p-2 rounded-lg">
              <span
                className="absolute cursor-pointer -top-3 -right-3 w-fit h-fit p-1 bg-[#CDCFD0] rounded-full"
                onClick={() => removeImage(img.id)}
              >
                <X size={15} />{' '}
              </span>
              <div className="flex items-center">
                <Image
                  className="min-w-[38px] min-h-[38px] rounded-lg"
                  src={img.preview}
                  alt="upload-picture"
                  width={38}
                  height={38}
                  objectFit="contain"
                />
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-title">
                  {img.name.length > MAX_LEN ? `${img.name.slice(0, MAX_LEN)}...` : img.name}
                </p>
                <p className="text-sm text-body">{img.size}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
