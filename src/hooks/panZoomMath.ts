import { Point } from "../types/components/common";

export const clampScale = (scale: number) => Math.min(Math.max(0.5, scale), 3);

export const pointerInRect = (event: WheelEvent, rect: DOMRect): Point => ({
  x: event.clientX - rect.left,
  y: event.clientY - rect.top,
});

export const zoomTranslate = (
  translate: Point,
  point: Point,
  currentScale: number,
  nextScale: number,
  scaledTranslate?: boolean
): Point => {
  if (currentScale === nextScale) return translate;
  if (scaledTranslate) {
    return {
      x: translate.x + point.x / nextScale - point.x / currentScale,
      y: translate.y + point.y / nextScale - point.y / currentScale,
    };
  }
  const ratio = nextScale / currentScale;
  return {
    x: translate.x * ratio + point.x * (1 - ratio),
    y: translate.y * ratio + point.y * (1 - ratio),
  };
};
