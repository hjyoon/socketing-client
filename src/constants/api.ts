import { requireEnv, withTrailingSlash } from "./env";

export const baseURL = withTrailingSlash(requireEnv("VITE_API_BASE_URL"));
