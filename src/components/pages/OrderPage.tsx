import { useLocation } from "react-router";
import MainLayout from "../layout/MainLayout";
import PaymentTimer from "../molecules/timer/PaymentTimer";
import ErrorPage from "./ErrorPage";
import { Event } from "../../types/api/event";
import { OrderResponseData } from "../../types/api/socket";
import OrderCustomerInfo from "./order/OrderCustomerInfo";
import OrderTicketInfo from "./order/OrderTicketInfo";
import PaymentActionBox from "./order/PaymentActionBox";
import PaymentMethodBox from "./order/PaymentMethodBox";
import PaymentSummary from "./order/PaymentSummary";
import { useOrderPayment } from "./order/useOrderPayment";

const OrderPage = () => {
  const location = useLocation();
  const state = location.state as {
    orderData?: OrderResponseData;
    eventData?: Event;
  } | null;
  const orderData = state?.orderData;
  const eventData = state?.eventData;
  const payment = useOrderPayment(orderData, eventData);

  if (!payment.userId) return <ErrorPage />;
  if (!orderData || !eventData)
    return <ErrorPage errorMessage="예매 정보가 없습니다" />;

  return (
    <MainLayout>
      <div className="bg-gray-100 flex justify-center md:h-full">
        <div className="max-w-4xl py-10 px-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">결제 정보</h1>
            <PaymentTimer />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <OrderTicketInfo eventData={eventData} orderData={orderData} />
              <OrderCustomerInfo />
            </div>
            <div className="space-y-6">
              <PaymentSummary orderData={orderData} />
              <PaymentMethodBox
                setPaymentMethod={payment.setPaymentMethod}
                userPoints={payment.userPoints}
              />
              <PaymentActionBox
                handlePayment={payment.handlePayment}
                setIsAgreed={payment.setIsAgreed}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderPage;
