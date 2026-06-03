import { ApiErrorResponse } from "../types/api/common";

type AuthMode = boolean | "required";

interface RequestOptions {
  auth?: AuthMode;
  authMessage?: string;
  body?: unknown;
  method?: string;
  params?: Record<string, string | number | undefined>;
}

export class HttpError<T = ApiErrorResponse> extends Error {
  response?: { data: T; status: number };

  constructor(status: number, data: T) {
    super(getMessage(data, status));
    this.name = "HttpError";
    this.response = { data, status };
  }
}

export const apiRequest = async <T>(
  url: string,
  { auth, authMessage, body, method = "GET", params }: RequestOptions = {}
): Promise<T> => {
  const headers = new Headers();
  if (body !== undefined) headers.set("Content-Type", "application/json");

  if (auth) {
    const token = localStorage.getItem("authToken");
    if (!token && auth === "required") {
      throw new Error(authMessage ?? "인증 토큰이 없습니다. 로그인해주세요.");
    }
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(withParams(url, params), {
    body: body === undefined ? undefined : JSON.stringify(body),
    headers,
    method,
  });
  const data = await readJson(response);
  if (!response.ok) throw new HttpError(response.status, data);

  return data as T;
};

const withParams = (
  url: string,
  params?: Record<string, string | number | undefined>
) => {
  if (!params) return url;
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) search.set(key, String(value));
  });
  const query = search.toString();
  if (!query) return url;

  return `${url}${url.includes("?") ? "&" : "?"}${query}`;
};

const readJson = async (response: Response): Promise<unknown> => {
  const text = await response.text();
  if (!text) return undefined;
  try {
    const parsed: unknown = JSON.parse(text);
    return parsed;
  } catch {
    return text;
  }
};

const getMessage = <T>(data: T, status: number) => {
  if (typeof data === "object" && data && "message" in data) {
    const message = (data as { message?: unknown }).message;
    if (typeof message === "string") return message;
  }
  return `HTTP ${status}`;
};
