"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { useParams, useRouter } from "next/navigation";

interface Member {
  icon: React.ReactNode;
  name: string;
  id: string;
}

interface Channel {
  icon: React.ReactNode;
  name: string;
  id: string;
}

interface SelectParams {
  id: string;
  type: "member" | "channel";
}

export interface ServerMemberItem {
  label: string;
  type: "member";
  data: Member[] | undefined;
}

export interface ServerChannelItem {
  label: string;
  type: "channel";
  data: Channel[] | undefined;
}

interface ServerSearchProps {
  data: (ServerMemberItem | ServerChannelItem)[];
}

export function ServerSearch({ data }: ServerSearchProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  const handleSelect = ({ id, type }: SelectParams) => {
    setOpen(false);
    const path =
      type === "member"
        ? `/servers/${params?.serverId}/conversations/${id}`
        : `/servers/${params?.serverId}/channels/${id}`;
    router.push(path);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 
         dark:hover:bg-zinc-700/50 transition"
      >
        <Search className="size-4 text-zinc-500 dark:text-zinc-400" />
        <p
          className="
              font-semibold text-sm text-zinc-500 
            dark:text-zinc-400 group-hover:text-zinc-600 
            dark:group-hover:text-zinc-300 transition"
        >
          Search
        </p>
        <kbd
          className="
          pointer-events-none inline-flex h-5 
          select-none items-center gap-1 rounded 
          border bg-muted px-1.5 font-mono text-[10px]
          font-medium text-muted-foreground ml-auto  
        "
        >
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search all channels and members" />
        <CommandList>
          <CommandEmpty>No results found</CommandEmpty>
          {data.map(
            ({
              label,
              type,
              data: items
            }: ServerMemberItem | ServerChannelItem) => {
              if (!items?.length) return null;
              return (
                <CommandGroup key={label} heading={label}>
                  {items.map(({ icon, name, id }: Member | Channel) => (
                    <CommandItem
                      onSelect={() => handleSelect({ id, type })}
                      key={id}
                    >
                      {icon}
                      <span>{name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            }
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
