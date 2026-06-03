import React from "react";
import { Contour, Point } from "../../types/components/common";
import { createOutlinePath } from "../svg";
import ContourShape from "./ContourShape";
import SeatContourShape from "./SeatContourShape";
import SelectionRect from "./SelectionRect";

interface Props {
  contours: Contour[];
  editMode: boolean;
  imageSize: { width: number; height: number };
  imageUrl: string;
  isImageVisible: boolean;
  onContourClick: (event: React.MouseEvent, id: number) => void;
  selectedContour: number | null;
  selectedContours: number[];
  selectionBox?: { start: Point; end: Point } | null;
  setSelectedContour: (id: number) => void;
  showAreas: boolean;
}

const ContourSvgLayers = (props: Props) => (
  <svg
    width="100%"
    height="100%"
    viewBox={`0 0 ${props.imageSize.width} ${props.imageSize.height}`}
    className="w-full h-full"
  >
    {props.isImageVisible && (
      <image
        href={props.imageUrl}
        width={props.imageSize.width}
        height={props.imageSize.height}
      />
    )}
    {!props.isImageVisible && (
      <path
        d={createOutlinePath(props.contours, 150)}
        fill="white"
        opacity="1"
        strokeWidth="2"
        stroke="white"
      />
    )}
    <g className="contours">
      {props.contours
        .filter((c) => c.type === "contour")
        .map((contour) => (
          <ContourShape
            key={contour.id}
            contour={contour}
            fillColor="rgb(242, 242, 24)"
            isSelected={isSelected(props, contour.id)}
            onClick={props.onContourClick}
          />
        ))}
    </g>
    <g className="seats">
      {props.contours
        .filter((c) => c.type === "seat")
        .map((contour) => (
          <SeatContourShape
            key={contour.id}
            contour={contour}
            editMode={props.editMode}
            isSelected={isSelected(props, contour.id)}
            setSelectedContour={props.setSelectedContour}
          />
        ))}
    </g>
    <g className="areas">
      {props.contours
        .filter((c) => c.type === "area")
        .map((contour) => (
          <ContourShape
            key={contour.id}
            contour={contour}
            isSelected={isSelected(props, contour.id)}
            onClick={props.onContourClick}
            showArea={props.showAreas}
          />
        ))}
    </g>
    <g className="polygons">
      {props.contours
        .filter((c) => c.type === "polygon")
        .map((contour) => (
          <ContourShape
            key={contour.id}
            contour={contour}
            fillColor="rgba(128, 128, 128, 0.5)"
            isSelected={isSelected(props, contour.id)}
            onClick={props.onContourClick}
          />
        ))}
    </g>
    <SelectionRect selectionBox={props.selectionBox} />
  </svg>
);

const isSelected = (props: Props, id: number) =>
  props.selectedContours.includes(id) || props.selectedContour === id;

export default ContourSvgLayers;
