import { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useEventFriendContext } from "../../../../store/EventFriendContext";
import { Event } from "../../../../types/api/event";

dayjs.extend(utc);
dayjs.extend(timezone);

export const useScheduleTab = (filteredEvent?: Event | null) => {
  const [isFriendRegisterModalOpen, setIsFriendRegisterModalOpen] =
    useState(false);
  const { eventFriends } = useEventFriendContext();

  return {
    eventFriends,
    isFriendRegisterModalOpen,
    setIsFriendRegisterModalOpen,
    validDates:
      filteredEvent?.eventDates?.map((eventDate) =>
        dayjs(eventDate.date).tz("Asia/Seoul").toDate()
      ) || [],
  };
};
