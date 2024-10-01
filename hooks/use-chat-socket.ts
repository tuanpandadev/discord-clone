/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Member, Message, Profile } from "@prisma/client";

import { useSocket } from "@/hooks/use-socket";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

type MessageWithMemberWithProfile = Message & {
  member: Member & { profile: Profile };
};

export const useChatSocket = ({
  addKey,
  queryKey,
  updateKey
}: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([updateKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData;
        }

        const newPages = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithMemberWithProfile) => {
              if (item.id === message.id) {
                return message;
              }
              return item;
            })
          };
        });

        return { ...oldData, pages: newPages };
      });
    });

    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [{ items: [message] }]
          };
        }

        const newData = [...oldData.pages];
        newData[0] = {
          ...newData[0],
          items: [message, ...newData[0].items]
        };

        return { ...oldData, pages: newData };
      });
    });

    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [socket, queryClient, updateKey, addKey, queryKey]);
};
