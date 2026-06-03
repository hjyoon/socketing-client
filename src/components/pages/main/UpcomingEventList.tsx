import { useNavigate } from "react-router";
import TicketButton from "../../atoms/buttons/TiketButton";
import { CustomEventsProps } from "../../../types/api/event";
import { formatToKoreanDateAndTime } from "../../../utils/dateUtils";

const UpcomingEventList = ({ events }: { events: CustomEventsProps[] }) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
        <p className="text-gray-500 text-lg">
          티켓팅 오픈 예정인 공연이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {events.map((event) => (
        <UpcomingEventCard event={event} key={event.id} />
      ))}
    </div>
  );
};

const UpcomingEventCard = ({ event }: { event: CustomEventsProps }) => {
  const navigate = useNavigate();
  const open = () => void navigate(`/event/${event.id}`);

  return (
    <div
      className="bg-white flex flex-col md:flex-row items-center justify-between px-8 py-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md active:bg-gray-100 transition-all duration-300 cursor-pointer"
      onClick={open}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && open()}
    >
      <div className="flex flex-col md:flex-row items-center gap-6">
        <img
          src={event.thumbnail}
          alt={event.title}
          className="h-48 md:w-24 md:h-32 object-contain rounded-lg shadow-sm flex-shrink-0"
        />
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
          <p className="flex items-center gap-2 text-sm text-gray-600">
            <span className="inline-block w-16 font-semibold">티켓 오픈</span>
            <span>{formatToKoreanDateAndTime(event.ticketingStartTime)}</span>
          </p>
          <p className="flex items-center gap-2 text-sm text-gray-600">
            <span className="inline-block w-16 font-semibold">장소</span>
            <span>{event.place}</span>
          </p>
        </div>
      </div>
      <div className="flex mt-4 md:mt-0 flex-col items-end gap-3">
        <TicketButton event={event} />
      </div>
    </div>
  );
};

export default UpcomingEventList;
