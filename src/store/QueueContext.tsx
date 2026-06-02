import React, { createContext, useEffect, useContext, useState } from "react";
import { useQueueConnection } from "../hooks/useQueueConnection";
import {
  QueueType,
  SeatsInfoResponse,
  TokenResponse,
  UpdatedQueueResponse,
} from "../types/api/queue";

interface QueueContextType {
  socket: QueueType | null;
  isConnected: boolean;
  isTurn: boolean;
  eventId: string | null;
  setEventId: (id: string) => void;
  eventDateId: string | null;
  setEventDateId: (id: string) => void;
  myPosition: number | null;
  totalWaiting: number | null;
  selectedSeatIds: string[];
}

export const QueueContext = createContext<QueueContextType>(
  {} as QueueContextType
);

export const useQueueContext = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error("useQueueContext must be used within a QueueProvider");
  }
  return context;
};

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { socket, isConnected } = useQueueConnection();
  const [isTurn, setIsTurn] = useState(false);
  const [eventId, setEventId] = useState<string | null>(null);
  const [eventDateId, setEventDateId] = useState<string | null>(null);
  const [myPosition, setMyPosition] = useState<number | null>(null);
  const [totalWaiting, setTotalWaiting] = useState<number | null>(null);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);

  useEffect(() => {
    if (!socket || !eventId || !eventDateId) return;

    const handleTokenIssued = (data: TokenResponse) => {
      localStorage.setItem("entranceToken", data.token);
      setIsTurn(true);
    };

    const handleUpdateQueue = (data: UpdatedQueueResponse) => {
      setMyPosition(data.yourPosition);
      setTotalWaiting(data.totalWaiting);
    };

    const handleSeatsInfo = (data: SeatsInfoResponse) => {
      const seatIds = data.seatsInfo.map((item) => item.seat_id);
      setSelectedSeatIds(seatIds);
    };

    socket.on("tokenIssued", handleTokenIssued);
    socket.on("updateQueue", handleUpdateQueue);
    socket.on("seatsInfo", handleSeatsInfo);
    socket.emit("joinQueue", { eventId, eventDateId });

    return () => {
      socket.off("tokenIssued", handleTokenIssued);
      socket.off("updateQueue", handleUpdateQueue);
      socket.off("seatsInfo", handleSeatsInfo);
    };
  }, [eventDateId, eventId, socket]);

  const value = {
    socket,
    isConnected,
    isTurn,
    eventId,
    setEventId,
    eventDateId,
    setEventDateId,
    myPosition,
    totalWaiting,
    selectedSeatIds,
  };

  return (
    <QueueContext.Provider value={value}>{children}</QueueContext.Provider>
  );
};
