import { OrderResponseData } from "../../../types/api/socket";

const PaymentSummary = ({ orderData }: { orderData: OrderResponseData }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-lg font-bold mb-4">최종 결제금액</h2>
    <div className="space-y-2 text-sm text-gray-600">
      {orderData.seats.map((seat) => (
        <div className="flex justify-between" key={seat.id}>
          <span>
            {orderData.area.label}구역 {seat.row}열 {seat.number}번
          </span>
          <span>{orderData.area.price}원</span>
        </div>
      ))}
      <hr className="my-2" />
      <div className="flex justify-between font-bold text-gray-800">
        <span>총 결제금액</span>
        <span>{orderData.area.price * orderData.seats.length}원</span>
      </div>
    </div>
  </div>
);

export default PaymentSummary;
