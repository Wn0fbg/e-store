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
    switch (status) {
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
        return <Package className="size-5  text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-500/20 text-yellow-400";
        break;

      case "Shipped":
        return "bg-blue-500/20 text-blue-400";
        break;

      case "Delivered":
        return "bg-green-500/20 text-green-400";
        break;

      case "Cancelled":
        return "bg-red-500/20 text-red-400";
        break;

      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const { authUser } = useSelector((state) => state.auth);
  const navigateTo = useNavigate();

  if (!authUser) return navigateTo("/products");

  return (
    <>
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              My orders
            </h1>
            <p className="text-muted-foreground">
              Track and manage your orders history.
            </p>
          </div>

          {/* Status Filter */}
        </div>
      </div>
    </>
  );
};

export default Orders;
