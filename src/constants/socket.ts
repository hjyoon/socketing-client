import { requireEnv, withTrailingSlash } from "./env";

export const SOCKET_SERVER_URL = withTrailingSlash(
  requireEnv("VITE_SOCKET_SERVER_URL")
);
export const QUEUE_SERVER_URL = withTrailingSlash(
  requireEnv("VITE_QUEUE_SERVER_URL")
);
