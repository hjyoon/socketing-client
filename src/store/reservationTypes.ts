import {
  AreaSocket,
  OrderResponseData,
  ReservedSeatsStatisticResponse,
  Seat,
  SocketType,
} from "../types/api/socket";

export interface ReservationContextType {
  socket: SocketType | null;
  isConnected: boolean;
  eventId: string | null;
  setEventId: (id: string) => void;
  eventDateId: string | null;
  setEventDateId: (id: string) => void;
  seatsMap: Map<string, Seat>;
  selectSeats: (seatId: string, areaId: string, numberOfSeats: number) => void;
  currentUserId: string | null;
  selectedSeats: Seat[];
  setSelectedSeats: (seats: Seat[]) => void;
  reserveSeat: (seatIds: string[]) => void;
  requestOrder: (userId: string, orderId: string) => void;
  numberOfTickets: number;
  setNumberOfTickets: (count: number) => void;
  areasMap: Map<string, AreaSocket>;
  joinArea: (areaId: string) => void;
  setSeatsMap: (seatsMap: Map<string, Seat>) => void;
  currentAreaId: string | null;
  setCurrentAreaId: (currentAreaId: string) => void;
  exitArea: (areaId: string) => void;
  exitRoom: () => void;
  areaStats: ReservedSeatsStatisticResponse[];
  currentOrder: OrderResponseData | null;
  setCurrentOrder: (currentOrder: OrderResponseData | null) => void;
}
