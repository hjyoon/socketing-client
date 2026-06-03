import dayjs from "dayjs";
import { CustomEventsProps, Event } from "../../../types/api/event";

export const getMainEventGroups = (events: Event[], now: number) => {
  const timedEvents = events
    .filter((event) => event.ticketingStartTime)
    .map((event) => ({
      ...event,
      ticketingStartTime: dayjs(event.ticketingStartTime)
        .tz("Asia/Seoul")
        .valueOf(),
    }));

  return {
    impendingTicketingEvents: timedEvents
      .filter((event) => event.ticketingStartTime >= now)
      .sort(byTicketingTime),
    nextTicketingEvent: timedEvents
      .filter((event) => event.ticketingStartTime > now - 21600000)
      .sort(byTicketingTime)[0],
    ongoingTicketingEvents: timedEvents
      .filter((event) => event.ticketingStartTime < now)
      .sort(byTicketingTime) as CustomEventsProps[],
  };
};

const byTicketingTime = (a: CustomEventsProps, b: CustomEventsProps) =>
  a.ticketingStartTime - b.ticketingStartTime;
