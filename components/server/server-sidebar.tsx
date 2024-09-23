import React from "react";
import { redirect } from "next/navigation";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { ChannelType, MemberRole } from "@prisma/client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

import { ServerHeader } from "./server-header";
import {
  ServerChannelItem,
  ServerMemberItem,
  ServerSearch
} from "./server-search";
import { ServerSection } from "./server-section";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";

const iconMap: Record<ChannelType, React.ReactNode> = {
  [ChannelType.TEXT]: <Hash className="mr-2 size-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 size-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 size-4" />
};

const roleIconMap: Record<MemberRole, React.ReactNode> = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="size-4 mr-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="size-4 mr-2 text-rose-500" />
};

interface ServerSidebarProps {
  serverId: string;
}

export async function ServerSidebar({ serverId }: ServerSidebarProps) {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc"
        }
      },
      members: {
        include: {
          profile: true
        },
        orderBy: {
          role: "asc"
        }
      }
    }
  });

  if (!server) {
    return redirect("/");
  }

  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  const textChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );

  const audioChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );

  const videoChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  const members = server.members.filter(
    (member) => member.profileId !== profile.id
  );

  const channelData: (ServerMemberItem | ServerChannelItem)[] = [
    {
      label: "Text channels",
      type: "channel",
      data: textChannels?.map((channel) => ({
        id: channel.id,
        name: channel.name,
        icon: iconMap[channel.type]
      }))
    },
    {
      label: "Voice channels",
      type: "channel",
      data: audioChannels?.map((channel) => ({
        id: channel.id,
        name: channel.name,
        icon: iconMap[channel.type]
      }))
    },
    {
      label: "Video channels",
      type: "channel",
      data: videoChannels?.map((channel) => ({
        id: channel.id,
        name: channel.name,
        icon: iconMap[channel.type]
      }))
    },
    {
      label: "Members",
      type: "member",
      data: members?.map((member) => ({
        id: member.profileId,
        name: member.profile.name,
        icon: roleIconMap[member.role]
      }))
    }
  ];

  return (
    <div className="flex flex-col h-full w-full text-primary bg-[#F2F3F5] dark:bg-[#2B2D31]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch data={channelData} />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label="Text channels"
            />
            <div className="space-y-[2px]">
              {textChannels.map((channel) => (
                <ServerChannel
                  server={server}
                  role={role}
                  key={channel.id}
                  channel={channel}
                />
              ))}
            </div>
          </div>
        )}
        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
              label="Voice channels"
            />
            <div className="space-y-[2px]">
              {audioChannels.map((channel) => (
                <ServerChannel
                  server={server}
                  role={role}
                  key={channel.id}
                  channel={channel}
                />
              ))}
            </div>
          </div>
        )}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role}
              label="Video channels"
            />
            <div className="space-y-[2px]">
              {videoChannels.map((channel) => (
                <ServerChannel
                  server={server}
                  role={role}
                  key={channel.id}
                  channel={channel}
                />
              ))}
            </div>
          </div>
        )}

        {!!members?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              channelType={ChannelType.AUDIO}
              role={role}
              label="Members"
              server={server}
            />
            <div className="space-y-[2px]">
              {members.map((member) => (
                <ServerMember key={member.id} member={member} server={server} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
