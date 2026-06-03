interface Props {
  scale: number;
  setScale: (updater: (scale: number) => number) => void;
  reset: () => void;
  className?: string;
  hiddenOnMobile?: boolean;
  positionClass?: string;
}

const ZoomControls = ({
  scale,
  setScale,
  reset,
  className = "",
  hiddenOnMobile = true,
  positionClass = "bottom-11",
}: Props) => (
  <div
    className={`${hiddenOnMobile ? "hidden md:flex" : "flex"} absolute ${positionClass} left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 gap-2 ${className}`}
  >
    <button
      onClick={() => setScale(() => Math.min(scale + 0.2, 3))}
      className="px-3 py-1 border rounded-lg hover:bg-gray-100"
    >
      +
    </button>
    <button
      onClick={reset}
      className="px-2 py-1 border rounded-lg hover:bg-gray-100 text-sm"
    >
      Reset
    </button>
    <button
      onClick={() => setScale(() => Math.max(scale - 0.2, 0.5))}
      className="px-3 py-1 border rounded-lg hover:bg-gray-100"
    >
      -
    </button>
  </div>
);

export default ZoomControls;
