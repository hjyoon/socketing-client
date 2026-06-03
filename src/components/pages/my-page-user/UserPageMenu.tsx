import { UserNavProps, UserSection, UserTab } from "./userPageTypes";

const ticketItems: [UserTab, string][] = [
  ["upcoming", "예정된 공연"],
  ["past", "지난 공연"],
  ["cancel", "취소된 티켓"],
];

const profileItems: [UserTab, string][] = [
  ["profile", "프로필 보기"],
  ["money", "나의 보유 금액"],
];

const UserPageMenu = ({
  activeTab,
  setActiveTab,
  setSection,
}: UserNavProps) => (
  <aside className="hidden w-64 bg-white shadow-lg text-black lg:flex flex-col p-10">
    <div className="h-16" />
    <nav className="space-y-8 text-gray-500">
      <MenuGroup
        activeTab={activeTab}
        items={ticketItems}
        section="my-tickets"
        title="My Tickets"
        setActiveTab={setActiveTab}
        setSection={setSection}
      />
      <MenuGroup
        activeTab={activeTab}
        items={profileItems}
        section="my-profile"
        title="My Profile"
        setActiveTab={setActiveTab}
        setSection={setSection}
      />
    </nav>
  </aside>
);

interface GroupProps extends UserNavProps {
  items: [UserTab, string][];
  section: UserSection;
  title: string;
}

const MenuGroup = ({
  activeTab,
  items,
  section,
  title,
  setActiveTab,
  setSection,
}: GroupProps) => (
  <div>
    <p className="text-gray-600 font-bold text-md uppercase mb-3">{title}</p>
    <ul className="space-y-3">
      {items.map(([tab, label]) => (
        <li
          key={tab}
          className={`cursor-pointer ${activeTab === tab ? "text-rose-400 font-bold" : ""} hover:text-rose-500`}
          onClick={() => {
            setSection(section);
            setActiveTab(tab);
          }}
        >
          {label}
        </li>
      ))}
    </ul>
  </div>
);

export default UserPageMenu;
