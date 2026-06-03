import { Contour, Point } from "../types/components/common";

export const createOutlinePath = (
  contours: Contour[],
  padding = 20,
  threshold = 10
): string => {
  const points = contours.flatMap((contour) => contour.points);
  if (points.length === 0) return "";

  const center = {
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
  };
  const padded = points.map((point) => padPoint(point, center, padding));
  const simplified = simplifyPath(getConvexHull(padded), threshold);

  if (simplified.length === 0) return "";
  const [first, ...rest] = simplified;
  return [
    `M ${first.x} ${first.y}`,
    ...rest.map((p) => `L ${p.x} ${p.y}`),
    "Z",
  ].join(" ");
};

const padPoint = (point: Point, center: Point, padding: number): Point => {
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const scale = distance === 0 ? 1 : (distance + padding) / distance;
  return { x: center.x + dx * scale, y: center.y + dy * scale };
};

const simplifyPath = (points: Point[], threshold: number): Point[] => {
  if (points.length <= 2) return points;

  const result: Point[] = [points[0]];
  let lastPoint = points[0];

  for (let i = 1; i < points.length; i += 1) {
    const current = points[i];
    const changed =
      Math.abs(current.x - lastPoint.x) > threshold ||
      Math.abs(current.y - lastPoint.y) > threshold;
    const last = i === points.length - 1;
    const turns =
      i < points.length - 1 &&
      isDirectionChange(lastPoint, current, points[i + 1]);

    if (changed || last || turns) {
      result.push(current);
      lastPoint = current;
    }
  }

  return result;
};

const isDirectionChange = (a: Point, b: Point, c: Point): boolean => {
  const first = Math.atan2(b.y - a.y, b.x - a.x);
  const second = Math.atan2(c.y - b.y, c.x - b.x);
  let diff = Math.abs((second - first) * (180 / Math.PI));
  if (diff > 180) diff = 360 - diff;
  return diff > 45;
};

const getConvexHull = (points: Point[]): Point[] => {
  if (points.length < 3) return points;

  const start = points.reduce((best, point) =>
    point.y < best.y || (point.y === best.y && point.x < best.x) ? point : best
  );
  const hull = [start];
  const sorted = points
    .filter((point) => point !== start)
    .sort(
      (a, b) =>
        Math.atan2(a.y - start.y, a.x - start.x) -
        Math.atan2(b.y - start.y, b.x - start.x)
    );

  for (const point of sorted) {
    while (
      hull.length >= 2 &&
      !isLeftTurn(hull[hull.length - 2], hull[hull.length - 1], point)
    ) {
      hull.pop();
    }
    hull.push(point);
  }

  return hull;
};

const isLeftTurn = (a: Point, b: Point, c: Point): boolean =>
  (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) > 0;
