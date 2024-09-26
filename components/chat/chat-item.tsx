"use client";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import Link from "next/link";
import Image from "next/image";
import { Member, MemberRole, Profile } from "@prisma/client";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { UserAvatar } from "@/components/user-avatar";
import { ActionTooltip } from "@/components/action-tooltip";
import {
  Form,
  FormControl,
  FormField,
  FormItem
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/use-modal-store";

const formSchema = z.object({
  content: z.string().min(1)
});

interface ChatItemProps {
  content: string;
  member: Member & { profile: Profile };
  id: string;
  timestamp: string;
  fileType: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const iconMap: Record<MemberRole, React.ReactNode> = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="size-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="size-4 ml-2 text-rose-500" />
};

export function ChatItem({
  id,
  content,
  member,
  timestamp,
  fileType,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery
}: ChatItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { onOpen } = useModal();
  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileType;
  const isPdf = fileType && fileType.includes("pdf");
  const isImage = fileType && !fileType.includes("pdf");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content
    }
  });

  const isLoading = form.formState.isSubmitting;

  const handleEditMessage = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery
      });
      await axios.patch(url, values);
    } catch (error) {
      console.error(error);
    } finally {
      form.reset();

      setIsEditing(false);
    }
  };

  useEffect(() => {
    form.reset({ content });
  }, [form, content]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsEditing(false);
        form.reset({ content });
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-3 items-start w-full">
        <div className="cursor-pointer hover:drop-shadow-sm transition">
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="text-zinc-500 dark:text-zinc-400 font-semibold text-sm hover:underline cursor-pointer">
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {iconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href={content}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
            >
              <Image
                src={content}
                alt={content}
                fill
                className="object-cover"
              />
            </a>
          )}
          {isPdf && (
            <div className="relative flex items-center justify-center mt-2 rounded-xl px-3 py-4 gap-x-2 bg-black/10 dark:bg-black/30 w-32 h-32">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <Link
                href={content}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                PDF File
              </Link>
            </div>
          )}
          {!fileType && !isEditing && (
            <p
              className={cn(
                "text-sm text-zinc-500 dark:text-zinc-300",
                deleted &&
                  "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-zinc-500 text-[10px] mx-2 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileType && isEditing && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleEditMessage)}
                className="flex items-center w-full gap-x-2 pt-2"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            placeholder="Edited message"
                            className="
                            p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0
                            focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200
                            "
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} size="sm" variant="primary">
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Press ESC to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div
          className="
          hidden group-hover:flex items-center gap-x-3 absolute 
          p-1 -top-2 right-5 bg-white dark:bg-zinc-800 
          border rounded-sm
        "
        >
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit
                onClick={() => setIsEditing(true)}
                className="
                  cursor-pointer ml-auto size-4 transition 
                text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300
                "
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              onClick={() =>
                onOpen("deleteMessage", {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery
                })
              }
              className="
                  cursor-pointer ml-auto size-4 transition 
                text-red-400 hover:text-red-600 dark:hover:text-red-500
                "
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
}
