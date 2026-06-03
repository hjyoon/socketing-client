import React from "react";
import { Contour } from "../../types/components/common";
import { calculateFontSize } from "../svg";

interface Props {
  contour: Contour;
  fillColor?: string;
  isSelected: boolean;
  onClick: (event: React.MouseEvent, id: number) => void;
  showArea?: boolean;
}

const ContourShape = ({
  contour,
  fillColor = "none",
  isSelected,
  onClick,
  showArea,
}: Props) => {
  if (contour.type === "area") {
    return (
      <g key={contour.id} id={contour.id.toString()}>
        {showArea && (
          <path
            d={contour.path}
            className="area-data"
            fill="rgba(8, 79, 206, 0.983)"
            stroke="#f1e5e5"
            strokeWidth="5"
            opacity="1"
            cursor="pointer"
            onClick={(event) => onClick(event, contour.id)}
          />
        )}
        <path
          d={contour.path}
          className="area-path-data"
          fill="none"
          stroke={isSelected ? "red" : "#f1e5e5"}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="1"
          cursor="pointer"
          onClick={(event) => onClick(event, contour.id)}
        />
        {showArea && <ContourText contour={contour} fill="white" />}
      </g>
    );
  }

  return (
    <g key={contour.id}>
      <path
        d={contour.path}
        fill={isSelected ? "rgba(255, 0, 0, 0.2)" : fillColor}
        stroke={isSelected ? "red" : "blue"}
        strokeWidth={isSelected ? "3" : "2"}
        opacity="0.7"
        cursor="pointer"
        onClick={(event) => onClick(event, contour.id)}
      />
      <ContourText contour={contour} fill="black" />
    </g>
  );
};

const ContourText = ({ contour, fill }: { contour: Contour; fill: string }) => (
  <text
    x={contour.center.x}
    y={contour.center.y}
    textAnchor="middle"
    dominantBaseline="middle"
    fill={fill}
    fontSize={calculateFontSize(contour.boundingBox)}
    fontWeight="bold"
    pointerEvents="none"
  >
    {contour.label}
  </text>
);

export default ContourShape;
