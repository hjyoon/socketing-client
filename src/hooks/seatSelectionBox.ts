import { Contour, Point } from "../types/components/common";

export const isSeatInBox = (contour: Contour, start: Point, end: Point) =>
  contour.type === "seat" &&
  contour.center.x >= Math.min(start.x, end.x) &&
  contour.center.x <= Math.max(start.x, end.x) &&
  contour.center.y >= Math.min(start.y, end.y) &&
  contour.center.y <= Math.max(start.y, end.y);
