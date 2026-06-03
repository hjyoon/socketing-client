import React, { useContext, useRef, useState } from "react";
import { ReservationContext } from "../../../store/ReservationContext";
import { usePanZoom } from "../../../hooks/usePanZoom";
import SeatObj from "../../atoms/seats/SeatObj";
import SeatTimer from "../../molecules/timer/SeatTimer";
import SeatLegend from "../../molecules/seat/SeatLegend";
import SvgWrapper from "../../../utils/SvgWrapper";
import ZoomControls from "../../molecules/seat/ZoomControls";

interface SeatContainerProps {
  svg: string;
}

const SeatContainer: React.FC<SeatContainerProps> = ({ svg }) => {
  const { seatsMap, areasMap } = useContext(ReservationContext);
  const svgRef = useRef<SVGSVGElement>(null);
  const [showLegend, setShowLegend] = useState(false);
  const pan = usePanZoom({ mouseDeltaByScale: true, preventTouchScroll: true });
  const seatsData = Array.from(seatsMap.values());
  const areasData = Array.from(areasMap.values());

  const zoomToArea = (areaId: string) => {
    const areaElement = svgRef.current?.querySelector(
      `.areas [class='${areaId}'] .area-data`
    );
    if (!areaElement || !pan.containerRef.current || !svgRef.current) return;

    const bbox = (areaElement as SVGPathElement).getBBox();
    const viewBox = svgRef.current.viewBox.baseVal;
    const rect = pan.containerRef.current.getBoundingClientRect();
    const fixedScale = window.innerWidth <= 768 ? 2 : 1.5;
    const scaleX =
      (svgRef.current.width.baseVal.value || viewBox.width) / viewBox.width;
    const scaleY =
      (svgRef.current.height.baseVal.value || viewBox.height) / viewBox.height;

    pan.setScale(() => fixedScale);
    pan.setTranslate({
      x:
        rect.width / 2 / fixedScale -
        (bbox.x - viewBox.x) * scaleX -
        (bbox.width * scaleX) / 2,
      y:
        rect.height / 2 / fixedScale -
        (bbox.y - viewBox.y) * scaleY -
        (bbox.height * scaleY) / 2,
    });
  };

  return (
    <div className="relative h-full">
      <div
        ref={pan.containerRef}
        className="relative flex-1 overflow-hidden bg-gray-50"
        style={{ height: "100%", touchAction: "none" }}
        onMouseDown={pan.handleMouseDown}
        onTouchStart={pan.handleTouchStart}
        onTouchMove={pan.handleTouchMove}
        onTouchEnd={pan.handleTouchEnd}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${pan.translate.x * pan.scale}px, ${pan.translate.y * pan.scale}px) scale(${pan.scale})`,
            transformOrigin: "0 0",
            transition: pan.isDragging ? "none" : "transform 0.3s ease-out",
          }}
        >
          <SvgWrapper
            ref={svgRef}
            svgString={svg}
            seats={seatsData}
            areas={areasData}
            renderSeat={(seat) => <SeatObj seatData={seat} />}
            onAreaClick={zoomToArea}
          />
        </div>
      </div>

      <ZoomControls
        scale={pan.scale}
        setScale={pan.setScale}
        reset={pan.reset}
      />
      <button
        className="absolute top-0 right-0 rounded-md p-2 shadow-lg flex items-center justify-center text-sm border bg-white opacity-70"
        onClick={() => setShowLegend((prev) => !prev)}
      >
        {showLegend ? "▲" : "좌석 색 정보 ▼"}
      </button>
      {showLegend && <SeatLegend />}
      <SeatTimer />
    </div>
  );
};

export default SeatContainer;
