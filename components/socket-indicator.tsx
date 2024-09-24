"use client";

import React from "react";

import { useSocket } from "@/hooks/use-socket";
import { Badge } from "@/components/ui/badge";

export function SocketIndicator() {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge variant="outline" className="bg-yellow-600 text-white border-none">
        Fall back: Polling every 1s
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="bg-emerald-600 text-white border-none">
      Live: Real-time updates
    </Badge>
  );
}
