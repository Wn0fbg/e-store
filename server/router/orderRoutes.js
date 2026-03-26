import express from "express";
import {
  placeNewOrder,
  fetchSingleOrder,
  fetchMyOrders,
  fetchAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";
import {
  isAuthenticated,
  authorizeRoles,
} from "../middlewares/authModdleware.js";

const router = express.Router();

router.post("/new", isAuthenticated, placeNewOrder);
router.get("/:orderId", isAuthenticated, fetchSingleOrder);
router.get("/orders/me", isAuthenticated, fetchMyOrders);
router.get(
  "/admin/getall",
  isAuthenticated,
  authorizeRoles("Admin"),
  fetchAllOrders,
);
router.put(
  "/admin/update/:orderId",
  isAuthenticated,
  authorizeRoles("Admin"),
  updateOrderStatus,
);
router.delete(
  "/admin/delete/:orderId",
  isAuthenticated,
  authorizeRoles("Admin"),
  deleteOrder,
);

export default router;
