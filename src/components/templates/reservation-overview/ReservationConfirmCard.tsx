import Font from "../../atoms/fonts/Font";
import { UpdatedPayment } from "../../../types/api/payment";
import { formatToKoreanDateAndTime } from "../../../utils/dateUtils";

const ReservationConfirmCard = ({ data }: { data: UpdatedPayment }) => {
  const userEmail = data.userEmail ?? "";

  return (
    <div className="bg-white rounded-md shadow-lg overflow-hidden">
      <div className="h-36 md:h-[180px]">
        <div className="w-full h-full flex space-x-5 bg-rose-100 p-3 md:p-4 rounded-t-lg">
          <img
            src={data.eventThumbnail}
            alt={data.eventTitle}
            className="hidden md:block max-w-32 h-full object-cover rounded"
          />
          <div className="flex flex-col justify-end">
            <p className="text-gray-800 text-xl md:text-3xl font-bold mb-2">
              {data.eventTitle}
            </p>
            <Font className="text-gray-700 font-bold mb-1 md:my-2 text-lg md:text-xl">
              {data.eventCast}
            </Font>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <UserInfo email={userEmail} />
        <div className="space-y-4">
          <InfoRow
            icon="📅"
            label="일시"
            value={formatToKoreanDateAndTime(data.eventDate)}
          />
          <InfoRow icon="📍" label="장소" value={data.eventPlace} />
          <SeatRow data={data} />
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <Font className="text-sm text-gray-500 text-center block">
            공연 당일 예매내역을 확인할 수 있는 신분증을 지참해주세요.
          </Font>
        </div>
      </div>
    </div>
  );
};

const UserInfo = ({ email }: { email: string }) => (
  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
      <span className="font-bold">{email.slice(0, 1)}</span>
    </div>
    <Font className="font-bold text-gray-800">{email.slice(0, 3)}</Font>
  </div>
);

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) => (
  <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition">
    <div className="w-6 text-gray-400">{icon}</div>
    <div>
      <Font className="font-bold text-gray-700 mb-1">{label}</Font>
      <Font className="text-gray-600">{value}</Font>
    </div>
  </div>
);

const SeatRow = ({ data }: { data: UpdatedPayment }) => (
  <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition">
    <div className="w-6 text-gray-400">🎫</div>
    <div>
      <Font className="font-bold text-gray-700 mb-1">좌석</Font>
      <Font className="text-gray-600">
        {data.reservations.map((reservation, index) => (
          <div key={reservation.seatId || index} className="mb-1">
            {reservation.seatAreaLabel}구역 {reservation.seatRow}열{" "}
            {reservation.seatNumber}번
          </div>
        ))}
      </Font>
    </div>
  </div>
);

export default ReservationConfirmCard;
