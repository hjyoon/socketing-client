import { useNavigate } from "react-router";
import Button from "../../atoms/buttons/Button";
import { AllEventManagement } from "../../../types/api/managers";
import { formatToKoreanDateAndTime } from "../../../utils/dateUtils";

interface Props {
  events: AllEventManagement[];
  emptyMessage: string;
  now: Date;
  past?: boolean;
}

const ManagerEventList = ({ events, emptyMessage, now, past }: Props) => {
  if (events.length === 0) {
    return (
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-700 mb-5">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <ul className="space-y-4">
        {events.map((event) => (
          <ManagerEventItem
            event={event}
            key={event.id}
            now={now}
            past={past}
          />
        ))}
      </ul>
    </div>
  );
};

const ManagerEventItem = ({
  event,
  now,
  past,
}: {
  event: AllEventManagement;
  now: Date;
  past?: boolean;
}) => {
  const navigate = useNavigate();
  const disabled = !past && new Date(event.ticketingStartTime) > now;
  const label = past ? "전체 예매 결과" : "예매 현황 보기";
  const goDetail = () =>
    void navigate(`/manager/${event.id}/${event.eventDates[0].id}`);

  return (
    <li className="p-4 px-6 border border-gray-300 rounded-lg shadow-sm flex flex-col md:flex-row md:items-center space-x-4">
      <img
        src={event.thumbnail}
        alt={event.title}
        className="md:w-16 h-24 rounded-lg object-cover m-2"
      />
      <div className="flex-1 pl-3">
        <h3 className="text-lg font-bold text-gray-700 mb-1">{event.title}</h3>
        <Info
          label="일정"
          value={formatToKoreanDateAndTime(event.eventDates[0].date)}
        />
        <Info label="장소" value={event.place} />
        <Info label="출연" value={event.cast} />
      </div>
      <Button
        onClick={goDetail}
        variant={past ? "dark" : "primary"}
        className="hidden md:inline-block"
        disabled={disabled}
      >
        {label}
      </Button>
      <Button
        onClick={goDetail}
        variant={past ? "dark" : "primary"}
        size="sm"
        className="mt-3 md:hidden"
        disabled={disabled}
      >
        {label}
      </Button>
    </li>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <p className="text-sm text-gray-500">
    <span className="inline-block w-8 md:w-14 font-semibold">{label}</span>
    {value}
  </p>
);

export default ManagerEventList;
