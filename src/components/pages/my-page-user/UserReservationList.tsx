import { useNavigate } from "react-router";
import Button from "../../atoms/buttons/Button";
import { GetOrder } from "../../../types/api/order";
import { formatToKoreanDateAndTime } from "../../../utils/dateUtils";

interface Props {
  events: GetOrder[];
  emptyMessage: string;
}

const UserReservationList = ({ events, emptyMessage }: Props) => {
  const navigate = useNavigate();

  if (events.length === 0) {
    return (
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-700 mb-5">{emptyMessage}</p>
        <Button onClick={() => void navigate("/")}>이벤트 보러가기</Button>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <ul className="space-y-4">
        {events.map((order) => (
          <li
            key={order.orderId}
            className="p-4 px-6 border border-gray-300 rounded-lg shadow-sm flex flex-col md:flex-row md:items-center space-x-4"
          >
            <img
              src={order.eventThumbnail}
              alt={order.eventTitle}
              className="md:w-16 h-24 rounded-lg object-cover m-2"
            />
            <div className="flex-1 pl-3">
              <h3 className="text-lg font-bold text-gray-700 mb-1">
                {order.eventTitle}
              </h3>
              <Info
                label="예매"
                value={formatToKoreanDateAndTime(order.orderCreatedAt)}
              />
              <Info
                label="일정"
                value={formatToKoreanDateAndTime(order.eventDate)}
              />
              <Info label="장소" value={order.eventPlace} />
              <Info label="출연" value={order.eventCast} />
            </div>
            <DetailButton
              canceled={order.orderCanceledAt !== null}
              orderId={order.orderId}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <p className="text-sm text-gray-500">
    <span className="inline-block w-8 md:w-14 font-semibold">{label}</span>
    {value}
  </p>
);

const DetailButton = ({
  canceled,
  orderId,
}: {
  canceled: boolean;
  orderId: string;
}) => {
  const navigate = useNavigate();
  const label = canceled ? "취소된 티켓" : "예매 정보 보기";
  const variant = canceled ? "secondary" : "primary";
  const goDetail = () => void navigate(`/mypage/detail/${orderId}`);

  return (
    <>
      <Button
        onClick={goDetail}
        className="hidden md:inline-block"
        variant={variant}
      >
        {label}
      </Button>
      <Button
        onClick={goDetail}
        size="sm"
        className="mt-3 md:hidden"
        variant={variant}
      >
        {label}
      </Button>
    </>
  );
};

export default UserReservationList;
