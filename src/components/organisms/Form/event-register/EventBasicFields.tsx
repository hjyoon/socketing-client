import { FieldErrors, UseFormRegister } from "react-hook-form";
import { NewEvent } from "../../../../types/api/event";
import Input from "../../../atoms/inputs/Input";

interface Props {
  errors: FieldErrors<NewEvent>;
  register: UseFormRegister<NewEvent>;
}

const fields = [
  ["title", "공연 이름", "공연 이름은 필수 항목입니다."],
  ["thumbnail", "포스터 URL", "포스터 URL은 필수 항목입니다."],
  ["place", "장소", "장소는 필수 항목입니다."],
  ["cast", "아티스트", "가수는 필수 항목입니다."],
] as const;

const EventBasicFields = ({ errors, register }: Props) => (
  <>
    {fields.map(([name, label, message]) => (
      <div className="flex flex-col items-start" key={name}>
        <label className="font-bold mb-1">{label}</label>
        <Input type="text" {...register(name, { required: message })} />
        {errors[name] && (
          <span className="text-red-500">{errors[name]?.message}</span>
        )}
      </div>
    ))}
  </>
);

export default EventBasicFields;
