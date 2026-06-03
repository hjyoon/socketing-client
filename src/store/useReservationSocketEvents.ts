import { Dispatch, SetStateAction, useEffect } from "react";
import { NavigateFunction } from "react-router";
import { toast } from "react-toastify";
import {
  AreaSocket,
  ReservedSeatsStatisticResponse,
  Seat,
  SeatsSelectedResponse,
  SocketType,
} from "../types/api/socket";

interface Args {
  navigate: NavigateFunction;
  socket: SocketType | null;
  tokenError: string | null;
  updateSeats: (data: SeatsSelectedResponse[]) => void;
  setAreaStats: Dispatch<SetStateAction<ReservedSeatsStatisticResponse[]>>;
  setAreasMap: Dispatch<SetStateAction<Map<string, AreaSocket>>>;
  setCurrentUserId: Dispatch<SetStateAction<string | null>>;
  setSeatsMap: Dispatch<SetStateAction<Map<string, Seat>>>;
}

export const useReservationSocketEvents = ({
  navigate,
  socket,
  tokenError,
  updateSeats,
  setAreaStats,
  setAreasMap,
  setCurrentUserId,
  setSeatsMap,
}: Args) => {
  useEffect(() => {
    if (!socket) return;

    if (tokenError) {
      const [, , eventId, eventDateId] = window.location.pathname.split("/");
      void navigate(`/waiting/${eventId}/${eventDateId}`);
    }
    if (socket.id) setCurrentUserId(socket.id);

    const onConnect = () => socket.id && setCurrentUserId(socket.id);
    const onRoomJoined = (data: { areas: AreaSocket[] }) =>
      setAreasMap(new Map(data.areas.map((area) => [area.id, area])));
    const onAreaJoined = (data: { seats: Seat[] }) =>
      setSeatsMap(new Map(data.seats.map((seat) => [seat.id, seat])));
    const onError = (data: { message?: string }) => toast.error(data.message);

    socket.on("connect", onConnect);
    socket.on("roomJoined", onRoomJoined);
    socket.on("areaJoined", onAreaJoined);
    socket.on("seatsSelected", updateSeats);
    socket.on("reservedSeatsStatistic", setAreaStats);
    socket.on("error", onError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("roomJoined", onRoomJoined);
      socket.off("areaJoined", onAreaJoined);
      socket.off("seatsSelected", updateSeats);
      socket.off("reservedSeatsStatistic", setAreaStats);
      socket.off("error", onError);
    };
  }, [
    navigate,
    socket,
    tokenError,
    updateSeats,
    setAreaStats,
    setAreasMap,
    setCurrentUserId,
    setSeatsMap,
  ]);
};
