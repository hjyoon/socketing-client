import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { fetchAllSeats, fetchOneEvent } from "../../../api/events/eventsApi";
import { createResourceQuery } from "../../../hooks/useCustomQuery";
import { useQueueContext } from "../../../store/QueueContext";
import { OrderSeatResponse } from "../../../types/api/order";
import { SingleEventResponse } from "../../../types/api/event";

export const useWaitingRoom = () => {
  const { eventId: urlEventId, eventDateId: urlEventDateId } = useParams();
  const queue = useQueueContext();
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [progress, setProgress] = useState(0);
  const [initNum, setInitNum] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const useEvent = createResourceQuery<SingleEventResponse>(
    "single-event",
    fetchOneEvent
  );
  const useSeats = createResourceQuery<OrderSeatResponse>(
    "fetch-all-seats",
    fetchAllSeats
  );
  const eventResult = useEvent(urlEventId ?? "");
  const seatResult = useSeats(urlEventId ?? "");

  useEffect(() => {
    const state = location.state as { numberOfTickets?: number };
    if (state?.numberOfTickets) setNumberOfTickets(state.numberOfTickets);
  }, [location.state]);

  useEffect(() => {
    if (urlEventId) queue.setEventId(urlEventId);
    if (urlEventDateId) queue.setEventDateId(urlEventDateId);
  }, [queue, urlEventDateId, urlEventId]);

  useEffect(() => {
    if (queue.isTurn) {
      void navigate(`/reservation/${urlEventId}/${urlEventDateId}`, {
        state: { numberOfTickets },
      });
    }
  }, [navigate, numberOfTickets, queue.isTurn, urlEventDateId, urlEventId]);

  useEffect(() => {
    if (!queue.myPosition) return;
    if (initNum === 0) setInitNum(queue.myPosition);
    setProgress(
      initNum > 0 ? 100 - ((queue.myPosition - 1) / initNum) * 100 : 0
    );
  }, [initNum, queue.myPosition]);

  return {
    eventData: eventResult.data,
    eventError: eventResult.isError,
    eventLoading: eventResult.isLoading,
    isConnected: queue.isConnected,
    myPosition: queue.myPosition,
    progress,
    seatData: seatResult.data,
    seatError: seatResult.isError,
    seatLoading: seatResult.isLoading,
    selectedSeatIds: queue.selectedSeatIds,
    totalWaiting: queue.totalWaiting,
  };
};
