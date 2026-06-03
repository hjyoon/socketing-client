import { Contour } from "../../../../types/components/common";

interface Props {
  contour: Contour;
  updateContourType: (
    id: number,
    type: Exclude<Contour["type"], "contour">
  ) => void;
}

const ContourActions = ({ contour, updateContourType }: Props) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
    <button
      onClick={() => updateContourType(contour.id, "polygon")}
      className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
    >
      부대시설로 지정
    </button>
  </div>
);

export default ContourActions;
