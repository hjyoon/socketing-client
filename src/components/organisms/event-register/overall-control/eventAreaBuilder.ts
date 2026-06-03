import { calculateBoundingBox, createOutlinePath } from "../../../../utils/svg";
import { Contour } from "../../../../types/components/common";

export const buildAreaFromSeats = (
  contours: Contour[],
  selectedContours: number[],
  label: string,
  price: number
) => {
  const seats = contours.filter(
    (contour) =>
      contour.type === "seat" && selectedContours.includes(contour.id)
  );
  if (seats.length === 0) return null;

  const area = createArea(contours, seats, label, price);
  const numberedSeats = numberSeats(seats, area.id);
  const otherContours = contours.filter(
    (contour) => !selectedContours.includes(contour.id)
  );
  return [...otherContours, ...numberedSeats, area];
};

export const convertContourToSeat = (contour: Contour): Contour => {
  if (contour.type !== "contour") return contour;
  const xs = contour.points.map((point) => point.x);
  const ys = contour.points.map((point) => point.y);
  return {
    ...contour,
    cx: Math.round((Math.max(...xs) + Math.min(...xs)) / 2),
    cy: Math.round((Math.max(...ys) + Math.min(...ys)) / 2),
    label: "",
    number: 0,
    r: Math.min(contour.boundingBox.width, contour.boundingBox.height) / 2,
    row: 0,
    type: "seat",
  };
};

const createArea = (
  contours: Contour[],
  seats: Contour[],
  label: string,
  price: number
): Contour => {
  const points = seats.flatMap((seat) => seat.points);
  return {
    boundingBox: calculateBoundingBox(points),
    center: {
      x: seats.reduce((sum, seat) => sum + (seat.cx || 0), 0) / seats.length,
      y: seats.reduce((sum, seat) => sum + (seat.cy || 0), 0) / seats.length,
    },
    id: Math.max(...contours.map((contour) => contour.id)) + 1,
    label,
    path: createOutlinePath(seats, 20),
    points,
    price,
    type: "area",
  };
};

const numberSeats = (seats: Contour[], areaId: number) =>
  groupRows(seats).flatMap((rowSeats, rowIndex) =>
    [...rowSeats]
      .sort((a, b) => (a.cx || 0) - (b.cx || 0))
      .map((seat, seatIndex) => ({
        ...seat,
        area_id: areaId,
        label: `${rowIndex + 1}-${seatIndex + 1}`,
        number: seatIndex + 1,
        row: rowIndex + 1,
      }))
  );

const groupRows = (seats: Contour[]) => {
  const rows: Contour[][] = [];
  [...seats]
    .sort((a, b) => (a.cy || 0) - (b.cy || 0))
    .forEach((seat) => {
      const lastRow = rows[rows.length - 1];
      if (!lastRow || Math.abs((seat.cy || 0) - (lastRow[0].cy || 0)) > 1)
        rows.push([seat]);
      else lastRow.push(seat);
    });
  return rows;
};
