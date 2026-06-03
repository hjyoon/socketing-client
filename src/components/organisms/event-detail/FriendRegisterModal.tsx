import { useForm } from "react-hook-form";
import Button from "../../atoms/buttons/Button";
import Modal from "../../molecules/modal/Modal";
import Input from "../../atoms/inputs/Input";
import { useEventFriendContext } from "../../../store/EventFriendContext";
import FriendList from "./friend-register/FriendList";
import { useFriendSearchSubmit } from "./friend-register/useFriendSearchSubmit";

interface FriendRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type EmailOnlyData = {
  email: string;
};

const FriendRegisterModal = ({ isOpen, onClose }: FriendRegisterModalProps) => {
  const { eventFriends, deleteFriend } = useEventFriendContext();
  const form = useForm<EmailOnlyData>({ defaultValues: { email: "" } });
  const onSubmit = useFriendSearchSubmit(form.setError, form.reset);

  if (!eventFriends) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <h3 className="text-lg font-bold pl-2">함께할 친구 등록하기</h3>
        <form
          onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
          className="space-y-4"
        >
          <div className="mt-4">
            <div className="flex flex-col w-full">
              <div className="flex justify-between space-x-3">
                <Input
                  {...form.register("email", {
                    required: "이름을 입력해 주세요",
                    validate: (value) =>
                      value.trim() !== "" || "빈 문자열은 입력할 수 없습니다",
                  })}
                  placeholder="친구 이름을 입력해 주세요"
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "조회 중..." : "친구 등록"}
                </Button>
              </div>
              {form.formState.errors.email?.message && (
                <span className="text-red-500 text-sm mt-1">
                  {form.formState.errors.email.message}
                </span>
              )}
            </div>
          </div>
        </form>
        <FriendList deleteFriend={deleteFriend} eventFriends={eventFriends} />
      </div>
    </Modal>
  );
};

export default FriendRegisterModal;
