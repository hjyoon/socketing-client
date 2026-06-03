import { Control, Controller, FieldErrors } from "react-hook-form";
import { NewEvent } from "../../../../types/api/event";

interface Props {
  control: Control<NewEvent>;
  errors: FieldErrors<NewEvent>;
  handleImageUpload: (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => void;
}

const EventUploadField = ({ control, errors, handleImageUpload }: Props) => (
  <div className="flex flex-col items-start">
    <label className="font-bold mb-1">배치도 업로드</label>
    <Controller
      control={control}
      name="svg"
      rules={{ required: "배치도 업로드는 필수 항목입니다." }}
      render={({ field }) => (
        <input
          type="file"
          accept="image/jpeg,.jpg"
          className="w-full"
          onChange={(event) => handleImageUpload(event, field.onChange)}
        />
      )}
    />
    {errors.svg && <span className="text-red-500">{errors.svg.message}</span>}
  </div>
);

export default EventUploadField;
