import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import MainLayout from "../layout/MainLayout";
import { cancelOrder, getOneOrder } from "../../api/orders/ordersApi";
import { fetchAllSeats } from "../../api/events/eventsApi";
import { createResourceQuery } from "../../hooks/useCustomQuery";
import { UserContext } from "../../store/UserContext";
import { GetOneOrderResponse, OrderSeat } from "../../types/api/order";
import {
  cancelOrderErrorMessages,
  fetchErrorMessages,
} from "../../constants/errorMessages";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";
import OrderCancelModal from "./my-detail/OrderCancelModal";
import OrderDetailCard from "./my-detail/OrderDetailCard";
import SeatLocationModal from "./my-detail/SeatLocationModal";

const MyDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { userId } = useContext(UserContext);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [seatsData, setSeatsData] = useState<OrderSeat[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const useOneOrder = createResourceQuery<GetOneOrderResponse>(
    `my-order-${userId}`,
    (id) => getOneOrder(id)
  );
  const { data, isLoading, isError } = useOneOrder(orderId);

  if (isLoading) return <LoadingPage />;
  if (isError) return <ErrorPage errorMessage={fetchErrorMessages.general} />;
  if (!data?.data)
    return <ErrorPage errorMessage={fetchErrorMessages.noReservationData} />;

  const order = data.data;
  const openSeatModal = async () => {
    setSelectedSeatIds(
      order.reservations.map((reservation) => reservation.seatId)
    );
    const seatData = await fetchAllSeats(order.eventId);
    setSeatsData(seatData.data ?? []);
    setIsShowModalOpen(true);
  };

  const cancelReservation = async () => {
    setIsCancelModalOpen(false);
    await handleCancelOrder(orderId);
    await queryClient.invalidateQueries({ queryKey: [`my-orders-${userId}`] });
    void navigate("/mypage");
  };

  return (
    <MainLayout>
      <div className="p-5 md:p-10 overflow-y-auto max-h-[calc(100%-64px)]">
        <OrderDetailCard
          order={order}
          openCancelModal={() => setIsCancelModalOpen(true)}
          openSeatModal={() => void openSeatModal()}
        />
      </div>
      {isCancelModalOpen && (
        <OrderCancelModal
          close={() => setIsCancelModalOpen(false)}
          confirm={cancelReservation}
        />
      )}
      {isShowModalOpen && (
        <SeatLocationModal
          close={() => setIsShowModalOpen(false)}
          order={order}
          seatsData={seatsData}
          selectedSeatIds={selectedSeatIds}
        />
      )}
    </MainLayout>
  );
};

const handleCancelOrder = async (orderId?: string) => {
  try {
    const response = await cancelOrder(orderId!);
    if (response.code === 0) {
      toast.success(cancelOrderErrorMessages.success);
      return;
    }
    toast.error(getCancelErrorMessage(response.code));
  } catch {
    toast.error("취소 처리 중 오류가 발생했습니다.");
  }
};

const getCancelErrorMessage = (code: number) => {
  if (code === 8) return cancelOrderErrorMessages.unauthorized;
  if (code === 15) return cancelOrderErrorMessages.notFound;
  if (code === 22) return cancelOrderErrorMessages.alreadyCanceled;
  if (code === 6) return cancelOrderErrorMessages.internalServerError;
  return "알 수 없는 오류가 발생했습니다.";
};

export default MyDetailPage;
