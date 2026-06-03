import { useState } from "react";
import { createResourceQuery } from "../../hooks/useCustomQuery";
import { managerPageErrorMessages } from "../../constants/errorMessages";
import { fetchAllEventForManager } from "../../api/managers/managersApi";
import { AllEventManagementResponse } from "../../types/api/managers";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";
import MyProfile from "../organisms/Form/MyProfile";
import ManagerEventList from "./my-page-manager/ManagerEventList";
import ManagerPageMenu from "./my-page-manager/ManagerPageMenu";
import ManagerPageTabs from "./my-page-manager/ManagerPageTabs";
import { ManagerTab } from "./my-page-manager/managerPageTypes";

const MyPageManager = () => {
  const [activeTab, setActiveTab] = useState<ManagerTab>("ongoing");
  const useEvents = createResourceQuery<AllEventManagementResponse>(
    "created-events-by-manager",
    fetchAllEventForManager
  );
  const { data, isLoading, isError } = useEvents();

  if (isLoading) return <LoadingPage />;
  if (isError)
    return <ErrorPage errorMessage={managerPageErrorMessages.general} />;
  if (!data?.data)
    return <ErrorPage errorMessage={managerPageErrorMessages.noEventData} />;

  const now = new Date();
  const past = data.data.filter(
    (event) => new Date(event.eventDates[0].date) < now
  );
  const ongoing = data.data.filter(
    (event) => new Date(event.eventDates[0].date) >= now
  );

  return (
    <div className="w-300 flex h-full">
      <ManagerPageMenu activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto p-8">
          <h1 className="text-2xl font-bold uppercase text-gray-800 mb-3">
            {activeTab === "profile" ? "My Profile" : "My Events"}
          </h1>
          <ManagerPageTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="flex flex-col h-[calc(100vh-300px)] px-3 md:px-5 overflow-y-auto">
            {activeTab === "profile" && <MyProfile />}
            {activeTab === "ongoing" && (
              <ManagerEventList
                events={ongoing}
                emptyMessage="티켓팅 오픈 예정인 공연이 없습니다."
                now={now}
              />
            )}
            {activeTab === "past" && (
              <ManagerEventList
                events={past}
                emptyMessage="티켓팅이 마감된 공연이 없습니다."
                now={now}
                past
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyPageManager;
