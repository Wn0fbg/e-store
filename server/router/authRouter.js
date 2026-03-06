import express from "express";
import {
  getUser,
  login,
  logout,
  register,
} from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authModdleware.js";

const router = express.Router();

router.get("/me", getUser);
router.post("/register", register);
router.post("/login", isAuthenticated, login);
router.get("/logout", isAuthenticated, logout);

export default router;
