import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import { createTables } from "./utils/createTables.js";
import { errorModdleware } from "./middlewares/errorMiddleware.js";
import authRouter from "./router/authRouter.js";
import productRouter from "./router/productRoutes.js";
import adminRouter from "./router/adminRoutes.js";
import orderRouter from "./router/orderRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

config({ path: "./config/config.env" });

// CORS и проксирование
app.use(
  cors({
    origin: [process.env.FRONTED_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

// Парсер кук и тела
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Настройка загрузки файлов через multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads", "product_images"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const url = `/uploads/product_images/${req.file.filename}`;
  res.json({ url, public_id: req.file.filename });
});

// Старый fileUpload middleware
app.use(
  fileUpload({
    tempFileDir: "./uploads",
    useTempFiles: true,
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);
app.use("/api/admin", adminRouter);
app.use("/api/order", orderRouter);

createTables();

app.use(errorModdleware);

export default app;
