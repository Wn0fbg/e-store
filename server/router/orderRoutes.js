import express from "express";
import {
  placeNewOrder,
  fetchSingleOrder,
  fetchMyOrders,
} from "../controllers/orderController.js";
import {
  isAuthenticated,
  authorizeRoles,
} from "../middlewares/authModdleware.js";

const router = express.Router();

router.post("/new", isAuthenticated, placeNewOrder);
router.get("/:orderId", isAuthenticated, fetchSingleOrder);
router.get("/orders/me", isAuthenticated, fetchMyOrders);

export default router;
