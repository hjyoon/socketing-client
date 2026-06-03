import { forwardRef, useContext, useState } from "react";
import { AreaSocket, Seat } from "../types/api/socket";
import { ReservationContext } from "../store/ReservationContext";
import { useParsedSvgContent } from "./svg-wrapper/useParsedSvgContent";
import { useAreaStatsFill } from "./svg-wrapper/useAreaStatsFill";

interface SvgWrapperProps {
  svgString: string;
  seats: Seat[];
  areas: AreaSocket[];
  renderSeat: (seat: Seat) => React.ReactNode;
  onAreaClick?: (areaId: string) => void;
}

const SvgWrapper = forwardRef<SVGSVGElement, SvgWrapperProps>(
  ({ svgString, seats, areas, renderSeat, onAreaClick }, ref) => {
    const context = useContext(ReservationContext);
    const svgContent = useParsedSvgContent(svgString);
    const [hoveredAreaId, setHoveredAreaId] = useState<string | null>(null);
    useAreaStatsFill(context.areaStats);

    const handleAreaClick = (area: AreaSocket) => {
      if (context.currentAreaId === area.id) return;
      const areaElement = document.querySelector(
        `.areas [class='${area.id}'] .area-data`
      );
      if (areaElement instanceof SVGPathElement) onAreaClick?.(area.id);
      context.setSeatsMap(new Map());
      if (context.currentAreaId !== null)
        context.exitArea(context.currentAreaId);
      context.joinArea(area.id);
      context.setCurrentAreaId(area.id);
    };

    if (!svgContent.viewBox) return null;

    return (
      <svg
        ref={ref}
        width="100%"
        height="100%"
        viewBox={svgContent.viewBox}
        className="w-full h-full"
      >
        <g dangerouslySetInnerHTML={{ __html: svgContent.content }} />
        <g className="areas">
          {areas?.map((area) => (
            <g
              key={area.id}
              className={area.id}
              dangerouslySetInnerHTML={{ __html: area.svg }}
              onClick={() => handleAreaClick(area)}
              onMouseEnter={() =>
                context.currentAreaId !== area.id && setHoveredAreaId(area.id)
              }
              onMouseLeave={() => setHoveredAreaId(null)}
              style={getAreaStyles(
                area.id,
                context.currentAreaId,
                hoveredAreaId
              )}
            />
          ))}
        </g>
        <g className="seats">
          {seats?.map((seat) => (
            <g key={seat.id} transform={`translate(${seat.cx},${seat.cy})`}>
              {renderSeat(seat)}
            </g>
          ))}
        </g>
      </svg>
    );
  }
);

const getAreaStyles = (
  areaId: string,
  currentAreaId: string | null,
  hoveredAreaId: string | null
) => {
  const isHovered = hoveredAreaId === areaId;
  const isSelected = currentAreaId === areaId;
  return {
    cursor: isSelected ? "default" : "pointer",
    filter:
      !isSelected && isHovered
        ? "brightness(1.2) drop-shadow(0 0 3px rgba(0,0,0,0.3))"
        : "none",
    opacity: !isSelected && isHovered ? 0.9 : 1,
    stroke: isSelected ? "#2563eb" : "none",
    strokeWidth: isSelected ? "2" : "0",
    transition: "all 0.3s ease",
  };
};

SvgWrapper.displayName = "SvgWrapper";

export default SvgWrapper;
