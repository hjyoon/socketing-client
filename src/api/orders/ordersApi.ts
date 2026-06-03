import {
  GetAllOrderResponse,
  GetOneOrderResponse,
} from "../../types/api/order";
import { baseURL } from "../../constants/api";
import { ApiResponse } from "../../types/api/common";
import { apiRequest } from "../http";

const API_URL = baseURL + "orders/";

const cancelOrder = async (orderId: string): Promise<ApiResponse<"">> => {
  return apiRequest<ApiResponse<"">>(API_URL + `${orderId}/cancel`, {
    auth: true,
    method: "POST",
  });
};

const getAllOrder = async (eventId?: string): Promise<GetAllOrderResponse> => {
  return apiRequest<GetAllOrderResponse>(API_URL, {
    auth: true,
    params: { eventId },
  });
};

const getOneOrder = async (orderId: string): Promise<GetOneOrderResponse> => {
  return apiRequest<GetOneOrderResponse>(API_URL + orderId, { auth: true });
};

export { cancelOrder, getAllOrder, getOneOrder };
