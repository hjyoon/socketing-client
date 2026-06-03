import {
  NewPayment,
  UpdatedPaymentResponse,
  UpdatePayment,
} from "../../types/api/payment";
import { baseURL } from "../../constants/api";
import { apiRequest } from "../http";

const API_URL = baseURL + "payments/";

// 새 결제 요청
const createNewPayment = async ({
  orderId,
  paymentMethod,
  totalAmount,
  eventDateId,
  seatIds,
}: NewPayment): Promise<UpdatedPaymentResponse> => {
  return apiRequest<UpdatedPaymentResponse>(API_URL, {
    auth: "required",
    authMessage: "인증 토큰이 없습니다.",
    body: {
      orderId,
      paymentMethod,
      totalAmount,
      eventDateId,
      seatIds,
    },
    method: "POST",
  });
};

// 결제 업데이트 요청
const updatePayment = async ({
  orderId,
  paymentId,
  newPaymentStatus,
}: UpdatePayment): Promise<UpdatedPaymentResponse> => {
  try {
    return await apiRequest<UpdatedPaymentResponse>(API_URL, {
      auth: "required",
      body: {
        orderId, // 주문 ID 추가
        paymentId,
        newPaymentStatus,
      },
      method: "PATCH",
    });
  } catch (error) {
    console.error("결제 상태 업데이트 실패:", error);
    throw error;
  }
};
export { createNewPayment, updatePayment };
