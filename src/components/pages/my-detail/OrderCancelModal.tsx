import { toast } from "react-toastify";
import Button from "../../atoms/buttons/Button";

interface Props {
  close: () => void;
  confirm: () => Promise<void>;
}

const OrderCancelModal = ({ close, confirm }: Props) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div className="bg-white rounded-lg shadow-lg mx-8 md:mx-auto p-6 w-96">
      <h2 className="text-xl font-bold mb-4">예매 취소</h2>
      <p className="text-gray-600 mb-6">정말 예매를 취소하시겠습니까?</p>
      <div className="flex justify-end space-x-4">
        <Button
          size="sm"
          onClick={() =>
            void confirm().catch(() =>
              toast.error("취소 처리 중 문제가 발생했습니다.")
            )
          }
          className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
        >
          예매 취소
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={close}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
        >
          뒤로 가기
        </Button>
      </div>
    </div>
  </div>
);

export default OrderCancelModal;
