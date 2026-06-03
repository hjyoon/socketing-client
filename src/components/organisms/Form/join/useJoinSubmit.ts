import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { UseFormSetError, UseFormWatch } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  sendLoginRequest,
  sendRegisterRequest,
} from "../../../../api/authentication/authApi";
import { registerErrorMessages } from "../../../../constants/errorMessages";
import { useAuth } from "../../../../hooks/useAuth";
import { ApiErrorResponse } from "../../../../types/api/common";
import {
  LoginData,
  LoginResponse,
  RegisterResponse,
} from "../../../../types/api/user";
import { JoinConfirmData } from "../../../../types/form/user";

export const useJoinSubmit = (
  setError: UseFormSetError<JoinConfirmData>,
  watch: UseFormWatch<JoinConfirmData>
) => {
  const { saveAuthInfo } = useAuth();
  const navigate = useNavigate();
  const mutation = useMutation<
    RegisterResponse,
    AxiosError<ApiErrorResponse>,
    LoginData
  >({
    mutationFn: sendRegisterRequest,
    onError: (error) => handleRegisterError(error, setError),
    onSuccess: async () => {
      try {
        const loginResponse: LoginResponse = await sendLoginRequest({
          email: watch("email"),
          password: watch("password"),
        });
        if (loginResponse.data?.accessToken)
          saveAuthInfo(loginResponse.data.accessToken);
      } catch {
        toast.error("자동 로그인에 실패했습니다. 로그인 페이지로 이동합니다.");
        void navigate("/login");
      }
    },
  });

  return (data: JoinConfirmData) =>
    mutation.mutate({
      email: data.email,
      password: data.password,
      role: data.role,
    });
};

const handleRegisterError = (
  error: AxiosError<ApiErrorResponse>,
  setError: UseFormSetError<JoinConfirmData>
) => {
  const code = error.response?.data.code;
  if (code === 1) {
    setError("email", {
      message: registerErrorMessages.duplicateUser,
      type: "manual",
    });
    return;
  }
  if (code === 5) {
    const field = error.response?.data.details?.[0].field as
      | keyof JoinConfirmData
      | undefined;
    const message =
      field === "email"
        ? registerErrorMessages.validation.emailInvalid
        : registerErrorMessages.validation.passwordInvalid;
    if (field) setError(field, { message, type: "manual" });
    return;
  }
  toast.error(registerErrorMessages.generic);
};
