import { fetchErrorMessages } from "../../constants/errorMessages";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";
import WaitingRoomView from "./waiting/WaitingRoomView";
import { useWaitingRoom } from "./waiting/useWaitingRoom";

const WaitingRoomPage = () => {
  const state = useWaitingRoom();

  if (state.eventLoading || state.seatLoading || !state.isConnected)
    return <LoadingPage />;
  if (state.eventError || state.seatError)
    return <ErrorPage errorMessage={fetchErrorMessages.general} />;
  if (!state.eventData?.data)
    return <ErrorPage errorMessage={fetchErrorMessages.noEventData} />;
  if (!state.eventData.data.svg)
    return <ErrorPage errorMessage={fetchErrorMessages.noSvgData} />;
  if (!state.seatData?.data)
    return <ErrorPage errorMessage={fetchErrorMessages.noSeatsData} />;

  return (
    <WaitingRoomView
      event={state.eventData.data}
      myPosition={state.myPosition}
      progress={state.progress}
      seatData={state.seatData.data}
      selectedSeatIds={state.selectedSeatIds}
      totalWaiting={state.totalWaiting}
    />
  );
};

export default WaitingRoomPage;
