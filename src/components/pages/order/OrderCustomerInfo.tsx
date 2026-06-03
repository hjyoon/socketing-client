const OrderCustomerInfo = () => {
  const storedName = localStorage.getItem("name");

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">주문자 정보</h2>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">{storedName}@jungle.com</p>
      </div>
    </div>
  );
};

export default OrderCustomerInfo;
