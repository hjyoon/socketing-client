import Button from "../../atoms/buttons/Button";
import {
  formatDateToKoreanDate,
  formatDateToKoreanTime,
} from "../../../utils/dateUtils";
import { useScheduleReservation } from "./schedule-card/useScheduleReservation";

interface ScheduleCardProps {
  eventId: string;
  eventDateId: string;
  date: Date;
  ticketingStartTime?: number;
}

const ScheduleCard = (props: ScheduleCardProps) => {
  const reservation = useScheduleReservation(props);

  return (
    <>
      <div className="hidden lg:flex event-card h-20 items-center justify-between p-4 mx-2 mb-2 rounded-lg border shadow-lg hover:bg-gray-100 transition">
        <ScheduleTime date={props.date} horizontal />
        <ScheduleButtons reservation={reservation} />
      </div>
      <div className="lg:hidden event-card h-20 flex items-center justify-between pl-4 pr-3 md:px-8 py-4 md:mx-2 mb-2 rounded-lg border shadow-sm md:shadow-lg hover:bg-gray-100 transition">
        <ScheduleTime date={props.date} />
        <ScheduleButtons reservation={reservation} small />
      </div>
    </>
  );
};

const ScheduleTime = ({
  date,
  horizontal,
}: {
  date: Date;
  horizontal?: boolean;
}) => (
  <div
    className={`schedule-info flex ${horizontal ? "gap-2 items-center" : "flex-col"}`}
  >
    <div
      id="schedule-date"
      className="text-base md:text-lg font-semibold text-gray-800 flex items-end"
    >
      <p>{formatDateToKoreanDate(date)}</p>
    </div>
    <div className="schedule-time text-sm md:text-base text-gray-600 flex items-end">
      <p>{formatDateToKoreanTime(date)}</p>
    </div>
  </div>
);

const ScheduleButtons = ({
  reservation,
  small,
}: {
  reservation: ReturnType<typeof useScheduleReservation>;
  small?: boolean;
}) => (
  <div className="flex gap-1 md:gap-2">
    <Button
      variant="dark"
      size={small ? "sm" : undefined}
      onClick={reservation.reserveAdjacent}
      className={`${reservation.isDisabled ? "opacity-30" : ""}`}
    >
      {reservation.isDisabled
        ? small
          ? "함께 준비"
          : "함께 예매 준비 중"
        : small
          ? "함께 예매"
          : "함께 예매하기"}
    </Button>
    <Button
      variant="primary"
      size={small ? "sm" : undefined}
      onClick={reservation.reserveDefault}
      disabled={reservation.isDisabled}
    >
      {reservation.isDisabled
        ? small
          ? "준비 중"
          : "일반 준비 중"
        : small
          ? "예매"
          : "예매하기"}
    </Button>
  </div>
);

export default ScheduleCard;
