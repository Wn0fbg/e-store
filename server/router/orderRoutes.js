import express from "express";
import { placeNewOrder } from "../controllers/orderController.js";
import {
  isAuthenticated,
  authorizeRoles,
} from "../middlewares/authModdleware.js";

const router = express.Router();

router.post("/new", isAuthenticated, placeNewOrder);

export default router;
