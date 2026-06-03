import { Contour } from "../../../../types/components/common";

const SeatInfoPanel = ({ seat }: { seat: Contour }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
    {seat.area_id ? (
      <>
        <Info label={`구역 정보 - ${seat.area_id}`} />
        <Info label={`가격 - ${seat.price}`} />
        <Info label={`열 번호 - ${seat.row}`} />
        <Info label={`좌석 번호 - ${seat.number}`} />
      </>
    ) : (
      <div className="text-red-500 text-center py-4">
        구역 설정이 안된 좌석입니다, 구역 설정 먼저해주세요
      </div>
    )}
  </div>
);

const Info = ({ label }: { label: string }) => (
  <label className="block text-sm font-medium text-gray-700 mb-1">
    {label}
  </label>
);

export default SeatInfoPanel;
