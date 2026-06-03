import { requireEnv } from "../constants/env";

let openCVPromise: Promise<void> | null = null;

export const loadOpenCV = async (): Promise<void> => {
  if (openCVPromise) return openCVPromise;

  openCVPromise = new Promise((resolve, reject) => {
    if (window.cv) {
      resolve();
      return;
    }

    if (window.cvScriptLoaded) {
      waitForOpenCV(resolve);
      return;
    }

    window.cvScriptLoaded = true;
    const script = document.createElement("script");
    script.src = requireEnv("VITE_OPENCV_SCRIPT_URL");
    script.async = true;
    script.type = "text/javascript";
    script.onload = () => waitForOpenCV(resolve);
    script.onerror = () => {
      window.cvScriptLoaded = false;
      openCVPromise = null;
      reject(new Error("Failed to load OpenCV.js"));
    };
    document.body.appendChild(script);
  });

  return openCVPromise;
};

const waitForOpenCV = (resolve: () => void) => {
  const checkCv = setInterval(() => {
    if (window.cv) {
      clearInterval(checkCv);
      resolve();
    }
  }, 100);
};
