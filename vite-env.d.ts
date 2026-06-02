/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_SOCKET_SERVER_URL?: string;
  readonly VITE_QUEUE_SERVER_URL?: string;
  readonly VITE_OPENCV_SCRIPT_URL?: string;
  readonly VITE_FONT_STYLESHEET_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
