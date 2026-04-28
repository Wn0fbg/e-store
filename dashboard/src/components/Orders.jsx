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
            <p className="text-2xl font-bold">No orders found.</p>
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

                {filteredOrders.map((order) => {
                  return (
                    <div
                      key={order.id}
                      className="bg-white shadow-lg rounded-lg p-6 mb-6 transition-all"
                    >
                      <div className="flex justify-between items-center flex-wrap gap-4">
                        <div>
                          <p>
                            <strong>Order id: </strong> {order.id}
                          </p>
                          <p>
                            <strong>Status: </strong> {order.order_status}
                          </p>
                          <p>
                            <strong>Placed at: </strong>{" "}
                            {new Date(order.created_at).toLocaleString()}
                          </p>
                          <p>
                            <strong>Total amount:</strong> $ {order.total_price}
                          </p>
                        </div>

                        <div>
                          <select
                            value={
                              selectedStatus[order.id] || order.order_status
                            }
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value)
                            }
                            className="border p-2 rounded mb-2"
                          >
                            {statusArray.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() =>
                              setDeleteConfirm({ open: true, id: order.id })
                            }
                            className="ml-3 bg-red-500 hover:bg-red-600 text-white rounded px-3 py-1"
                          >
                            Delete order
                          </button>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="font-semibold text-lg mb-1">
                          Shipping info
                        </h4>
                        <p>
                          <strong>Name: </strong>
                          {order.shipping_info?.full_name}
                        </p>
                        <p>
                          <strong>Phone:</strong> {order.shipping_info?.phone}
                        </p>
                        <p>
                          <strong>Address: </strong>
                          {order.shipping_info?.address},
                          {order.shipping_info?.city},
                          {order.shipping_info?.state},
                          {order.shipping_info?.pincode}
                        </p>
                      </div>

                      <div className="mt-4">
                        <h4 className="font-semibold text-lg mb-2">
                          Ordered items
                        </h4>
                        {Array.isArray(order.order_items) &&
                          order.order_items.map((item) => {
                            return (
                              <div
                                key={item.order_id}
                                className="flex items-center gap-4 mb-2 border-b pb-2"
                              >
                                {item.image && (
                                  <img
                                    src={item.image || item.name}
                                    alt={order.title}
                                    className="size-16 object-cover cursor-pointer"
                                    onClick={() => setPreviewImage(item.image)}
                                  />
                                )}
                                <div>
                                  <p className="font-semibold">{item.title}</p>
                                  <p>
                                    <strong>Quantity: </strong>
                                    {item.quantity} | <strong>Price: </strong>
                                    {item.price} |{" "}
                                    <strong>Total price: </strong>
                                    {item.quantity * item.price}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* Image preview */}
            {previewImage && (
              <div
                className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
                onClick={() => setPreviewImage(null)}
              >
                <img
                  src={previewImage}
                  alt="preview"
                  className="max-w-[90%] max-h-[90%] rounded shadow-xl"
                />
              </div>
            )}

            {/* Delete order confirmation modal */}
            {deleteConfirm.open && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm w-full">
                  <h3 className="text-lg font-semibold mb-4">
                    Are you sure wont to delete this order?
                  </h3>
                  <div className="flex justify-self-center gap-4">
                    <button
                      onClick={confirmDelete}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={() =>
                        setDeleteConfirm({ open: false, id: null })
                      }
                      className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
};

export default Orders;
