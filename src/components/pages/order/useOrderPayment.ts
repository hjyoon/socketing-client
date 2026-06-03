import { useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { Event } from "../../../types/api/event";
import {
  ApprovedOrderResponse,
  OrderResponseData,
} from "../../../types/api/socket";
import { getUserPoints } from "../../../api/users/usersApi";
import { useReservationContext } from "../../../store/ReservationContext";
import { UserContext } from "../../../store/UserContext";

export const useOrderPayment = (
  orderData?: OrderResponseData,
  eventData?: Event
) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userId } = useContext(UserContext);
  const { requestOrder, socket } = useReservationContext();
  const [isAgreed, setIsAgreed] = useState(false);
  const [userPoints, setUserPoints] = useState(-1);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    getUserPoints(userId)
      .then((response) =>
        setUserPoints(
          response.code === 0 && response.data ? (response.data.point ?? 0) : -1
        )
      )
      .catch(() => toast.error("금액 조회 중 문제가 발생했습니다."));
  }, [userId]);

  const handlePayment = async () => {
    if (!validatePayment({ isAgreed, orderData, paymentMethod, userPoints }))
      return;
    if (!socket || !userId || !eventData || !orderData) return;

    requestOrder(userId, orderData.id);
    await queryClient.invalidateQueries({ queryKey: [`my-orders-${userId}`] });
    socket.on("orderApproved", (response: ApprovedOrderResponse) => {
      void navigate("/reservation-confirmation", {
        state: { paymentData: response.data },
      });
    });
  };

  return { handlePayment, setIsAgreed, setPaymentMethod, userId, userPoints };
};

const validatePayment = ({
  isAgreed,
  orderData,
  paymentMethod,
  userPoints,
}: {
  isAgreed: boolean;
  orderData?: OrderResponseData;
  paymentMethod: string | null;
  userPoints: number;
}) => {
  if (!isAgreed) return showError("구매조건 확인 및 결제 진행에 동의해주세요!");
  if (userPoints === -1) return showError("먼저 보유하신 금액를 조회해주세요!");
  if (!paymentMethod) return showError("결제 방법을 선택해주세요!");
  if (!orderData) return showError("주문 데이터가 없습니다!");
  if (userPoints < orderData.area.price * orderData.seats.length)
    return showError("잔액 부족!");
  return true;
};

const showError = (message: string) => {
  toast.error(message);
  return false;
};
