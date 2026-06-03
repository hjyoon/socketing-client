import { Event } from "../../../types/api/event";
import { OrderResponseData } from "../../../types/api/socket";
import { formatToKoreanDateAndTime } from "../../../utils/dateUtils";

interface Props {
  eventData: Event;
  orderData: OrderResponseData;
}

const OrderTicketInfo = ({ eventData, orderData }: Props) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-lg font-bold mb-4">공연 티켓 정보</h2>
    <div className="flex items-center">
      <img
        src={eventData.thumbnail}
        alt="공연 포스터"
        className="w-24 h-28 rounded-md object-cover mr-4"
      />
      <div>
        <h3 className="text-xl font-bold mb-2">{eventData.title}</h3>
        <p className="text-gray-600 text-sm mb-1">{eventData.place}</p>
        <p className="text-gray-600 text-sm mb-1">
          {formatToKoreanDateAndTime(eventData.eventDates[0].date)}
        </p>
        <p className="text-gray-600 text-sm">{eventData.cast}</p>
      </div>
    </div>
    <hr className="my-4" />
    {orderData.seats.map((seat) => (
      <div className="flex justify-between" key={seat.id}>
        <span>
          {orderData.area.label ?? ""}구역 {seat.row}열 {seat.number}번
        </span>
      </div>
    ))}
  </div>
);

export default OrderTicketInfo;
