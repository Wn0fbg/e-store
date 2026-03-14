import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import database from "../database/db.js";

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { stat, mkdir, rename as renameFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createProduct = catchAsyncErrors(async (req, res, next) => {
  const { name, description, price, category, stock } = req.body;
  const created_by = req.user.id;

  if (!name || !description || !price || !category || !stock) {
    return next(
      new ErrorHandler("Please provide complete product details", 400),
    );
  }

  let uploadedImages = [];
  const imagesDir = path.resolve(__dirname, "..", "uploads", "product_images");

  try {
    await stat(imagesDir);
  } catch (err) {
    await mkdir(imagesDir, { recursive: true });
  }

  if (req.files && req.files.images) {
    const files = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    for (const file of files) {
      const tempPath = file.tempFilePath || file.path;
      const ext =
        path.extname(file.name || file.originalname || ".jpg") || ".jpg";
      const filename = `${uuidv4()}${ext}`;
      const destPath = path.resolve(imagesDir, filename);

      await renameFile(tempPath, destPath);

      uploadedImages.push({
        url: `/uploads/product_images/${filename}`,
        public_id: filename,
      });
    }
  }

  const product = await database.query(
    `INSERT INTO products 
      (name, description, price, category, stock, images, created_by) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [
      name,
      description,
      price,
      category,
      stock,
      JSON.stringify(uploadedImages),
      created_by,
    ],
  );

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product: product.rows[0],
  });
});
