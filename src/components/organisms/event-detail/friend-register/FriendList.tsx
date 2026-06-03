import Button from "../../../atoms/buttons/Button";
import { User } from "../../../../types/api/user";

interface Props {
  deleteFriend: (friendId: string) => void;
  eventFriends: User[];
}

const FriendList = ({ deleteFriend, eventFriends }: Props) => {
  if (eventFriends.length === 0) return null;

  return (
    <div className="mb-4 p-3 bg-gray-50 rounded-md flex flex-col gap-1">
      {eventFriends.map((friend) => (
        <div
          key={friend.id}
          className="text-sm text-gray-700 flex flex-row space-x-2 md:space-x-2 space-y-2 md:space-y-0 justify-between items-center"
        >
          <div className="flex flex-col md:flex-row">
            <div>{friend.nickname} </div>
            <div>({friend.email})</div>
          </div>
          <Button variant="secondary" onClick={() => deleteFriend(friend.id)}>
            취소
          </Button>
        </div>
      ))}
    </div>
  );
};

export default FriendList;
