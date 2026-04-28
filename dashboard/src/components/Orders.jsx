import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import {
  deleteOrder,
  fetchAllOrders,
  updateOrderStatus,
} from "../store/slices/orderSlice";

const Orders = () => {
  const statusArray = [
    "All",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [filterByStatus, setFilterByStatus] = useState("All");
  const [previewImage, setPreviewImage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId, newStatus) => {
    setSelectedStatus(newStatus);
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };

  const filteredOrders =
    filterByStatus === "All"
      ? orders
      : orders?.filter((order) => order.order_status === filterByStatus);

  const confirmDelete = () => {
    dispatch(deleteOrder(deleteConfirm.id));
    setDeleteConfirm({ open: false, id: null });
  };

  if (loading)
    return (
      <p className="p-[10px] pl-[10px] md:pl-[17rem] w-full">
        Loading orders...
      </p>
    );

  return (
    <>
      <main className="p-[10px] pl-[10px] md:pl-[17rem] w-full">
        {/* Header */}
        <div className="flex-1 md:p-6">
          <Header />
          <h1 className="text-2xl font-bold">All orders</h1>
          <p className="text-sm text-gray-600">Manage all you orders.</p>
        </div>
        {/* Content */}

        {orders.length === 0 ? (
          <div className="flex-1 md:p-6">
            <p className="text-2xl font-bold">order not found</p>
          </div>
        ) : (
          <>
            {loading ? (
              <div
                className={`size-40 mx-auto border-2 border-white border-t-transparent 
            rounded-full animate-spin`}
              />
            ) : (
              <>
                <div className="flex justify-between items-center p-6">
                  <select
                    className="p-2 border rounded shadow-sm"
                    onChange={(e) => setFilterByStatus(e.target.value)}
                  >
                    {statusArray.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </>
  );
};

export default Orders;
