import { useContext } from "react";

import { SocketContext } from "@/components/providers/socket-provider";

export const useSocket = () => {
  return useContext(SocketContext);
};
