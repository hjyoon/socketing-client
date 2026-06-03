import { useForm } from "react-hook-form";
import SubTitle from "../../atoms/titles/subtitle/SubTitle";
import Container from "../../layout/Container";
import Button from "../../atoms/buttons/Button";
import { JoinConfirmData } from "../../../types/form/user";
import JoinFields from "./join/JoinFields";
import { useJoinSubmit } from "./join/useJoinSubmit";

const JoinForm = () => {
  const form = useForm<JoinConfirmData>({
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
      role: "user",
    },
  });
  const submit = useJoinSubmit(form.setError, form.watch);

  return (
    <div>
      <SubTitle>회원가입</SubTitle>
      <Container width="400px">
        <form onSubmit={(event) => void form.handleSubmit(submit)(event)}>
          <JoinFields
            errors={form.formState.errors}
            register={form.register}
            password={form.watch("password")}
          />
          <Button type="submit">회원가입</Button>
        </form>
      </Container>
    </div>
  );
};

export default JoinForm;
