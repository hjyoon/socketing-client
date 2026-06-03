import { Control, Controller, FieldErrors } from "react-hook-form";
import { NewEvent } from "../../../../types/api/event";
import Input from "../../../atoms/inputs/Input";

interface Props {
  control: Control<NewEvent>;
  errors: FieldErrors<NewEvent>;
}

const EventDateFields = ({ control, errors }: Props) => (
  <div className="space-y-2">
    <DateTimeField control={control} label="티켓팅" name="ticketingStartTime" />
    {errors.ticketingStartTime && (
      <span className="text-red-500">{errors.ticketingStartTime.message}</span>
    )}
    <DateTimeField control={control} label="공연" name="eventDates.0" />
    {errors.eventDates?.[0] && (
      <span className="text-red-500">{errors.eventDates[0]?.message}</span>
    )}
  </div>
);

const DateTimeField = ({
  control,
  label,
  name,
}: {
  control: Control<NewEvent>;
  label: string;
  name: "ticketingStartTime" | "eventDates.0";
}) => (
  <div className="flex flex-col items-start">
    <label className="font-bold mb-1">
      <span className="text-rose-400">{label}</span> 날짜
    </label>
    <Controller
      control={control}
      name={name}
      rules={{ required: `${label} 날짜는 필수 항목입니다.` }}
      render={({ field }) => (
        <Input
          {...field}
          className="w-[235px] h-6"
          type="datetime-local"
          value={field.value ? toLocalDateValue(field.value) : ""}
          onChange={(event) =>
            field.onChange(new Date(event.target.value).toISOString())
          }
        />
      )}
    />
  </div>
);

const toLocalDateValue = (value: string) =>
  new Date(value)
    .toLocaleString("sv-SE", {
      day: "2-digit",
      hour: "2-digit",
      hour12: false,
      minute: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(" ", "T");

export default EventDateFields;
