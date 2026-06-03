import { useContext } from "react";
import { UseFormReset, UseFormSetError } from "react-hook-form";
import { toast } from "react-toastify";
import { getUserInfoByEmail } from "../../../../api/users/usersApi";
import { useEventFriendContext } from "../../../../store/EventFriendContext";
import { UserContext } from "../../../../store/UserContext";
import { EmailOnlyData } from "../FriendRegisterModal";

export const useFriendSearchSubmit = (
  setError: UseFormSetError<EmailOnlyData>,
  reset: UseFormReset<EmailOnlyData>
) => {
  const { addFriend } = useEventFriendContext();
  const { userId } = useContext(UserContext);

  return async (data: EmailOnlyData) => {
    if (!data.email) {
      setError("email", { message: "이름을 입력해 주세요", type: "manual" });
      return;
    }

    try {
      const response = await getUserInfoByEmail(data.email);
      if (response.data?.id === userId)
        toast.error("다른 사용자의 이름을 입력해주세요.");
      else if (response.data) addFriend(response.data);
    } catch {
      toast.error("가입되지 않은 사용자입니다.");
    } finally {
      reset();
    }
  };
};
