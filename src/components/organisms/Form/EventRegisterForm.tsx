import { useForm } from "react-hook-form";
import { NewEvent } from "../../../types/api/event";
import Button from "../../atoms/buttons/Button";
import { useEventRegisterSubmit } from "./event-register/useEventRegisterSubmit";
import EventBasicFields from "./event-register/EventBasicFields";
import EventDateFields from "./event-register/EventDateFields";
import EventUploadField from "./event-register/EventUploadField";

const nextWeek = () =>
  new Date(new Date().setDate(new Date().getDate() + 7))
    .toISOString()
    .slice(0, 16);

const EventRegisterForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<NewEvent>({
    defaultValues: {
      title: "",
      thumbnail: "",
      place: "",
      cast: "",
      ageLimit: 12,
      eventDates: [nextWeek()],
      svg: "",
      ticketingStartTime: nextWeek(),
    },
  });
  const { clearSelection, handleImageUpload, onSubmit } =
    useEventRegisterSubmit();

  return (
    <form
      onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      className="w-full h-full"
    >
      <div className="w-full h-full flex items-center">
        <div className="px-8 gap-6 flex items-center">
          <EventBasicFields errors={errors} register={register} />
          <EventDateFields control={control} errors={errors} />
          <EventUploadField
            control={control}
            errors={errors}
            handleImageUpload={handleImageUpload}
          />
          <Button
            variant="primary"
            type="submit"
            className="mt-6"
            onClick={clearSelection}
          >
            공연 등록
          </Button>
        </div>
      </div>
    </form>
  );
};

export default EventRegisterForm;
