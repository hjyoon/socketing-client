import { fetchErrorMessages } from "../../../constants/errorMessages";
import { UpdatedPayment } from "../../../types/api/payment";
import ReservationConfirmCard from "./ReservationConfirmCard";

interface ReservationConfirmProps {
  data: UpdatedPayment;
}

const ReservationConfirmationTemplate = ({ data }: ReservationConfirmProps) => {
  if (!data || !Array.isArray(data.reservations)) {
    return <div>{fetchErrorMessages.noReservationData}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto md:p-10">
      <ReservationConfirmCard data={data} />
    </div>
  );
};

export default ReservationConfirmationTemplate;
