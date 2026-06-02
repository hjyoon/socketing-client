const withTrailingSlash = (url: string) =>
  url.endsWith("/") ? url : `${url}/`;

export const baseURL = withTrailingSlash(
  import.meta.env.VITE_API_BASE_URL || "https://socketing.hjyoon.me/api/"
);
