import { BoundingBox, Contour, Point } from "../types/components/common";

export interface OpenCVSize {
  width: number;
  height: number;
}

export interface Mat {
  rows: number;
  cols: number;
  data: Uint8Array | Int32Array | Float32Array;
  data32S: Int32Array;
  delete(): void;
}

export interface MatVector {
  size(): number;
  get(index: number): Mat;
  delete(): void;
}

export interface OpenCV {
  Mat: new () => Mat;
  MatVector: new () => MatVector;
  Size: new (width: number, height: number) => OpenCVSize;
  COLOR_RGBA2GRAY: number;
  CV_8UC4: number;
  MORPH_RECT: number;
  MORPH_CLOSE: number;
  RETR_EXTERNAL: number;
  CHAIN_APPROX_SIMPLE: number;
  matFromArray(
    rows: number,
    cols: number,
    type: number,
    array: Uint8ClampedArray
  ): Mat;
  cvtColor(src: Mat, dst: Mat, code: number): void;
  GaussianBlur(src: Mat, dst: Mat, ksize: OpenCVSize, sigmaX: number): void;
  Canny(
    src: Mat,
    dst: Mat,
    first: number,
    second: number,
    aperture?: number
  ): void;
  getStructuringElement(shape: number, ksize: OpenCVSize): Mat;
  morphologyEx(src: Mat, dst: Mat, op: number, kernel: Mat): void;
  findContours(
    image: Mat,
    contours: MatVector,
    hierarchy: Mat,
    mode: number,
    method: number
  ): void;
  contourArea(contour: Mat): number;
  arcLength(curve: Mat, closed: boolean): number;
  approxPolyDP(
    curve: Mat,
    approxCurve: Mat,
    epsilon: number,
    closed: boolean
  ): void;
}

export interface ProcessCallbacks {
  setImageSize: (size: { width: number; height: number }) => void;
  calculateBoundingBox: (points: Point[]) => BoundingBox;
  calculateContourCenter: (points: Point[]) => Point;
  pointsToSVGPath: (points: Point[]) => string;
}

export type OpenCVContour = Contour;

declare global {
  interface Window {
    cv: OpenCV;
    cvScriptLoaded: boolean;
  }
}
