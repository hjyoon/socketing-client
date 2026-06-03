import { Dispatch, SetStateAction } from "react";
import { Seat, SeatsSelectedResponse } from "../types/api/socket";

export const applySeatSelections = (
  prev: Map<string, Seat>,
  seats: SeatsSelectedResponse[],
  socketId: string | undefined,
  setSelectedSeats: Dispatch<SetStateAction<Seat[]>>
) => {
  const next = new Map(prev);

  seats.forEach((seat) => {
    const current = next.get(seat.seatId);
    if (!current) return;

    const updated = { ...current, ...seat, areaId: current.areaId };
    next.set(seat.seatId, updated);

    if (seat.selectedBy === socketId) {
      setSelectedSeats((selected) => upsertSeat(selected, updated));
      return;
    }

    if (current.selectedBy === socketId && seat.selectedBy === null) {
      setSelectedSeats((selected) =>
        selected.filter((item) => item.id !== seat.seatId)
      );
    }
  });

  return next;
};

const upsertSeat = (selected: Seat[], seat: Seat) =>
  selected.some((item) => item.id === seat.id)
    ? selected.map((item) => (item.id === seat.id ? seat : item))
    : [...selected, seat];
