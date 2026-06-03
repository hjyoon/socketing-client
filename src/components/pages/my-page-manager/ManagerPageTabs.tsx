import { ManagerNavProps, ManagerTab } from "./managerPageTypes";

const labels: Record<ManagerTab, string> = {
  ongoing: "티켓팅 중인 공연",
  past: "마감된 공연",
  profile: "프로필 보기",
};

const ManagerPageTabs = ({ activeTab, setActiveTab }: ManagerNavProps) => {
  const tabs: ManagerTab[] =
    activeTab === "profile" ? ["profile"] : ["ongoing", "past"];

  return (
    <div className="flex border-b mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`px-6 py-3 font-medium ${activeTab === tab ? "border-b-2 border-rose-400 text-rose-400" : "text-gray-500 hover:text-rose-400"}`}
          onClick={() => setActiveTab(tab)}
        >
          {labels[tab]}
        </button>
      ))}
    </div>
  );
};

export default ManagerPageTabs;
