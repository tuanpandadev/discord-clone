"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Plus } from "lucide-react";
import qs from "query-string";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { EmojiPicker } from "@/components/emoji-picker";

import { useModal } from "@/hooks/use-modal-store";

interface ChatInputProps {
  apiUrl: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: Record<string, any>;
  name: string;
  type: "channel" | "conversation";
}

const formSchema = z.object({
  content: z.string().min(1)
});

export function ChatInput({ apiUrl, query, name, type }: ChatInputProps) {
  const { onOpen } = useModal();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { content: "" }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query
      });
      await axios.post(url, values);
    } catch (error) {
      console.error(error);
    } finally {
      form.reset();
      router.refresh();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <Button
                    className="
                        absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 
                        dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 
                        transition rounded-full p-1 flex items-center justify-center
                    "
                    type="button"
                    onClick={() => onOpen("messageFile", { query, apiUrl })}
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </Button>
                  <Input
                    placeholder={`Message ${
                      type === "conversation" ? name : "#" + name
                    }`}
                    disabled={isLoading}
                    className="
                        px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 
                        border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0
                        text-zinc-600 dark:text-zinc-200 rounded-xl
                    "
                    {...field}
                  />
                  <div className="absolute top-7 right-8">
                    <EmojiPicker
                      onChange={(emoji) =>
                        field.onChange(`${field.value} ${emoji}`)
                      }
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
