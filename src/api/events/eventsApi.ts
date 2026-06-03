import { baseURL } from "../../constants/api";
import {
  EventsResponse,
  SingleEventResponse,
  NewEvent,
  NewEventResponse,
  EventDeleteResponse,
  NewAreasResponse,
  CreateAreaRequest,
} from "../../types/api/event";
import { OrderSeatResponse } from "../../types/api/order";
import { apiRequest } from "../http";

const API_URL = baseURL + "events/";

const fetchAllEvents = async (): Promise<EventsResponse> => {
  return apiRequest<EventsResponse>(API_URL, { auth: true });
};

const fetchOneEvent = async (
  event_id: string
): Promise<SingleEventResponse> => {
  return apiRequest<SingleEventResponse>(API_URL + event_id, { auth: true });
};

const createNewEvent = async ({
  title,
  thumbnail,
  place,
  cast,
  ageLimit,
  eventDates,
  svg,
  ticketingStartTime,
}: NewEvent): Promise<NewEventResponse> => {
  return apiRequest<NewEventResponse>(API_URL, {
    auth: true,
    body: {
      title,
      thumbnail,
      place,
      cast,
      ageLimit,
      eventDates,
      svg,
      ticketingStartTime,
    },
    method: "POST",
  });
};

const deleteEvent = async (event_id: string): Promise<EventDeleteResponse> => {
  return apiRequest<EventDeleteResponse>(API_URL + event_id, {
    auth: true,
    method: "DELETE",
  });
};

const createNewArea = async ({
  event_id,
  areas,
}: CreateAreaRequest): Promise<NewAreasResponse> => {
  return apiRequest<NewAreasResponse>(API_URL + event_id + "/seats/batch", {
    auth: true,
    body: { areas },
    method: "POST",
  });
};

const fetchAllSeats = async (event_id: string): Promise<OrderSeatResponse> => {
  return apiRequest<OrderSeatResponse>(API_URL + event_id + "/seats", {
    auth: true,
  });
};

export {
  fetchAllEvents,
  fetchOneEvent,
  createNewEvent,
  createNewArea,
  fetchAllSeats,
  deleteEvent,
};
