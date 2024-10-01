"use client";

import { useEffect, useState } from "react";
import { io as ClientIO, Socket } from "socket.io-client";

import { createContext } from "react";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<null | Socket>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    function onDisconnect() {
      setIsConnected(false);
    }
    function onConnect() {
      setIsConnected(true);
    }

    const socketInstance = ClientIO(process.env.NEXT_PUBLIC_SITE_URL!, {
      path: "/api/socket/io",
      addTrailingSlash: false
    });

    if (socketInstance.connected) {
      onConnect();
    }

    socketInstance.on("connect", onConnect);
    socketInstance.on("disconnect", onDisconnect);

    setSocket(socketInstance);

    return () => {
      socketInstance.off("connect", onConnect);
      socketInstance.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
