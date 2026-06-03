import React, { useState } from "react";
import { useEventCreate } from "../../../store/EventCreateContext";
import Button from "../../atoms/buttons/Button";
import AreaCreateForm from "./overall-control/AreaCreateForm";
import {
  buildAreaFromSeats,
  convertContourToSeat,
} from "./overall-control/eventAreaBuilder";

const OverallControlPanel: React.FC = () => {
  const state = useEventCreate();
  const [areaLabel, setAreaLabel] = useState("");
  const [areaPrice, setAreaPrice] = useState(50000);

  const createAreaFromSelectedSeats = () => {
    if (!areaLabel || state.selectedContours.length === 0) return;
    const next = buildAreaFromSeats(
      state.contours,
      state.selectedContours,
      areaLabel,
      areaPrice
    );
    if (next) state.setContours(next);
  };

  const convertAllToSeats = () => {
    state.setContours((prev) => prev.map(convertContourToSeat));
    state.setIsImageVisible(false);
  };

  return (
    <div className="h-full p-6 space-y-4 overflow-auto">
      <Button className="w-full" onClick={convertAllToSeats}>
        전체 좌석 생성
      </Button>
      <Button
        className={`w-full ${state.editMode ? "bg-black text-white" : "bg-gray-300"}`}
        variant={state.editMode ? "dark" : "secondary"}
        onClick={() => {
          state.setEditMode(!state.editMode);
          state.setSelectedContours([]);
        }}
      >
        드래그 모드 (shift 키)
      </Button>
      {state.selectedContours.length > 0 && (
        <AreaCreateForm
          areaLabel={areaLabel}
          areaPrice={areaPrice}
          createArea={() => {
            createAreaFromSelectedSeats();
            setAreaLabel("");
            setAreaPrice(50000);
          }}
          setAreaLabel={setAreaLabel}
          setAreaPrice={setAreaPrice}
        />
      )}
    </div>
  );
};

export default OverallControlPanel;
