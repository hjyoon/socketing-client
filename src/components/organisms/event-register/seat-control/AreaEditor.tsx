import { Dispatch, SetStateAction } from "react";
import Button from "../../../atoms/buttons/Button";
import { Contour } from "../../../../types/components/common";

interface Props {
  area: Contour;
  areaLabel: string;
  areaPrice: number;
  setAreaLabel: (value: string) => void;
  setAreaPrice: (value: number) => void;
  setContours: Dispatch<SetStateAction<Contour[]>>;
  setSelectedContour: (id: number | null) => void;
}

const AreaEditor = ({
  area,
  areaLabel,
  areaPrice,
  setAreaLabel,
  setAreaPrice,
  setContours,
  setSelectedContour,
}: Props) => (
  <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 space-y-4">
    <div className="space-y-3">
      <AreaInput
        label="구역 이름 수정"
        value={areaLabel}
        onChange={setAreaLabel}
      />
      <AreaInput
        label="구역 좌석 가격 수정"
        type="number"
        value={areaPrice}
        onChange={(value) => setAreaPrice(Number(value))}
      />
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => updateArea(area, areaLabel, areaPrice, setContours)}
          size="sm"
          variant="dark"
          disabled={!areaLabel || areaPrice <= 0}
        >
          구역 정보 수정
        </Button>
        <Button
          onClick={() => deleteArea(area.id, setContours, setSelectedContour)}
          size="sm"
          className="bg-rose-500"
        >
          구역 삭제
        </Button>
      </div>
    </div>
    <div className="pt-4 border-t border-gray-200">
      <p className="text-sm text-gray-600">
        * 구역 정보를 수정하면 해당 구역의 모든 좌석 가격이 업데이트됩니다.
      </p>
      <p className="text-sm text-red-600 mt-1">
        * 구역을 삭제하면 해당 구역의 모든 좌석이 미지정 상태가 됩니다.
      </p>
    </div>
  </div>
);

const AreaInput = ({
  label,
  onChange,
  type = "text",
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  type?: string;
  value: number | string;
}) => (
  <>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </>
);

const updateArea = (
  area: Contour,
  label: string,
  price: number,
  setContours: Dispatch<SetStateAction<Contour[]>>
) =>
  setContours((prev) =>
    prev.map((contour) =>
      contour.id === area.id
        ? { ...contour, label, price }
        : contour.type === "seat" && contour.area_id === area.id
          ? { ...contour, price }
          : contour
    )
  );

const deleteArea = (
  areaId: number,
  setContours: Dispatch<SetStateAction<Contour[]>>,
  setSelectedContour: (id: number | null) => void
) => {
  setContours(
    (prev) =>
      prev
        .map((contour) =>
          contour.id === areaId ? null : resetSeatArea(contour, areaId)
        )
        .filter(Boolean) as Contour[]
  );
  setSelectedContour(null);
};

const resetSeatArea = (contour: Contour, areaId: number) =>
  contour.type === "seat" && contour.area_id === areaId
    ? {
        ...contour,
        area_id: undefined,
        label: "",
        number: undefined,
        price: undefined,
        row: undefined,
      }
    : contour;

export default AreaEditor;
