interface Props {
  setPaymentMethod: (method: string) => void;
  userPoints: number;
}

const PaymentMethodBox = ({ setPaymentMethod, userPoints }: Props) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-lg font-bold mb-4">결제 방법</h2>
    <div className="text-sm">
      <input
        type="radio"
        id="socket_pay"
        className="mr-2"
        name="paymentMethod"
        onChange={() => setPaymentMethod("socket_pay")}
      />
      <label htmlFor="socket_pay" className="pr-24 md:pr-10">
        보유 금액
      </label>
      <span className="font-bold">{userPoints.toLocaleString()} 원</span>
    </div>
  </div>
);

export default PaymentMethodBox;
