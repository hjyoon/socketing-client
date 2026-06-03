import {
  LoginData,
  RegisterResponse,
  LoginResponse,
} from "../../types/api/user";
import { baseURL } from "../../constants/api";
import { apiRequest } from "../http";

const API_URL = baseURL + "auth/";

const sendRegisterRequest = async ({
  email,
  password,
  role,
}: LoginData): Promise<RegisterResponse> => {
  return apiRequest<RegisterResponse>(API_URL + "register", {
    body: { email, password, role },
    method: "POST",
  });
};

const sendLoginRequest = async ({
  email,
  password,
}: LoginData): Promise<LoginResponse> => {
  return apiRequest<LoginResponse>(API_URL + "login", {
    body: { email, password },
    method: "POST",
  });
};

export { sendRegisterRequest, sendLoginRequest };
