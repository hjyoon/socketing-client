import React, { useEffect, useState } from "react";
import { useEventCreate } from "../../../store/EventCreateContext";
import AreaEditor from "./seat-control/AreaEditor";
import ContourActions from "./seat-control/ContourActions";
import PolygonEditor from "./seat-control/PolygonEditor";
import SeatInfoPanel from "./seat-control/SeatInfoPanel";

const typeToKorean = {
  area: "구역",
  contour: "미지정",
  polygon: "부대시설",
  seat: "좌석",
};

const SeatControlPanel: React.FC = () => {
  const state = useEventCreate();
  const selected =
    state.selectedContour !== null
      ? state.contours.find((contour) => contour.id === state.selectedContour)
      : null;
  const [areaLabel, setAreaLabel] = useState("");
  const [areaPrice, setAreaPrice] = useState(0);

  useEffect(() => {
    if (selected?.type === "area") {
      setAreaLabel(selected.label || "");
      setAreaPrice(selected.price || 0);
    }
  }, [selected]);

  if (!selected) {
    return (
      <div className="h-full p-6">
        <p className="text-gray-500 text-center">선택된 요소가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="h-full p-3 space-y-3 overflow-auto bg-gray-50">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-md font-semibold text-gray-800">
          현재 타입: {typeToKorean[selected.type]}
        </h3>
      </div>
      {selected.type === "contour" && (
        <ContourActions
          contour={selected}
          updateContourType={state.updateContourType}
        />
      )}
      {selected.type === "area" && (
        <AreaEditor
          area={selected}
          areaLabel={areaLabel}
          areaPrice={areaPrice}
          setAreaLabel={setAreaLabel}
          setAreaPrice={setAreaPrice}
          setContours={state.setContours}
          setSelectedContour={state.setSelectedContour}
        />
      )}
      {selected.type === "seat" && <SeatInfoPanel seat={selected} />}
      {selected.type === "polygon" && (
        <PolygonEditor
          polygon={selected}
          updateContourLabel={state.updateContourLabel}
        />
      )}
    </div>
  );
};

export default SeatControlPanel;
