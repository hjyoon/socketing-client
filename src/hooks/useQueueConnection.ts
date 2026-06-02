import { useEffect, useState } from "react";
import { QUEUE_SERVER_URL } from "../constants/socket";
import { QueueType } from "../types/api/queue";
import { createWebSocketUrl, EventWebSocket } from "../utils/EventWebSocket";

export const useQueueConnection = () => {
  const [socket, setSocket] = useState<QueueType | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const nextSocket = new EventWebSocket(
      createWebSocketUrl(QUEUE_SERVER_URL, token)
    );
    setSocket(nextSocket);

    nextSocket.on("connect", () => {
      console.log("Queue Socket connected!");
      setIsConnected(true);
    });

    nextSocket.on("disconnect", () => {
      console.log("Queue Socket disconnected!");
      setIsConnected(false);
    });

    return () => {
      nextSocket.disconnect();
      setSocket(null);
    };
  }, []);

  return { socket, isConnected };
};
