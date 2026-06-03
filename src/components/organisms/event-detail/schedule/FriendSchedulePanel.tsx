import { PropsWithChildren } from "react";
import { User } from "../../../../types/api/user";

interface Props extends PropsWithChildren {
  className: string;
  eventFriends?: User[];
  openModal: () => void;
  wide?: boolean;
}

const FriendSchedulePanel = ({
  children,
  className,
  eventFriends,
  openModal,
  wide,
}: Props) => (
  <div className={className}>
    <button
      className={`${wide ? "mx-2" : ""} bg-black text-white p-1 text-center rounded-lg font-bold transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
      onClick={openModal}
    >
      함께할 친구 등록 ({eventFriends?.length} 명)
    </button>
    {eventFriends && eventFriends.length > 0 && (
      <div
        className={
          wide
            ? "flex h-auto rounded-lg border items-center shadow-lg transition p-4 mx-2 mb-2 justify-between flex-wrap overflow-y-hidden"
            : "flex h-11 p-4 rounded-lg border items-center shadow transition justify-between overflow-x-auto overflow-y-hidden"
        }
      >
        <div
          className={
            wide
              ? "flex-wrap flex items-center justify-center rounded-md"
              : "flex-shrink-0 flex items-center pb-1 justify-center rounded-md gap-3"
          }
        >
          {eventFriends.map((friend) => (
            <div
              key={friend.id}
              className={wide ? "p-2 text-lg font-bold" : "font-bold"}
            >
              {friend.email.slice(0, 3)}
            </div>
          ))}
        </div>
      </div>
    )}
    {children}
  </div>
);

export default FriendSchedulePanel;
