import { Contour } from "../types/components/common";
import { readContours } from "./openCVContours";
import { ProcessCallbacks } from "./openCVTypes";

export const processImageWithOpenCV = async (
  canvas: HTMLCanvasElement,
  imageUrl: string,
  lowThreshold: number,
  highThreshold: number,
  minContourArea: number,
  callbacks: ProcessCallbacks
): Promise<Contour[]> => {
  const image = await loadImage(imageUrl);
  callbacks.setImageSize({ width: image.width, height: image.height });

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Failed to get 2D context");

  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const src = window.cv.matFromArray(
    imageData.height,
    imageData.width,
    window.cv.CV_8UC4,
    new Uint8ClampedArray(imageData.data)
  );
  const gray = new window.cv.Mat();
  const edges = new window.cv.Mat();
  const hierarchy = new window.cv.Mat();
  const contoursMat = new window.cv.MatVector();

  try {
    const processed = closeEdges(gray, edges, src, lowThreshold, highThreshold);
    window.cv.findContours(
      processed,
      contoursMat,
      hierarchy,
      window.cv.RETR_EXTERNAL,
      window.cv.CHAIN_APPROX_SIMPLE
    );
    processed.delete();
    return readContours(contoursMat, minContourArea, callbacks);
  } finally {
    src.delete();
    gray.delete();
    edges.delete();
    hierarchy.delete();
    contoursMat.delete();
  }
};

const loadImage = async (imageUrl: string): Promise<HTMLImageElement> => {
  const image = new Image();
  image.crossOrigin = "anonymous";
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Failed to load image"));
    image.src = imageUrl;
  });
  return image;
};

const closeEdges = (
  gray: InstanceType<typeof window.cv.Mat>,
  edges: InstanceType<typeof window.cv.Mat>,
  src: InstanceType<typeof window.cv.Mat>,
  lowThreshold: number,
  highThreshold: number
) => {
  window.cv.cvtColor(src, gray, window.cv.COLOR_RGBA2GRAY);
  window.cv.GaussianBlur(gray, gray, new window.cv.Size(3, 3), 0);
  window.cv.Canny(gray, edges, lowThreshold, highThreshold, 3);

  const kernel = window.cv.getStructuringElement(
    window.cv.MORPH_RECT,
    new window.cv.Size(2, 2)
  );
  const processed = new window.cv.Mat();
  window.cv.morphologyEx(edges, processed, window.cv.MORPH_CLOSE, kernel);
  kernel.delete();
  return processed;
};
