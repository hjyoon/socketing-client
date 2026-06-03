import { Point } from "../types/components/common";

export const calculateBoundingBox = (points: Point[]) => {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);

  return {
    x: Math.min(...xs),
    y: Math.min(...ys),
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
  };
};

export const pointsToSVGPath = (points: Point[]): string => {
  if (points.length === 0) return "";

  const [first, ...rest] = points;
  return [
    `M ${first.x} ${first.y}`,
    ...rest.map((p) => `L ${p.x} ${p.y}`),
    "Z",
  ].join(" ");
};

export const calculateFontSize = (box: {
  width: number;
  height: number;
}): number => {
  const baseSize = Math.min(box.width, box.height) * 0.5;
  return Math.min(Math.max(baseSize, 18), 42);
};

export const calculateContourCenter = (points: Point[]): Point => {
  const sum = points.reduce(
    (acc, point) => ({ x: acc.x + point.x, y: acc.y + point.y }),
    { x: 0, y: 0 }
  );
  const center = { x: sum.x / points.length, y: sum.y / points.length };

  if (isPointInside(center, points)) return center;

  const box = calculateBoundingBox(points);
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
};

const isPointInside = (point: Point, vertices: Point[]): boolean => {
  let inside = false;
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const vi = vertices[i];
    const vj = vertices[j];
    const crosses = vi.y > point.y !== vj.y > point.y;
    const x = ((vj.x - vi.x) * (point.y - vi.y)) / (vj.y - vi.y) + vi.x;
    if (crosses && point.x < x) inside = !inside;
  }
  return inside;
};
