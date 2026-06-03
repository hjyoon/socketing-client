import React, { useRef } from "react";
import { useEventCreate } from "../store/EventCreateContext";
import { Point } from "../types/components/common";
import ContourStatus from "./contour/ContourStatus";
import ContourSvgLayers from "./contour/ContourSvgLayers";
import { useContourProcessing } from "./contour/useContourProcessing";

interface ContourToSVGProps {
  imageUrl: string;
  lowThreshold?: number;
  highThreshold?: number;
  minContourArea?: number;
  selectionBox?: { start: Point; end: Point } | null;
  showAreas?: boolean;
}

const ContourToSVG: React.FC<ContourToSVGProps> = ({
  imageUrl,
  lowThreshold = 50,
  highThreshold = 150,
  minContourArea = 100,
  selectionBox,
  showAreas = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useContourProcessing({
    canvasRef,
    highThreshold,
    imageUrl,
    lowThreshold,
    minContourArea,
  });
  const eventState = useEventCreate();

  const handleContourClick = (event: React.MouseEvent, id: number) => {
    if (eventState.editMode) return;
    event.stopPropagation();
    eventState.setSelectedContour(
      eventState.selectedContour === id ? null : id
    );
  };

  return (
    <div className="w-full">
      <ContourStatus {...state} />
      <div className="relative w-full">
        <canvas ref={canvasRef} className="hidden" />
        <ContourSvgLayers
          {...eventState}
          imageSize={state.imageSize}
          imageUrl={imageUrl}
          onContourClick={handleContourClick}
          selectionBox={selectionBox}
          showAreas={showAreas}
        />
      </div>
    </div>
  );
};

export default ContourToSVG;
