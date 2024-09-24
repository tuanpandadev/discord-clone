import React from "react";
import { Hash, Mic, Video } from "lucide-react";
import { ChannelType } from "@prisma/client";

import { MobileToggle } from "@/components/mobile-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { SocketIndicator } from "@/components/socket-indicator";

interface ChannelIdPageProps {
  serverId: string;
  name: string;
  type: "conversation" | "channel";
  channelType?: ChannelType;
  imageUrl?: string;
}

const iconMap = {
  TEXT: Hash,
  AUDIO: Mic,
  VIDEO: Video
};

export function ChatHeader({
  name,
  serverId,
  type,
  imageUrl,
  channelType
}: ChannelIdPageProps) {
  const Icon = type === "channel" && channelType ? iconMap[channelType] : null;

  return (
    <div
      className="
        text-md font-semibold px-3 flex 
        items-center h-12 border-neutral-200 dark:border-neutral-800 
        border-b-2 shadow"
    >
      <MobileToggle serverId={serverId} />

      {Icon && !imageUrl && <Icon />}
      {!Icon && imageUrl && (
        <UserAvatar className="size-5 md:size-5" src={imageUrl} />
      )}

      <p className="ml-3 font-semibold text-md text-black dark:text-white">
        {name}
      </p>
      <div className="ml-auto flex items-center">
        <SocketIndicator />
      </div>
    </div>
  );
}
