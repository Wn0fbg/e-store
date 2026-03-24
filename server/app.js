import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { createTables } from "./utils/createTables.js";
import { errorModdleware } from "./middlewares/errorMiddleware.js";
import authRouter from "./router/authRouter.js";
import productRouter from "./router/productRoutes.js";
import adminRouter from "./router/adminRoutes.js";

const app = express();

config({ path: "./config/config.env" });

app.use(
  cors({
    origin: [process.env.FRONTED_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    tempFileDir: "./uploads",
    useTempFiles: true,
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);
app.use("/api/admin", adminRouter);

createTables();

app.use(errorModdleware);

export default app;
