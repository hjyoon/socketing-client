import Font from "../../atoms/fonts/Font";
import Button from "../../atoms/buttons/Button";
import { GetOrder } from "../../../types/api/order";
import { formatToKoreanDateAndTime } from "../../../utils/dateUtils";

interface Props {
  order: GetOrder;
  openCancelModal: () => void;
  openSeatModal: () => void;
}

const OrderDetailCard = ({ order, openCancelModal, openSeatModal }: Props) => (
  <>
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="h-36 md:h-[180px]">
        <div className="w-full h-full flex space-x-5 bg-rose-100 p-3 md:p-4 rounded-t-lg">
          <img
            src={order.eventThumbnail}
            alt={order.eventTitle}
            className="hidden md:block max-w-32 h-full object-cover rounded"
          />
          <div className="flex flex-col justify-end">
            <p className="text-gray-800 text-xl md:text-3xl font-bold mb-2">
              {order.eventTitle}
            </p>
            <Font className="text-gray-700 font-bold mb-1 md:my-2 text-lg md:text-xl">
              {order.eventCast}
            </Font>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <UserInfo email={order.userEmail} />
        <DetailRow
          icon="📅"
          label="일시"
          value={formatToKoreanDateAndTime(order.eventDate)}
        />
        <DetailRow icon="📍" label="장소" value={order.eventPlace} />
        <SeatRows order={order} openSeatModal={openSeatModal} />
        <div className="mt-6 pt-6 border-t border-gray-200">
          <Font className="text-sm text-gray-500 text-center block">
            공연 당일 예매내역을 확인할 수 있는 신분증을 지참해주세요.
          </Font>
        </div>
      </div>
    </div>
    <div className="fixed bottom-0 right-8 md:left-0 md:right-0 pb-4 flex justify-center">
      <Button
        onClick={openCancelModal}
        className={`${order.orderCanceledAt !== null ? "hidden" : ""}`}
      >
        예매 취소
      </Button>
    </div>
  </>
);

const UserInfo = ({ email }: { email: string }) => (
  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
      <span className="font-bold">{email.slice(0, 1)}</span>
    </div>
    <Font className="font-bold text-gray-800">{email.slice(0, 3)}</Font>
  </div>
);

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) => (
  <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition">
    <div className="w-6 text-gray-400">{icon}</div>
    <div>
      <Font className="font-bold text-gray-700 mb-1">{label}</Font>
      <Font className="text-gray-600">{value}</Font>
    </div>
  </div>
);

const SeatRows = ({
  order,
  openSeatModal,
}: Pick<Props, "order" | "openSeatModal">) => (
  <div className="flex space-x-3 p-3 hover:bg-gray-50 rounded-lg transition">
    <div className="w-6 text-gray-400 inline-block">🎫</div>
    <div className="flex flex-col flex-1">
      <div className="flex justify-between items-center mb-2">
        <div className="font-bold text-gray-700 mb-2">좌석</div>
        <Button onClick={() => void openSeatModal()} variant="dark" size="sm">
          좌석 위치 확인
        </Button>
      </div>
      <div className="text-gray-600">
        {order.reservations.map((reservation, index) => (
          <div key={reservation.seatId || index} className="mb-1">
            {reservation.seatAreaLabel}구역 {reservation.seatRow}열{" "}
            {reservation.seatNumber}번
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default OrderDetailCard;
