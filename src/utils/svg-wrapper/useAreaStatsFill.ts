import { useEffect } from "react";
import { ReservedSeatsStatisticResponse } from "../../types/api/socket";

export const useAreaStatsFill = (
  areaStats: ReservedSeatsStatisticResponse[]
) => {
  useEffect(() => {
    areaStats.forEach((stat) => {
      const areaElement = document.querySelector(
        `.areas [class='${stat.areaId}'] .area-data`
      );
      if (!areaElement) return;

      const ratio = stat.reservedSeatsNum / stat.totalSeatsNum;
      (areaElement as SVGPathElement).setAttribute(
        "fill",
        interpolateColor(ratio)
      );
    });
  }, [areaStats]);
};

const interpolateColor = (ratio: number) => {
  if (ratio < 0.25) return "rgba(8, 79, 206, 0.983)";
  if (ratio < 0.5) return "rgba(66, 125, 224, 0.98)";
  if (ratio < 0.75) return "rgba(132, 162, 229, 0.991)";
  if (ratio < 1) return "rgba(157, 170, 206, 0.98)";
  return "#808080";
};
