import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useCurrentTime } from "../../../../hooks/useCurrentTime";
import { useEventFriendContext } from "../../../../store/EventFriendContext";

interface Args {
  eventDateId: string;
  eventId: string;
  ticketingStartTime?: number;
}

export const useScheduleReservation = ({
  eventDateId,
  eventId,
  ticketingStartTime,
}: Args) => {
  const navigate = useNavigate();
  const now = useCurrentTime();
  const { eventFriends } = useEventFriendContext();
  const isTicketingStarted = Boolean(
    ticketingStartTime && now >= ticketingStartTime
  );

  const checkLogin = () => {
    if (localStorage.getItem("userId")) return true;
    toast.success("예약 페이지에 접근하기 위해서는 로그인이 필요합니다.");
    return false;
  };

  return {
    isDisabled: !isTicketingStarted,
    reserveAdjacent: () => {
      if (!checkLogin()) return;
      if (!eventFriends || eventFriends.length < 1) {
        toast.error(
          "예매하기 위에 있는 버튼으로 함께 할 친구를 먼저 등록해 주세요."
        );
        return;
      }
      if (!isTicketingStarted) {
        toast.error("티켓팅이 아직 시작되지 않았습니다.");
        return;
      }
      void navigate(`/waiting/${eventId}/${eventDateId}`, {
        state: { numberOfTickets: eventFriends.length + 1 },
      });
    },
    reserveDefault: () => {
      if (checkLogin()) void navigate(`/waiting/${eventId}/${eventDateId}`);
    },
  };
};
