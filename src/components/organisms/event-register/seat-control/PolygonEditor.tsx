import { Contour } from "../../../../types/components/common";

interface Props {
  polygon: Contour;
  updateContourLabel: (id: number, label: string) => void;
}

const PolygonEditor = ({ polygon, updateContourLabel }: Props) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      시설 이름
    </label>
    <input
      type="text"
      value={polygon.label || ""}
      onChange={(event) => updateContourLabel(polygon.id, event.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      placeholder="시설 이름 입력"
    />
  </div>
);

export default PolygonEditor;
