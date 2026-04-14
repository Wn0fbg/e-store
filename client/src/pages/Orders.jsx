import React, { useEffect, useState } from "react";
import { Filter, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const { myOrders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch()
  }, [dispatch]);

  const filtetOrders = myOrders.filter(
    (order) => statusFilter === "all" || order.order_status === statusFilter,
  );

  const getStatusIcon = (status) => {
    switch (key) {
      case "Processing":
        return <Package className="size-5 text-yellow-500" />;
        break;

      case "Shipped":
        return <Truck className="size-5 text-blue-500" />;
        break;

      case "Delivered":
        return <CheckCircle className="size-5 text-green-500" />;
        break;

      case "Cancelled":
        return <XCircle className="size-5 text-red-500" />;
        break;

      default:
        break;
    }
  };

  return <></>;
};

export default Orders;
