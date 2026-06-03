import React, { useEffect, useRef, useState } from "react";
import { Point } from "../types/components/common";

interface Options {
  mouseDeltaByScale?: boolean;
  preventTouchScroll?: boolean;
}

export const usePanZoom = ({
  mouseDeltaByScale,
  preventTouchScroll,
}: Options = {}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPoint, setStartPoint] = useState<Point>({ x: 0, y: 0 });
  const [translate, setTranslate] = useState<Point>({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [touchDistance, setTouchDistance] = useState<number | null>(null);

  useEffect(() => {
    if (!preventTouchScroll || !containerRef.current) return;
    const prevent = (event: TouchEvent) => event.preventDefault();
    const options = { passive: false };
    const container = containerRef.current;
    container.addEventListener("touchmove", prevent, options);
    return () => container.removeEventListener("touchmove", prevent);
  }, [preventTouchScroll]);

  useEffect(() => {
    const move = (event: MouseEvent) => {
      if (!isDragging) return;
      const divisor = mouseDeltaByScale ? scale : 1;
      setTranslate((prev) => ({
        x: prev.x + (event.clientX - startPoint.x) / divisor,
        y: prev.y + (event.clientY - startPoint.y) / divisor,
      }));
      setStartPoint({ x: event.clientX, y: event.clientY });
    };
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      setScale((prev) => clampScale(prev + event.deltaY * -0.001));
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", () => setIsDragging(false));
    containerRef.current?.addEventListener("wheel", wheel);
    return () => {
      document.removeEventListener("mousemove", move);
      containerRef.current?.removeEventListener("wheel", wheel);
    };
  }, [isDragging, mouseDeltaByScale, scale, startPoint]);

  const handleMouseDown = (event: React.MouseEvent): void => {
    if (event.button !== 0) return;
    event.preventDefault();
    setIsDragging(true);
    setStartPoint({ x: event.clientX, y: event.clientY });
  };

  const handleTouchStart = (event: React.TouchEvent): void => {
    if (event.touches.length === 1) {
      setIsDragging(true);
      setStartPoint({
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      });
    }
    if (event.touches.length === 2) {
      setTouchDistance(getTouchDistance(event.touches[0], event.touches[1]));
    }
  };

  const handleTouchMove = (event: React.TouchEvent): void => {
    if (event.touches.length === 1 && isDragging) {
      const point = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
      setTranslate((prev) => ({
        x: prev.x + point.x - startPoint.x,
        y: prev.y + point.y - startPoint.y,
      }));
      setStartPoint(point);
    }
    if (event.touches.length === 2 && touchDistance !== null) {
      const next = getTouchDistance(event.touches[0], event.touches[1]);
      setScale((prev) => clampScale(prev + (next - touchDistance) * 0.01));
      setTouchDistance(next);
    }
  };

  const reset = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  return {
    containerRef,
    handleMouseDown,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd: () => {
      setIsDragging(false);
      setTouchDistance(null);
    },
    isDragging,
    reset,
    scale,
    setScale,
    setTranslate,
    translate,
  };
};

const clampScale = (scale: number) => Math.min(Math.max(0.5, scale), 3);

const getTouchDistance = (a: React.Touch, b: React.Touch): number =>
  Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
