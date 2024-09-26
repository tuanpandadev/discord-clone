"use client";

import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import qs from "query-string";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";

import { useModal } from "@/hooks/use-modal-store";

const formSchema = z.object({
  fileUrl: z.string().min(1, {
    message: "Attachment is required."
  }),
  fileType: z.string()
});

export const MessageFileModal = () => {
  const router = useRouter();

  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "messageFile";
  const { query, apiUrl } = data;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileType: "",
      fileUrl: ""
    }
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query
      });
      await axios.post(url, {
        ...values,
        fileUrl: undefined,
        content: values.fileUrl
      });
      handleClose();

      router.refresh();
    } catch (error) {
      console.error(error);
      handleClose();
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      form.reset();
    }, 1000);
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Add an attachment
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Send a file as a message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value}
                          onChange={(url, fileType) => {
                            form.setValue("fileUrl", url!);
                            form.setValue("fileType", fileType!);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant="primary" disabled={isLoading}>
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
