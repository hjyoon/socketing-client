import { useManagerContext } from "../../../store/ManagerContext";
import { usePanZoom } from "../../../hooks/usePanZoom";
import { Seat } from "../../../types/api/managers";
import {
  ManagerSeatObj,
  SelectedManagerSeatObj,
} from "../../atoms/seats/ManagerSeatObj";
import ManagerSvgWrapper from "../../../utils/ManagerSvgWrapper";
import ZoomControls from "../../molecules/seat/ZoomControls";

const ManagerSeatContainer = () => {
  const { seats } = useManagerContext();
  const pan = usePanZoom();

  const renderSeat = (seatData: Seat) => {
    const selected = seats.find(
      (seat) =>
        seatData.reservations?.length > 0 &&
        seat.reservations.some(
          (reservation) => reservation.id === seatData.reservations[0].id
        )
    );
    const userId = selected?.reservations[0]?.order?.user.id || "";
    return selected ? (
      <SelectedManagerSeatObj user_id={userId} seatData={seatData} />
    ) : (
      <ManagerSeatObj />
    );
  };

  return (
    <div className="relative h-full">
      <div
        ref={pan.containerRef}
        className="relative flex-1 overflow-hidden bg-gray-50"
        style={{ height: "100%", touchAction: "none" }}
        onMouseDown={pan.handleMouseDown}
        onTouchStart={pan.handleTouchStart}
        onTouchMove={pan.handleTouchMove}
        onTouchEnd={pan.handleTouchEnd}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${pan.translate.x}px, ${pan.translate.y}px) scale(${pan.scale})`,
            transformOrigin: "center",
            transition: pan.isDragging ? "none" : "transform 0.1s ease-out",
          }}
        >
          <ManagerSvgWrapper renderSeat={renderSeat} />
        </div>
      </div>

      <ZoomControls
        scale={pan.scale}
        setScale={pan.setScale}
        reset={pan.reset}
      />
    </div>
  );
};

export default ManagerSeatContainer;
