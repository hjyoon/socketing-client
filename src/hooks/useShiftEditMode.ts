import { useEffect } from "react";

export const useShiftEditMode = (setEditMode: (enabled: boolean) => void) => {
  useEffect(() => {
    const down = (event: KeyboardEvent) =>
      event.key === "Shift" && setEditMode(true);
    const up = (event: KeyboardEvent) =>
      event.key === "Shift" && setEditMode(false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [setEditMode]);
};
