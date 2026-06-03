import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  createNewArea,
  createNewEvent,
} from "../../../../api/events/eventsApi";
import {
  postEventErrorMessages,
  postSeatErrorMessages,
} from "../../../../constants/errorMessages";
import { usePostMutation } from "../../../../hooks/usePostMutation";
import { useEventCreate } from "../../../../store/EventCreateContext";
import { ApiErrorResponse } from "../../../../types/api/common";
import {
  CreateAreaRequest,
  NewAreasResponse,
  NewEvent,
  NewEventResponse,
} from "../../../../types/api/event";
import {
  buildAreaRequest,
  createEventSvgPayload,
  validateContours,
} from "./eventRegisterPayload";

export const useEventRegisterSubmit = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    contours,
    setEvent,
    setImageUrl,
    setSelectedContour,
    setSelectedContours,
  } = useEventCreate();

  const createAreaMutation = usePostMutation<
    NewAreasResponse,
    AxiosError<ApiErrorResponse>,
    CreateAreaRequest
  >(createNewArea, {
    onSuccess: () => {
      toast.success("공연과 좌석이 성공적으로 등록되었습니다.");
      void navigate("/");
    },
    onError: (error) =>
      toast.error(getSeatErrorMessage(error.response?.data?.code)),
  });

  const createEventMutation = usePostMutation<
    NewEventResponse,
    AxiosError<ApiErrorResponse>,
    NewEvent
  >(createNewEvent, {
    onSuccess: async (response) => {
      if (response.data) {
        setEvent(response.data);
        createAreaMutation.mutate(buildAreaRequest(contours, response.data.id));
      }
      await queryClient.invalidateQueries({
        queryKey: ["created-events-by-manager"],
      });
    },
    onError: (error) =>
      toast.error(
        error.response?.data.code === 8
          ? postEventErrorMessages.invalidToken
          : postEventErrorMessages.general
      ),
  });

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageUrl(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.onload = (loadEvent) => onChange(loadEvent.target?.result as string);
    reader.readAsText(file);
  };

  const onSubmit = (data: NewEvent) => {
    const validationMessage = validateContours(contours);
    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }
    const svgData = createEventSvgPayload();
    if (!svgData) {
      toast.error("SVG 데이터를 찾을 수 없습니다.");
      return;
    }
    createEventMutation.mutate({ ...data, svg: JSON.stringify(svgData) });
  };

  return {
    clearSelection: () => {
      setSelectedContour(null);
      setSelectedContours([]);
    },
    handleImageUpload,
    onSubmit,
  };
};

const getSeatErrorMessage = (code?: number) => {
  if (code === 8) return postSeatErrorMessages.invalidToken;
  if (code === 5) return postSeatErrorMessages.validation;
  if (code === 9) return postSeatErrorMessages.inValidevent;
  if (code === 10) return postSeatErrorMessages.duplicatesSeat;
  return postSeatErrorMessages.general;
};
