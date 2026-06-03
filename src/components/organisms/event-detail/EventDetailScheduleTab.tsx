import ScheduleHeader from "../../molecules/event-detail/ScheduleHeader";
import ScheduleList from "../../molecules/event-detail/ScheduleList";
import { useEventDetail } from "../../../store/EventDetailContext";
import FriendRegisterModal from "./FriendRegisterModal";
import FriendSchedulePanel from "./schedule/FriendSchedulePanel";
import { useScheduleTab } from "./schedule/useScheduleTab";

const EventDetailScheduleTab = () => {
  const { filteredEvent, selectedDates, setSelectedDates } = useEventDetail();
  const schedule = useScheduleTab(filteredEvent);

  if (!filteredEvent) return null;

  return (
    <>
      <div className="tab-content-title-container">
        <h2 className="hidden md:block tab-content-title md:ml-10">
          공연 일정
        </h2>
      </div>
      <div className="flex flex-col items-center md:items-start md:flex-row">
        <FriendSchedulePanel
          className="md:hidden w-[100%] flex flex-col gap-2 pb-3 border-gray-200 max-h-64 overflow-y-auto"
          eventFriends={schedule.eventFriends ?? []}
          openModal={() => schedule.setIsFriendRegisterModalOpen(true)}
        >
          <ScheduleList
            filteredEvent={filteredEvent}
            selectedDates={selectedDates}
          />
        </FriendSchedulePanel>
        <div className="calendar mt-1 w-[100%] md:w-[50%]">
          <ScheduleHeader
            validDates={schedule.validDates}
            selectedDates={selectedDates}
            onDateSelect={setSelectedDates}
          />
        </div>
        <FriendSchedulePanel
          className="hidden md:flex flex-col gap-2 w-[50%] pt-5"
          eventFriends={schedule.eventFriends ?? []}
          openModal={() => schedule.setIsFriendRegisterModalOpen(true)}
          wide
        >
          <ScheduleList
            filteredEvent={filteredEvent}
            selectedDates={selectedDates}
          />
        </FriendSchedulePanel>
      </div>
      <FriendRegisterModal
        isOpen={schedule.isFriendRegisterModalOpen}
        onClose={() => schedule.setIsFriendRegisterModalOpen(false)}
      />
    </>
  );
};

export default EventDetailScheduleTab;
