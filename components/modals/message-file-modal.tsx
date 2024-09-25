"use client";

import { Dialog } from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";

export const MessageFileModal = () => {
  const { isOpen, onClose } = useModal();

  return <Dialog open={isOpen} onOpenChange={onClose}></Dialog>;
};
