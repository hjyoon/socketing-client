import { Dispatch, SetStateAction } from "react";
import { Seat, SocketType } from "../types/api/socket";

interface Args {
  currentAreaId: string | null;
  eventDateId: string | null;
  eventId: string | null;
  setSelectedSeats: Dispatch<SetStateAction<Seat[]>>;
  socket: SocketType | null;
  userId: string | null;
}

export const useReservationActions = ({
  currentAreaId,
  eventDateId,
  eventId,
  setSelectedSeats,
  socket,
  userId,
}: Args) => {
  const room = { eventDateId, eventId };

  return {
    exitArea: (areaId: string) => {
      if (socket && eventId && eventDateId)
        socket.emit("exitArea", { ...room, areaId });
    },
    exitRoom: () => {
      if (socket && eventId && eventDateId) socket.emit("exitRoom", room);
    },
    joinArea: (areaId: string) => {
      if (!socket || !eventId || !eventDateId) return;
      setSelectedSeats([]);
      socket.emit("joinArea", { ...room, areaId });
    },
    requestOrder: (nextUserId: string, orderId: string) => {
      if (!socket || !eventId || !eventDateId || !nextUserId || !currentAreaId)
        return;
      socket.emit("requestOrder", {
        ...room,
        areaId: currentAreaId,
        orderId,
        paymentMethod: "socket_pay",
        userId: nextUserId,
      });
    },
    reserveSeat: (seatIds: string[]) => {
      if (!socket || !eventId || !eventDateId || !currentAreaId || !userId)
        return;
      socket.emit("reserveSeats", {
        ...room,
        areaId: currentAreaId,
        seatIds,
        userId,
      });
    },
    selectSeats: (seatId: string, areaId: string, numberOfSeats: number) => {
      if (!socket || !eventId || !eventDateId) return;
      socket.emit("selectSeats", { ...room, areaId, numberOfSeats, seatId });
    },
  };
};
