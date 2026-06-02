import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/global.css";
import App from "./App.tsx";
import { requireEnv } from "./constants/env";

const fontStylesheetId = "app-font-stylesheet";

if (!document.getElementById(fontStylesheetId)) {
  const fontStylesheet = document.createElement("link");
  fontStylesheet.id = fontStylesheetId;
  fontStylesheet.rel = "stylesheet";
  fontStylesheet.href = requireEnv("VITE_FONT_STYLESHEET_URL");
  document.head.appendChild(fontStylesheet);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
