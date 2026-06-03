import Button from "../../atoms/buttons/Button";
import MySeatContainer from "../../organisms/seat-container/MySeatContainer";
import { GetOrder, OrderSeat } from "../../../types/api/order";

interface Props {
  close: () => void;
  order: GetOrder;
  seatsData: OrderSeat[];
  selectedSeatIds: string[];
}

const SeatLocationModal = ({
  close,
  order,
  seatsData,
  selectedSeatIds,
}: Props) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div className="bg-white rounded-lg shadow-lg p-8 md:w-[60vw] md:h-[60vh] relative flex flex-col">
      <h2 className="text-2xl font-bold mb-4">내 좌석 위치</h2>
      <div className="md:max-h-[43vh]">
        <MySeatContainer
          svg={order.eventSvg}
          seats={seatsData}
          selectedSeatIds={selectedSeatIds}
          reservedByMe
        />
      </div>
      <div className="flex justify-end mt-auto">
        <Button
          size="sm"
          variant="secondary"
          onClick={close}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
        >
          닫기
        </Button>
      </div>
    </div>
  </div>
);

export default SeatLocationModal;
