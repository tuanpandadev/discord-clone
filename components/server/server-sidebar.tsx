import React from "react";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { ServerHeader } from "./server-header";

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

  return (
    <div className="flex flex-col h-full w-full text-primary bg-[#F2F3F5] dark:bg-[#2B2D31]">
      <ServerHeader server={server} role={role} />
    </div>
  );
}
