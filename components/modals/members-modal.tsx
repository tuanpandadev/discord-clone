"use client";

import { useState } from "react";
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion
} from "lucide-react";
import { MemberRole } from "@prisma/client";
import qs from "query-string";

import { useModal } from "@/hooks/use-modal-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { ServerWithMembersWithProfiles } from "@/types";
import axios from "axios";
import { useRouter } from "next/navigation";

const roleIconMap: Record<MemberRole, React.ReactNode> = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="size-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="size-4 ml-2 text-rose-500" />
};

export const MembersModal = () => {
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string>("");

  const isModalOpen = isOpen && type === "members";
  const { server } = data as { server: ServerWithMembersWithProfiles };

  const handleRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: { serverId: server?.id }
      });

      const response = await axios.patch(url, {
        role
      });
      router.refresh();
      onOpen("members", { server: response.data });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingId("");
    }
  };

  const handleKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: { serverId: server?.id }
      });
      const response = await axios.delete(url);
      router.refresh();
      onOpen("members", { server: response.data });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingId("");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map((member) => (
            <div key={member.id} className="flex items-center gap-x-2 mb-6">
              <UserAvatar src={member.profile.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center gap-x-1">
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </div>
                <p className="text-sm text-zinc-500">{member.profile.email}</p>
              </div>
              {server.profileId !== member.profileId &&
                loadingId !== member.id && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="size-4 text-zinc-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="size-4 mr-2" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleRoleChange(member.id, "GUEST")
                                }
                              >
                                <Shield className="size-4 mr-2" />
                                Guest
                                {member.role === MemberRole.GUEST && (
                                  <Check className="size-4 ml-auto" />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleRoleChange(member.id, "MODERATOR")
                                }
                              >
                                <ShieldCheck className="size-4 mr-2" />
                                Moderator
                                {member.role === MemberRole.MODERATOR && (
                                  <Check className="size-4 ml-2" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleKick(member.id)}>
                          <Gavel className="size-4 mr-2" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member.id && (
                <Loader2 className="animate-spin text-zinc-500 ml-auto size-4" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
