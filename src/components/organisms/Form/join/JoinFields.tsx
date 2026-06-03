import { FieldErrors, UseFormRegister } from "react-hook-form";
import LabeledInput from "../../../molecules/labeledinput/LabeledInput";
import { JoinConfirmData } from "../../../../types/form/user";

interface Props {
  errors: FieldErrors<JoinConfirmData>;
  password: string;
  register: UseFormRegister<JoinConfirmData>;
}

const JoinFields = ({ errors, password, register }: Props) => (
  <>
    <LabeledInput
      {...register("email")}
      placeholder="이메일을 입력해주세요"
      label="EMAIL"
    />
    {errors.email && <ErrorText message={errors.email.message} />}
    <br />
    <LabeledInput
      {...register("password")}
      placeholder="비밀번호를 입력해주세요"
      label="PASSWORD"
      type="password"
    />
    {errors.password && <ErrorText message={errors.password.message} />}
    <br />
    <LabeledInput
      {...register("passwordConfirm", {
        validate: (value) =>
          value === password || "비밀번호가 일치하지 않습니다.",
      })}
      placeholder="비밀번호를 확인해주세요"
      label="PASSWORD CONFIRM"
      type="password"
    />
    {errors.passwordConfirm && (
      <ErrorText message={errors.passwordConfirm.message} />
    )}
    <br />
    <RoleRadio register={register} />
    {errors.role && <ErrorText message={errors.role.message} />}
    <br />
  </>
);

const RoleRadio = ({ register }: Pick<Props, "register">) => (
  <div>
    <label>
      <input
        type="radio"
        value="user"
        {...register("role", { required: "사용자 유형을 선택해주세요." })}
        className="mr-1"
      />
      일반 사용자
    </label>
    <label style={{ marginLeft: "10px" }}>
      <input
        type="radio"
        value="manager"
        {...register("role", { required: "사용자 유형을 선택해주세요." })}
        className="mr-1"
      />
      판매자
    </label>
  </div>
);

const ErrorText = ({ message }: { message?: string }) => (
  <span style={{ color: "red" }}>{message}</span>
);

export default JoinFields;
