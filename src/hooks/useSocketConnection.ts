import { useEffect, useState } from "react";
import { SOCKET_SERVER_URL } from "../constants/socket";
import { SocketType } from "../types/api/socket";
import { createWebSocketUrl, EventWebSocket } from "../utils/EventWebSocket";

export const useSocketConnection = () => {
  const [socket, setSocket] = useState<SocketType | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("entranceToken");
    const nextSocket = new EventWebSocket(
      createWebSocketUrl(SOCKET_SERVER_URL, token)
    );
    setSocket(nextSocket);

    nextSocket.on("connect", () => {
      console.log("Socket connected!");
      setIsConnected(true);
      setTokenError(null);
    });

    nextSocket.on<{ message?: string }>("connect_error", (err) => {
      console.error("Connection error:", err.message);

      if (err.message === "Authentication error 2") {
        setTokenError(err.message);
      }
    });

    nextSocket.on("disconnect", () => {
      console.log("Socket disconnected!");
      setIsConnected(false);
    });

    return () => {
      nextSocket.disconnect();
      setSocket(null);
    };
  }, []);

  return { socket, isConnected, tokenError };
};
