import { Contour, Point } from "../types/components/common";
import { MatVector, ProcessCallbacks } from "./openCVTypes";

export const readContours = (
  contoursMat: MatVector,
  minContourArea: number,
  callbacks: ProcessCallbacks
): Contour[] => {
  const contours: Contour[] = [];

  for (let i = 0; i < contoursMat.size(); i += 1) {
    const contour = contoursMat.get(i);
    if (window.cv.contourArea(contour) < minContourArea) continue;

    const curve = new window.cv.Mat();
    const epsilon = 0.001 * window.cv.arcLength(contour, true);
    window.cv.approxPolyDP(contour, curve, epsilon, true);

    const points = readPoints(curve);
    contours.push({
      id: i,
      type: "contour",
      label: "",
      path: callbacks.pointsToSVGPath(points),
      center: callbacks.calculateContourCenter(points),
      boundingBox: callbacks.calculateBoundingBox(points),
      points,
      price: 3000,
    });

    curve.delete();
  }

  return contours;
};

const readPoints = (curve: { rows: number; data32S: Int32Array }): Point[] => {
  const points: Point[] = [];
  for (let i = 0; i < curve.rows; i += 1) {
    const point = curve.data32S.slice(i * 2, i * 2 + 2);
    points.push({ x: point[0], y: point[1] });
  }
  return points;
};
