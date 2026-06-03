import CardList from "../templates/cardList/CardList";
import MainBanner from "../templates/mainBanner/MainBanner";
import { fetchAllEvents } from "../../api/events/eventsApi";
import { EventsResponse } from "../../types/api/event";
import { createResourceQuery } from "../../hooks/useCustomQuery";
import { fetchErrorMessages } from "../../constants/errorMessages";
import { useCurrentTime } from "../../hooks/useCurrentTime";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";
import UpcomingEventList from "./main/UpcomingEventList";
import { getMainEventGroups } from "./main/useMainEventGroups";

const UserMainPage = () => {
  const now = useCurrentTime();
  const useEvents = createResourceQuery<EventsResponse>(
    "all-events",
    fetchAllEvents
  );
  const { data, isLoading, isError } = useEvents();

  if (isLoading) return <LoadingPage />;
  if (isError) return <ErrorPage errorMessage={fetchErrorMessages.general} />;
  if (!data?.data)
    return <ErrorPage errorMessage={fetchErrorMessages.noEventData} />;

  const groups = getMainEventGroups(data.data, now);

  return (
    <>
      <MainBanner event={groups.nextTicketingEvent} />
      <div className="px-6 md:px-20 pt-8 pb-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            티켓팅 오픈 예정 공연
          </h2>
          <UpcomingEventList events={groups.impendingTicketingEvents} />
        </div>
        <div className="max-w-7xl mx-auto mt-14">
          <h2 className="text-2xl font-bold text-center mb-6">
            예매 진행 중인 공연
          </h2>
          <CardList events={groups.ongoingTicketingEvents} />
        </div>
      </div>
    </>
  );
};

export default UserMainPage;
