"use client";

import { Fragment, useRef } from "react";
import { Loader2, ServerCrash } from "lucide-react";
import { Member, Message, Profile } from "@prisma/client";
import { format } from "date-fns";

import { useChatQuery } from "@/hooks/use-chat-query";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";

import { ChatWelcome } from "@/components/chat/chat-welcome";
import { ChatItem } from "@/components/chat/chat-item";

type MessageWithMemberWithProfile = Message & {
  member: Member & { profile: Profile };
};

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

const DATE_FORMAT = "d/MM/yyyy, HH:mm";

export function ChatMessages({
  name,
  apiUrl,
  paramKey,
  paramValue,
  type,
  member,
  chatId,
  socketUrl,
  socketQuery
}: ChatMessagesProps) {
  const chatRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const { data, status, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useChatQuery({
      apiUrl,
      paramKey,
      paramValue,
      queryKey
    });

  useChatSocket({ queryKey, addKey, updateKey });

  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages[0]?.items?.length ?? 0
  });

  if (status === "pending") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="size-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="size-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div
      ref={chatRef}
      className="flex-1 flex flex-col py-4 overflow-y-auto scroll-smooth transition"
    >
      {!hasNextPage && (
        <Fragment>
          <div className="flex-1" />
          <ChatWelcome type={type} name={name} />
        </Fragment>
      )}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="size-6 text-zinc-500 animate-spin my-4" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="
                text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 
                dark:hover:text-zinc-300 text-xs my-4 transition"
            >
              Load previous messages
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse mt-auto mx-2">
        {data?.pages?.map((group, i: number) => (
          <Fragment key={i}>
            {group.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                member={message.member}
                currentMember={member}
                id={message.id}
                content={message.content}
                fileType={message.fileType}
                deleted={message.deleted}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdated={message.updatedAt !== message.createdAt}
                socketQuery={socketQuery}
                socketUrl={socketUrl}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
