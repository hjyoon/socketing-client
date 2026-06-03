import React from "react";
import { Contour } from "../../types/components/common";

interface Props {
  contour: Contour;
  editMode: boolean;
  isSelected: boolean;
  setSelectedContour: (id: number) => void;
}

const SeatContourShape = ({
  contour,
  editMode,
  isSelected,
  setSelectedContour,
}: Props) => (
  <g key={contour.id} className="seat">
    <circle
      cx={contour.cx}
      cy={contour.cy}
      r={contour.r}
      fill={isSelected ? "rgba(255, 0, 0, 0.2)" : "rgba(0, 255, 26, 0.833)"}
      stroke={isSelected ? "red" : "gray"}
      strokeWidth={isSelected ? "2" : "1"}
      opacity="0.8"
      cursor="pointer"
      onClick={(event: React.MouseEvent) => {
        if (editMode) return;
        event.stopPropagation();
        setSelectedContour(contour.id);
      }}
    />
    <SeatLabel contour={contour} />
  </g>
);

const SeatLabel = ({ contour }: { contour: Contour }) => {
  if (!contour.row || contour.row <= 0 || !contour.number) return null;
  if (contour.number === 1 && contour.cx) {
    return (
      <text
        x={contour.cx}
        y={contour.cy}
        textAnchor="middle"
        dominantBaseline="middle"
        pointerEvents="none"
      >
        <tspan
          x={contour.cx - 18}
          fill="blue"
          fontSize="8"
          fontWeight="bold"
        >{`${contour.row}열`}</tspan>
        <tspan
          x={contour.cx}
          fill="black"
          fontSize="7"
          fontWeight="bold"
        >{`${contour.number}번`}</tspan>
      </text>
    );
  }
  return (
    <text
      x={contour.cx}
      y={contour.cy}
      textAnchor="middle"
      dominantBaseline="middle"
      fill="black"
      fontWeight="bold"
      fontSize="7"
      pointerEvents="none"
    >
      {`${contour.number}번`}
    </text>
  );
};

export default SeatContourShape;
