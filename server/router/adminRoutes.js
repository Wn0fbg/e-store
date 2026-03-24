import express from "express";
import {
  gettAllUsers,
  deleteUser,
  dashboardStats,
} from "../controllers/adminController.js";
import {
  authorizeRoles,
  isAuthenticated,
} from "../middlewares/authModdleware.js";

const router = express.Router();

router.get(
  "/getallusers",
  isAuthenticated,
  authorizeRoles("Admin"),
  gettAllUsers,
);
router.delete(
  "/delete/:id",
  isAuthenticated,
  authorizeRoles("Admin"),
  deleteUser,
);
router.get(
  "/fetch/dashboard-stats",
  isAuthenticated,
  authorizeRoles("Admin"),
  dashboardStats,
);

export default router;
