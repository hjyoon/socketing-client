import { RefObject, useCallback, useEffect, useState } from "react";
import { useEventCreate } from "../../store/EventCreateContext";
import { loadOpenCV, processImageWithOpenCV } from "../opencv";
import {
  calculateBoundingBox,
  calculateContourCenter,
  pointsToSVGPath,
} from "../svg";

interface Args {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  highThreshold: number;
  imageUrl: string;
  lowThreshold: number;
  minContourArea: number;
}

const maxRetries = 3;

export const useContourProcessing = ({
  canvasRef,
  highThreshold,
  imageUrl,
  lowThreshold,
  minContourArea,
}: Args) => {
  const { setContours } = useEventCreate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [isOpenCVReady, setIsOpenCVReady] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    loadOpenCV()
      .then(() => setIsOpenCVReady(true))
      .catch(() => setError("Failed to initialize OpenCV"));
  }, []);

  const processImage = useCallback(
    async (isRetry = false) => {
      if (!canvasRef.current || !window.cv || !isOpenCVReady) return;
      setIsProcessing(true);
      setError("");

      try {
        const contours = await processImageWithOpenCV(
          canvasRef.current,
          imageUrl,
          lowThreshold,
          highThreshold,
          minContourArea,
          {
            calculateBoundingBox,
            calculateContourCenter,
            pointsToSVGPath,
            setImageSize,
          }
        );
        setContours(contours);
        setRetryCount(0);
      } catch {
        if (isRetry && retryCount < maxRetries)
          setRetryCount((prev) => prev + 1);
        setError("오류가 발생하여 재시도 중 입니다.");
      } finally {
        setIsProcessing(false);
      }
    },
    [
      canvasRef,
      highThreshold,
      imageUrl,
      isOpenCVReady,
      lowThreshold,
      minContourArea,
      retryCount,
      setContours,
    ]
  );

  useEffect(() => {
    if (isOpenCVReady && imageUrl) void processImage();
  }, [imageUrl, isOpenCVReady, processImage]);

  useEffect(() => {
    if (!error || retryCount >= maxRetries) return;
    const retryTimeout = setTimeout(() => void processImage(true), 2000);
    return () => clearTimeout(retryTimeout);
  }, [error, processImage, retryCount]);

  return {
    error,
    handleRetry: () => {
      setRetryCount(0);
      void processImage(true);
    },
    imageSize,
    isOpenCVReady,
    isProcessing,
    retryCount,
  };
};
