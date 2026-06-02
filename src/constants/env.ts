type RequiredEnvName =
  | "VITE_API_BASE_URL"
  | "VITE_SOCKET_SERVER_URL"
  | "VITE_QUEUE_SERVER_URL"
  | "VITE_OPENCV_SCRIPT_URL"
  | "VITE_FONT_STYLESHEET_URL";

const getEnvValue = (name: RequiredEnvName): string | undefined => {
  switch (name) {
    case "VITE_API_BASE_URL":
      return import.meta.env.VITE_API_BASE_URL;
    case "VITE_SOCKET_SERVER_URL":
      return import.meta.env.VITE_SOCKET_SERVER_URL;
    case "VITE_QUEUE_SERVER_URL":
      return import.meta.env.VITE_QUEUE_SERVER_URL;
    case "VITE_OPENCV_SCRIPT_URL":
      return import.meta.env.VITE_OPENCV_SCRIPT_URL;
    case "VITE_FONT_STYLESHEET_URL":
      return import.meta.env.VITE_FONT_STYLESHEET_URL;
  }
};

export const requireEnv = (name: RequiredEnvName): string => {
  const value = getEnvValue(name);

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
};

export const withTrailingSlash = (url: string) =>
  url.endsWith("/") ? url : `${url}/`;
