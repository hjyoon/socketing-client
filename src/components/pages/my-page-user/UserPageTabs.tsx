import { UserNavProps, UserSection, UserTab } from "./userPageTypes";

interface Props extends UserNavProps {
  section: UserSection;
}

const ticketTabs: [UserTab, string][] = [
  ["upcoming", "예정된 공연"],
  ["past", "지난 공연"],
  ["cancel", "취소된 티켓"],
];

const profileTabs: [UserTab, string][] = [
  ["profile", "프로필 보기"],
  ["money", "나의 보유 금액"],
];

const UserPageTabs = ({
  activeTab,
  section,
  setActiveTab,
  setSection,
}: Props) => (
  <>
    <p className="lg:hidden flex justify-around md:justify-start md:gap-6 md:px-2 text-2xl font-bold uppercase text-gray-800 mb-3">
      <span
        className={`cursor-pointer ${section === "my-tickets" ? "text-rose-500 font-bold" : ""}`}
        onClick={() => switchSection("my-tickets", setSection, setActiveTab)}
      >
        My Ticket
      </span>
      <span className="text-rose-500">
        {section !== "my-profile" ? "◀" : "▶"}{" "}
      </span>
      <span
        className={`cursor-pointer ${section === "my-profile" ? "text-rose-500 font-bold" : ""}`}
        onClick={() => switchSection("my-profile", setSection, setActiveTab)}
      >
        My Profile
      </span>
    </p>
    <div className="flex border-b mb-6">
      {(section === "my-tickets" ? ticketTabs : profileTabs).map(
        ([tab, label]) => (
          <button
            key={tab}
            className={`px-3 md:px-6 py-3 font-medium ${activeTab === tab ? "border-b-2 border-rose-400 text-rose-400" : "text-gray-500 hover:text-rose-400"}`}
            onClick={() => setActiveTab(tab)}
          >
            {label}
          </button>
        )
      )}
    </div>
  </>
);

const switchSection = (
  section: UserSection,
  setSection: (section: UserSection) => void,
  setActiveTab: (tab: UserTab) => void
) => {
  setSection(section);
  setActiveTab(section === "my-profile" ? "profile" : "upcoming");
};

export default UserPageTabs;
