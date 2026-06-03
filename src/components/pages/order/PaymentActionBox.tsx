import { toast } from "react-toastify";
import Button from "../../atoms/buttons/Button";

interface Props {
  handlePayment: () => Promise<void>;
  setIsAgreed: (agreed: boolean) => void;
}

const PaymentActionBox = ({ handlePayment, setIsAgreed }: Props) => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center">
    <div className="flex items-center space-x-2 mb-4">
      <input
        type="checkbox"
        id="agree"
        onChange={(event) => setIsAgreed(event.target.checked)}
      />
      <label htmlFor="agree" className="text-sm text-gray-600">
        구매조건 확인 및 결제 진행에 동의
      </label>
    </div>
    <Button
      onClick={() =>
        void handlePayment().catch(() =>
          toast.error("결제 처리 중 문제가 발생했습니다.")
        )
      }
      className="text-sm w-full"
    >
      결제하기
    </Button>
  </div>
);

export default PaymentActionBox;
