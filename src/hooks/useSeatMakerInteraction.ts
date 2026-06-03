import React, { useCallback, useEffect, useRef, useState } from "react";
import { useEventCreate } from "../store/EventCreateContext";
import { Point } from "../types/components/common";
import { isSeatInBox } from "./seatSelectionBox";
import { useShiftEditMode } from "./useShiftEditMode";

const ZOOM_THRESHOLD = 1.1;

export const useSeatMakerInteraction = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPoint, setStartPoint] = useState<Point>({ x: 0, y: 0 });
  const [translate, setTranslate] = useState<Point>({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [selectionBox, setSelectionBox] = useState<{
    start: Point;
    end: Point;
  } | null>(null);
  const [showAreas, setShowAreas] = useState(true);
  const {
    editMode,
    setEditMode,
    setSelectedContours,
    contours,
    setSelectedContour,
  } = useEventCreate();

  useShiftEditMode(setEditMode);

  const screenToSVGCoords = useCallback(
    (clientX: number, clientY: number): Point => {
      const svg = containerRef.current?.querySelector("svg");
      if (!svg) return { x: 0, y: 0 };
      const point = svg.createSVGPoint();
      point.x = clientX;
      point.y = clientY;
      return point.matrixTransform(svg.getScreenCTM()?.inverse());
    },
    []
  );

  useEffect(() => {
    const move = (event: MouseEvent) => {
      if (editMode && selectionBox) {
        const end = screenToSVGCoords(event.clientX, event.clientY);
        setSelectionBox({ start: selectionBox.start, end });
        setSelectedContours(
          contours
            .filter((c) => isSeatInBox(c, selectionBox.start, end))
            .map((c) => c.id)
        );
        return;
      }
      if (!isDragging || editMode) return;
      setTranslate((prev) => ({
        x: prev.x + event.clientX - startPoint.x,
        y: prev.y + event.clientY - startPoint.y,
      }));
      setStartPoint({ x: event.clientX, y: event.clientY });
    };
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      setScale((prev) => {
        const next = Math.min(Math.max(0.5, prev + event.deltaY * -0.001), 3);
        setShowAreas(next <= ZOOM_THRESHOLD);
        return next;
      });
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", () => {
      setIsDragging(false);
      setSelectionBox(null);
    });
    containerRef.current?.addEventListener("wheel", wheel);
    return () => {
      document.removeEventListener("mousemove", move);
      containerRef.current?.removeEventListener("wheel", wheel);
    };
  }, [
    contours,
    editMode,
    isDragging,
    screenToSVGCoords,
    selectionBox,
    setSelectedContours,
    startPoint,
  ]);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    if ((event.target as Element).closest(".background-image")) {
      setSelectedContour(null);
      setSelectedContours([]);
    }
    if (editMode) {
      const start = screenToSVGCoords(event.clientX, event.clientY);
      setSelectionBox({ start, end: start });
      return;
    }
    setIsDragging(true);
    setStartPoint({ x: event.clientX, y: event.clientY });
  };

  const reset = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  return {
    containerRef,
    handleMouseDown,
    isDragging,
    reset,
    scale,
    selectionBox,
    setScale,
    showAreas,
    translate,
  };
};
