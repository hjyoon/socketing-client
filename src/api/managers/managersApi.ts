import {
  AllEventManagementResponse,
  EventManagementResponse,
} from "../../types/api/managers";
import { baseURL } from "../../constants/api";
import { apiRequest } from "../http";

const API_URL = baseURL + "managers/events/";

const fetchOneEventForManager = async (
  eventId: string,
  eventDateId: string
): Promise<EventManagementResponse> => {
  return apiRequest<EventManagementResponse>(
    `${API_URL}${eventId}/reservation-status`,
    { auth: true, params: { eventDateId } }
  );
};

const fetchAllEventForManager =
  async (): Promise<AllEventManagementResponse> => {
    return apiRequest<AllEventManagementResponse>(API_URL, { auth: true });
  };

export { fetchOneEventForManager, fetchAllEventForManager };
