import { UserPointResponse, UserResponse } from "../../types/api/user";
import { baseURL } from "../../constants/api";
import { apiRequest } from "../http";

const API_URL = baseURL + "users/";

const getUserInfo = async (user_id: string): Promise<UserResponse> => {
  return apiRequest<UserResponse>(API_URL + user_id);
};

const getUserInfoByEmail = async (email: string): Promise<UserResponse> => {
  const modifiedEmail = email + "@jungle.com";
  return apiRequest<UserResponse>(API_URL + "email/" + modifiedEmail);
};

const getUserPoints = async (user_id: string): Promise<UserPointResponse> => {
  return apiRequest<UserPointResponse>(API_URL + user_id + "/points");
};

const updateUserNickname = async (
  user_id: string,
  newNickname: string
): Promise<UserResponse> => {
  try {
    return await apiRequest<UserResponse>(API_URL + user_id + "/nickname", {
      auth: "required",
      body: { nickname: newNickname },
      method: "PATCH",
    });
  } catch (error) {
    console.error("Failed to update nickname:", error);
    throw error;
  }
};
export { getUserInfo, updateUserNickname, getUserInfoByEmail, getUserPoints };
