import { CreateAreaRequest } from "../../../../types/api/event";
import { Contour } from "../../../../types/components/common";

export const buildAreaRequest = (
  contours: Contour[],
  eventId: string
): CreateAreaRequest => ({
  event_id: eventId,
  areas: contours
    .filter((contour) => contour.type === "area")
    .map((area) => ({
      price: area.price,
      label: area.label,
      svg: document.querySelector(`g[id="${area.id}"]`)?.outerHTML,
      seats: contours
        .filter((seat) => seat.type === "seat" && seat.area_id === area.id)
        .map((seat) => ({
          cx: seat.cx!,
          cy: seat.cy!,
          number: seat.number!,
          row: seat.row!,
        })),
    })),
});

export const createEventSvgPayload = () => {
  const svg = document.querySelector("svg");
  if (!svg) return null;

  const clone = svg.cloneNode(true) as SVGElement;
  clone.querySelectorAll("g.seats, g.areas").forEach((group) => group.remove());
  return { svgString: clone.outerHTML };
};

export const validateContours = (contours: Contour[]) => {
  if (contours.some((contour) => contour.type === "contour")) {
    return "아직 미지정 좌석이 있습니다";
  }
  if (contours.some((contour) => contour.type === "seat" && !contour.area_id)) {
    return "구역 설정이 안된 좌석이 있습니다";
  }
  return "";
};
