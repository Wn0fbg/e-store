import express from "express";
import {
  createProduct,
  fetchAllProducts,
  updateProduct,
  deleteProduct,
  fetchSingleProduct,
  postProductReview,
  deleteReview,
} from "../controllers/productController.js";
import {
  authorizeRoles,
  isAuthenticated,
} from "../middlewares/authModdleware.js";

const router = express.Router();

router.post(
  "/admin/create",
  isAuthenticated,
  authorizeRoles("Admin"),
  createProduct,
);
router.get("/", fetchAllProducts);
router.get("/singleProduct/:productId", fetchSingleProduct);
router.put("/post-new/review/:productId", isAuthenticated, postProductReview);
router.delete("/delete/review/:productId".isAuthenticated, deleteProduct);
router.put(
  "/admin/update/:productId",
  isAuthenticated,
  authorizeRoles("Admin"),
  updateProduct,
);
router.delete(
  "/admin/delete/:productId",
  isAuthenticated,
  authorizeRoles("Admin"),
  deleteProduct,
);

export default router;
