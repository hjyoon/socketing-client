const withTrailingSlash = (url: string) =>
  url.endsWith("/") ? url : `${url}/`;

export const SOCKET_SERVER_URL = withTrailingSlash(
  import.meta.env.VITE_SOCKET_SERVER_URL || "https://socket.hjyoon.me/"
);
export const QUEUE_SERVER_URL = withTrailingSlash(
  import.meta.env.VITE_QUEUE_SERVER_URL || "https://queue.hjyoon.me/"
);
