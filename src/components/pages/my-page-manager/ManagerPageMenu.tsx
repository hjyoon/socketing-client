import { ManagerNavProps, ManagerTab } from "./managerPageTypes";

const groups: { title: string; items: [ManagerTab, string][] }[] = [
  {
    title: "My Events",
    items: [
      ["ongoing", "티켓팅 중인 공연"],
      ["past", "마감된 공연"],
    ],
  },
  { title: "My Profile", items: [["profile", "프로필 보기"]] },
];

const ManagerPageMenu = ({ activeTab, setActiveTab }: ManagerNavProps) => (
  <aside className="hidden w-64 bg-white shadow-lg text-black lg:flex flex-col p-10">
    <div className="h-16" />
    <nav className="space-y-8 text-gray-500">
      {groups.map((group) => (
        <div key={group.title}>
          <p className="text-gray-600 font-bold text-md uppercase mb-3">
            {group.title}
          </p>
          <ul className="space-y-3">
            {group.items.map(([tab, label]) => (
              <li
                key={tab}
                className={`cursor-pointer ${activeTab === tab ? "text-rose-400 font-bold" : ""} hover:text-rose-500`}
                onClick={() => setActiveTab(tab)}
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  </aside>
);

export default ManagerPageMenu;
