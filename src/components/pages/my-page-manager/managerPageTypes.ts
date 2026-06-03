export type ManagerTab = "ongoing" | "past" | "profile";

export interface ManagerNavProps {
  activeTab: ManagerTab;
  setActiveTab: (tab: ManagerTab) => void;
}
