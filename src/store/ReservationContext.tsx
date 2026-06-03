import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router";
import { useSocketConnection } from "../hooks/useSocketConnection";
import { UserContext } from "./UserContext";
import { applySeatSelections } from "./reservationSeatUpdates";
import { ReservationContextType } from "./reservationTypes";
import { useReservationActions } from "./useReservationActions";
import { useReservationSocketEvents } from "./useReservationSocketEvents";
import {
  AreaSocket,
  OrderResponseData,
  ReservedSeatsStatisticResponse,
  Seat,
  SeatsSelectedResponse,
} from "../types/api/socket";

export const ReservationContext = createContext<ReservationContextType>(
  {} as ReservationContextType
);

export const useReservationContext = () => {
  const context = useContext(ReservationContext);
  if (!context)
    throw new Error(
      "useReservationContext must be used within a ReservationProvider"
    );
  return context;
};

export const ReservationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { userId } = useContext(UserContext);
  const { socket, isConnected, tokenError } = useSocketConnection();
  const [eventId, setEventId] = useState<string | null>(null);
  const [eventDateId, setEventDateId] = useState<string | null>(null);
  const [seatsMap, setSeatsMap] = useState<Map<string, Seat>>(new Map());
  const [areasMap, setAreasMap] = useState<Map<string, AreaSocket>>(new Map());
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [currentAreaId, setCurrentAreaId] = useState<string | null>(null);
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [areaStats, setAreaStats] = useState<ReservedSeatsStatisticResponse[]>(
    []
  );
  const [currentOrder, setCurrentOrder] = useState<OrderResponseData | null>(
    null
  );
  const navigate = useNavigate();

  const updateSeats = useCallback(
    (seats: SeatsSelectedResponse[]) =>
      setSeatsMap((prev) =>
        applySeatSelections(prev, seats, socket?.id, setSelectedSeats)
      ),
    [socket?.id]
  );

  const joinRoom = useCallback(() => {
    if (socket && eventId && eventDateId)
      socket.emit("joinRoom", { eventId, eventDateId });
  }, [eventDateId, eventId, socket]);

  const actions = useReservationActions({
    currentAreaId,
    eventDateId,
    eventId,
    setSelectedSeats,
    socket,
    userId,
  });

  useReservationSocketEvents({
    navigate,
    socket,
    tokenError,
    updateSeats,
    setAreaStats,
    setAreasMap,
    setCurrentUserId,
    setSeatsMap,
  });

  useEffect(() => {
    if (socket && eventId && eventDateId) joinRoom();
  }, [eventDateId, eventId, joinRoom, socket]);

  return (
    <ReservationContext.Provider
      value={{
        socket,
        isConnected,
        eventId,
        setEventId,
        eventDateId,
        setEventDateId,
        seatsMap,
        selectSeats: actions.selectSeats,
        currentUserId,
        selectedSeats,
        setSelectedSeats,
        reserveSeat: actions.reserveSeat,
        requestOrder: actions.requestOrder,
        numberOfTickets,
        setNumberOfTickets,
        areasMap,
        joinArea: actions.joinArea,
        setSeatsMap,
        currentAreaId,
        setCurrentAreaId,
        exitArea: actions.exitArea,
        exitRoom: actions.exitRoom,
        areaStats,
        currentOrder,
        setCurrentOrder,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};
