import {
  NewReservation,
  NewReservationResponse,
  ReservationsResponse,
} from "../../types/api/reservation";
import { baseURL } from "../../constants/api";
import { apiRequest } from "../http";

const API_URL = baseURL + "reservations";

const createNewReservation = async ({
  eventId,
  eventDateId,
  seatId,
}: NewReservation): Promise<NewReservationResponse> => {
  return apiRequest<NewReservationResponse>(API_URL, {
    auth: true,
    body: { eventId, eventDateId, seatId },
    method: "POST",
  });
};

const fetchOneReservation = async (
  reservation_id: string
): Promise<NewReservationResponse> => {
  return apiRequest<NewReservationResponse>(API_URL + "/" + reservation_id, {
    auth: true,
  });
};

const fetchReservationsByEvent = async (
  event_id: string
): Promise<ReservationsResponse> => {
  return apiRequest<ReservationsResponse>(API_URL, {
    auth: true,
    params: { eventId: event_id },
  });
};

const fetchReservationsByUser = async (): Promise<ReservationsResponse> => {
  return apiRequest<ReservationsResponse>(API_URL, { auth: true });
};

export {
  createNewReservation,
  fetchOneReservation,
  fetchReservationsByEvent,
  fetchReservationsByUser,
};
