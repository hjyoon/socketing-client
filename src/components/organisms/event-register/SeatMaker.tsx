import React, { useState } from "react";
import { useEventCreate } from "../../../store/EventCreateContext";
import { useSeatMakerInteraction } from "../../../hooks/useSeatMakerInteraction";
import ContourToSVG from "../../../utils/ContourToSVG";
import ImageMinimap from "./ImageMinimap";
import ZoomControls from "../../molecules/seat/ZoomControls";

interface SeatMakerProps {
  isDateSidebarOpen: boolean;
}

const SeatMaker: React.FC<SeatMakerProps> = ({ isDateSidebarOpen = false }) => {
  const { imageUrl } = useEventCreate();
  const [showLegend, setShowLegend] = useState(false);
  const pan = useSeatMakerInteraction();

  return (
    <div
      ref={pan.containerRef}
      className={`relative w-full h-full overflow-hidden bg-[#f9efef] transition-all duration-300 ${isDateSidebarOpen ? "ml-1/5" : ""}`}
      onMouseDown={pan.handleMouseDown}
      style={{ touchAction: "none" }}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${pan.translate.x}px, ${pan.translate.y}px) scale(${pan.scale})`,
          transformOrigin: "center",
          transition: pan.isDragging ? "none" : "transform 0.1s ease-out",
        }}
      >
        {imageUrl ? (
          <ContourToSVG
            imageUrl={imageUrl}
            lowThreshold={30}
            highThreshold={150}
            minContourArea={0}
            selectionBox={pan.selectionBox}
            showAreas={pan.showAreas}
          />
        ) : (
          <div className="text-gray-500 text-center">
            이미지를 업로드해주세요.
          </div>
        )}
      </div>

      <ZoomControls
        scale={pan.scale}
        setScale={pan.setScale}
        reset={pan.reset}
        hiddenOnMobile={false}
        positionClass="bottom-4"
      />
      <button
        className="absolute top-0 right-0 rounded-md p-2 shadow-lg flex items-center justify-center text-sm border bg-white opacity-70"
        onClick={() => setShowLegend((prev) => !prev)}
      >
        {showLegend ? "▲" : "미니 맵 ▼"}
      </button>
      {showLegend && (
        <div className="absolute top-10 right-0 max-w-[200px] bg-white rounded-lg shadow-lg opacity-80">
          <ImageMinimap />
        </div>
      )}
    </div>
  );
};

export default SeatMaker;
