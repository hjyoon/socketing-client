const items = [
  ["#FFF", "예매 가능"],
  ["#9CA3AF", "예매 완료"],
  ["#F66687", "내가 선택"],
  ["#FBBF24", "다른 사람이 선택"],
];

const SeatLegend = () => (
  <div className="absolute top-10 right-0 bg-white rounded-lg shadow-lg p-4 flex flex-col text-sm space-y-2 opacity-90">
    {items.map(([color, label]) => (
      <div className="flex items-center space-x-3" key={label}>
        <div
          className="w-5 h-5 rounded-full border border-gray-400"
          style={{ background: color }}
        />
        <span className="text-gray-600 font-bold">{label}</span>
      </div>
    ))}
  </div>
);

export default SeatLegend;
