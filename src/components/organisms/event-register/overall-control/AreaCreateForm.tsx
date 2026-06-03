import Button from "../../../atoms/buttons/Button";

interface Props {
  areaLabel: string;
  areaPrice: number;
  createArea: () => void;
  setAreaLabel: (value: string) => void;
  setAreaPrice: (value: number) => void;
}

const AreaCreateForm = ({
  areaLabel,
  areaPrice,
  createArea,
  setAreaLabel,
  setAreaPrice,
}: Props) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <label className="block text-sm font-medium">구역 이름</label>
      <input
        type="text"
        value={areaLabel}
        onChange={(event) => setAreaLabel(event.target.value)}
        className="w-full px-3 py-2 border rounded-md"
        placeholder="구역 이름을 입력하세요"
      />
      <label className="block text-sm font-medium">구역 좌석 가격</label>
      <input
        type="number"
        value={areaPrice}
        onChange={(event) => setAreaPrice(Number(event.target.value))}
        className="w-full px-3 py-2 border rounded-md"
        placeholder="구역 가격을 입력하세요"
      />
      <Button
        onClick={createArea}
        variant="dark"
        disabled={!areaLabel || !areaPrice}
        size="sm"
        className="w-full"
      >
        구역 생성
      </Button>
    </div>
  </div>
);

export default AreaCreateForm;
