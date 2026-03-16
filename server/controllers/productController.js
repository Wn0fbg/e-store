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

export const fetchAllProducts = catchAsyncErrors(async (req, res, next) => {
  const { availability, price, category, rating, search } = req.query;

  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const conditionals = [];
  let values = [];
  let index = 1;

  // Filter by availability
  if (availability === "in-stock") {
    conditionals.push(`stock > 5`);
  } else if (availability === "limited") {
    conditionals.push(`stock > 0 AND stock <= 5`);
  } else if (availability === "out-of-stock") {
    conditionals.push(`stock = 0`);
  }

  // Filter by price
  if (price) {
    const [minPrice, maxPrice] = price.split("-");
    if (minPrice && maxPrice) {
      conditionals.push(`price BETWEEN $${index} AND $${index + 1}`);
      values.push(minPrice, maxPrice);
      index += 2;
    }
  }

  // Filter by category
  if (category) {
    conditionals.push(`category ILIKE $${index}`);
    values.push(`%${category}%`);
    index++;
  }

  // Filter by rating
  if (rating) {
    conditionals.push(`rating >= $${index}`);
    values.push(rating);
    index++;
  }

  // Filter by search in name/description
  if (search) {
    conditionals.push(
      `(p.name ILIKE $${index} OR p.description ILIKE $${index})`,
    );
    values.push(`%${search}%`);
    index++;
  }

  const whereClause = conditionals.length
    ? `WHERE ${conditionals.join(" AND ")}`
    : "";

  // Get count of filtered products
  const totalProductsResult = await database.query(
    `SELECT COUNT(*) FROM products p ${whereClause}`,
    values,
  );
  const totalProducts = parseInt(totalProductsResult.rows[0].count, 10);

  // Pagination placeholders (use one set of parameters, not two LIMITs)
  const paginationLimitParam = `$${index}`;
  values.push(limit);
  index++;

  const paginationOffsetParam = `$${index}`;
  values.push(offset);
  index++;

  // FETCH WITH REVIEWS (correct JOIN)
  const query = `
    SELECT p.*, COUNT(r.id) AS reviews_count
    FROM products p
    LEFT JOIN reviews r ON p.id = r.product_id
    ${whereClause}
    GROUP BY p.id
    ORDER BY p.created_at DESC
    LIMIT ${paginationLimitParam} OFFSET ${paginationOffsetParam}
  `;

  const result = await database.query(query, values);

  // Query for fetching new products
  const newProductsQuery = `
    SELECT p.*,
    COUNT(r.id) AS review_count
    FROM products p
    LEFT JOIN reviews r ON p.id = r.product_id
    WHERE p.created_at >= NOW() - INTERVAL '30 days'
    GROUP BY p.id
    ORDER BY p.created_at DESC
    LIMIT 8
  `;

  const newProductsResult = await database.query(newProductsQuery);

  // Query for fetching top rating products (rating >= 4.5)
  const topRatedQuery = `
    SELECT p.*,
    COUNT(r.id) AS review_count
    FROM products p
    LEFT JOIN reviews r ON p.id = r.product_id
    WHERE p.rating >= 4.5
    GROUP BY p.id
    ORDER BY p.created_at DESC, p.created_at DESC
    LIMIT 8
  `;
  const topRatedResult = await database.query(topRatedQuery);

  res.status(200).json({
    success: true,
    products: result.rows,
    totalProducts,
    newProducts: newProductsResult.rows,
    topRatedProducts: topRatedResult.rows,
  });
});

export const updateProduct = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;
});
