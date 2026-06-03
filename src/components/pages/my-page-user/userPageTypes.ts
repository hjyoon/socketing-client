export type UserSection = "my-tickets" | "my-profile";
export type UserTab = "upcoming" | "past" | "cancel" | "profile" | "money";

export interface UserNavProps {
  activeTab: UserTab;
  setActiveTab: (tab: UserTab) => void;
  setSection: (section: UserSection) => void;
}
