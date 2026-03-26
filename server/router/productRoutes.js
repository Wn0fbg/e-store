import express from "express";
import {
  createProduct,
  fetchAllProducts,
  updateProduct,
  deleteProduct,
  fetchSingleProduct,
  postProductReview,
  deleteReview,
  fetchFilteredProducts,
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
router.get("/products", fetchAllProducts);
router.get("/singleProduct/:productId", fetchSingleProduct);
router.put("/post-new/review/:productId", isAuthenticated, postProductReview);
router.delete("/delete/review/:productId".isAuthenticated, deleteReview);
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
router.post("/search", isAuthenticated, fetchFilteredProducts);

export default router;
