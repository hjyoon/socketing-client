import { useContext, useState } from "react";
import MainLayout from "../layout/MainLayout";
import { createResourceQuery } from "../../hooks/useCustomQuery";
import { fetchErrorMessages } from "../../constants/errorMessages";
import { getAllOrder } from "../../api/orders/ordersApi";
import { GetAllOrderResponse } from "../../types/api/order";
import { UserContext } from "../../store/UserContext";
import MyProfile from "../organisms/Form/MyProfile";
import MyMoney from "../organisms/Form/MyMoney";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";
import UserPageMenu from "./my-page-user/UserPageMenu";
import UserPageTabs from "./my-page-user/UserPageTabs";
import UserReservationList from "./my-page-user/UserReservationList";
import { UserSection, UserTab } from "./my-page-user/userPageTypes";

const MyPageUser = () => {
  const [section, setSection] = useState<UserSection>("my-tickets");
  const [activeTab, setActiveTab] = useState<UserTab>("upcoming");
  const { userId } = useContext(UserContext);
  const useOrders = createResourceQuery<GetAllOrderResponse>(
    `my-orders-${userId}`,
    (eventId) => getAllOrder(eventId)
  );
  const { data, isLoading, isError } = useOrders("");

  if (isLoading) return <LoadingPage />;
  if (isError) return <ErrorPage errorMessage={fetchErrorMessages.general} />;
  if (!data?.data)
    return <ErrorPage errorMessage={fetchErrorMessages.noReservationData} />;

  const now = new Date();
  const orders = data.data;
  const past = orders.filter(
    (order) => new Date(order.eventDate) < now && order.orderCanceledAt === null
  );
  const upcoming = orders.filter(
    (order) =>
      new Date(order.eventDate) >= now && order.orderCanceledAt === null
  );
  const canceled = orders.filter((order) => order.orderCanceledAt !== null);

  const renderContent = () => {
    if (section === "my-profile") {
      if (activeTab === "profile") return <MyProfile />;
      if (activeTab === "money") return <MyMoney />;
      return null;
    }
    if (activeTab === "past")
      return (
        <UserReservationList
          events={past}
          emptyMessage="지난 공연 예매 기록이 없습니다."
        />
      );
    if (activeTab === "cancel")
      return (
        <UserReservationList
          events={canceled}
          emptyMessage="취소된 티켓이 없습니다."
        />
      );
    return (
      <UserReservationList
        events={upcoming}
        emptyMessage="예정된 공연 예매 티켓이 없습니다."
      />
    );
  };

  return (
    <MainLayout>
      <div className="w-300 flex h-full">
        <UserPageMenu
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setSection={setSection}
        />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto p-8">
            <h1 className="hidden lg:inline-block text-2xl font-bold uppercase text-gray-800 mb-3">
              {section === "my-profile" ? "My Profile" : "My Tickets"}
            </h1>
            <UserPageTabs
              activeTab={activeTab}
              section={section}
              setActiveTab={setActiveTab}
              setSection={setSection}
            />
            <div className="flex flex-col px-3 md:px-5 h-[calc(100vh-259px)] overflow-y-auto">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
};

export default MyPageUser;
