"use client";

import { useState } from "react";
import axios from "axios";
import qs from "query-string";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useModal } from "@/hooks/use-modal-store";

export const DeleteMessageModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "deleteMessage";
  const [isLoading, setIsLoading] = useState(false);
  const { apiUrl, query } = data;

  const handleConfirmDelete = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query
      });
      await axios.delete(url);

      router.refresh();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this? <br />
            The message will be deleted permanently.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center md:justify-between md:gap-x-0 justify-end w-full gap-x-2">
            <Button disabled={isLoading} variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              className="bg-red-500 text-white hover:bg-red-500/80"
              onClick={handleConfirmDelete}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
