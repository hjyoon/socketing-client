import MySeatContainer from "../../organisms/seat-container/MySeatContainer";
import { Event } from "../../../types/api/event";
import { OrderSeat } from "../../../types/api/order";
import { formatToKoreanDateAndTime } from "../../../utils/dateUtils";

const stages = ["대기열 진입", "입장"];

interface Props {
  event: Event;
  myPosition: number | null;
  progress: number;
  seatData: OrderSeat[];
  selectedSeatIds: string[];
  totalWaiting: number | null;
}

const WaitingRoomView = (props: Props) => (
  <div className="min-h-screen bg-black text-white flex flex-col items-center">
    <EventHero event={props.event} />
    <div className="relative w-full max-w-4xl p-6">
      <Progress progress={props.progress} />
      <QueueStatus
        myPosition={props.myPosition}
        progress={props.progress}
        totalWaiting={props.totalWaiting}
      />
      <div className="mt-2 px-8 flex flex-col items-center">
        <h2 className="text-xl font-bold text-center my-3">
          실시간 좌석 예매 현황
        </h2>
        <div className="bg-black rounded-lg shadow-lg md:w-[45vw] md:h-[45vh] flex justify-center">
          <MySeatContainer
            svg={props.event.svg ?? ""}
            seats={props.seatData}
            selectedSeatIds={props.selectedSeatIds}
            reservedByMe={false}
          />
        </div>
      </div>
    </div>
  </div>
);

const EventHero = ({ event }: { event: Event }) => (
  <div className="relative w-full h-36">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `url(${event.thumbnail})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: "0.5",
      }}
    />
    <div className="absolute inset-0 flex items-center bg-black/40">
      <div className="flex items-center px-10 md:px-28 max-w-4xl">
        <img
          src={event.thumbnail}
          alt="공연 포스터"
          className="hidden md:block w-24 h-32 object-contain rounded-lg shadow-md mr-4"
        />
        <div className="text-white">
          <h1 className="text-2xl font-bold">{event.title}</h1>
          <p className="text-sm mt-3">
            {formatToKoreanDateAndTime(event.eventDates[0].date)}
          </p>
          <p className="text-sm mt-1">장소: {event.place}</p>
        </div>
      </div>
    </div>
  </div>
);

const Progress = ({ progress }: { progress: number }) => (
  <div>
    <div className="flex justify-between text-sm">
      {stages.map((stage) => (
        <div key={stage} className="text-center text-rose-400 font-semibold">
          {stage}
        </div>
      ))}
    </div>
    <div className="relative mt-4 h-2 bg-gray-700 rounded">
      <div
        className="absolute h-2 bg-rose-400 rounded transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);

const QueueStatus = ({
  myPosition,
  progress,
  totalWaiting,
}: Pick<Props, "myPosition" | "progress" | "totalWaiting">) => (
  <div className="flex flex-col items-center justify-center">
    <p className="mt-2 px-5 md:text-lg text-center whitespace-pre-line">
      {progress < 90 ? "현재 입장 대기 중입니다." : "곧 입장이 시작됩니다!"}
    </p>
    {myPosition ? (
      <h2 className="mt-4 text-2xl font-bold">현재 순서: {myPosition} 번</h2>
    ) : (
      <div className="h-6" />
    )}
    {totalWaiting && (
      <p className="mt-2 text-rose-400 text-xl font-bold">
        총 {totalWaiting}명이 대기 중입니다.
      </p>
    )}
  </div>
);

export default WaitingRoomView;
