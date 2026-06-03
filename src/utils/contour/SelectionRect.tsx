import { Point } from "../../types/components/common";

interface Props {
  selectionBox?: { start: Point; end: Point } | null;
}

const SelectionRect = ({ selectionBox }: Props) => {
  if (!selectionBox) return null;

  return (
    <rect
      x={Math.min(selectionBox.start.x, selectionBox.end.x)}
      y={Math.min(selectionBox.start.y, selectionBox.end.y)}
      width={Math.abs(selectionBox.end.x - selectionBox.start.x)}
      height={Math.abs(selectionBox.end.y - selectionBox.start.y)}
      fill="rgba(0, 0, 255, 0.1)"
      stroke="blue"
      strokeWidth="1"
      className="pointer-events-none"
    />
  );
};

export default SelectionRect;
