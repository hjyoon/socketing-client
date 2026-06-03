import { describe, expect, it } from "vitest";
import {
  calculateBoundingBox,
  calculateContourCenter,
  calculateFontSize,
  pointsToSVGPath,
} from "./svgGeometry";

const square = [
  { x: 0, y: 0 },
  { x: 10, y: 0 },
  { x: 10, y: 10 },
  { x: 0, y: 10 },
];

describe("svgGeometry", () => {
  it("calculates bounding boxes and paths", () => {
    expect(calculateBoundingBox(square)).toEqual({
      height: 10,
      width: 10,
      x: 0,
      y: 0,
    });
    expect(pointsToSVGPath(square)).toBe("M 0 0 L 10 0 L 10 10 L 0 10 Z");
    expect(pointsToSVGPath([])).toBe("");
  });

  it("calculates centers and clamps font size", () => {
    expect(calculateContourCenter(square)).toEqual({ x: 5, y: 5 });
    expect(calculateFontSize({ height: 20, width: 20 })).toBe(18);
    expect(calculateFontSize({ height: 100, width: 100 })).toBe(42);
  });

  it("uses the bounding-box center when the centroid is outside", () => {
    const concave = [
      { x: 0, y: 0 },
      { x: 8, y: 0 },
      { x: 8, y: 2 },
      { x: 2, y: 2 },
      { x: 2, y: 8 },
      { x: 0, y: 8 },
    ];
    expect(calculateContourCenter(concave)).toEqual({ x: 4, y: 4 });
  });
});
