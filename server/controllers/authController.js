import ErrorHandler from "../middlewares/errorMiddleware.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import database from "../database/db.js";
import bcrypt from "bcrypt";

export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please provide all required fields.", 400));
  }

  const isAlreadyRegistered = await database.query(
    `SELECT * FROM users WHERE email = $1`,
    [email],
  );

  if (isAlreadyRegistered.rows.length > 0) {
    return next(
      new ErrorHandler("User already registered with this email", 400),
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await database.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
    [name, email, hashedPassword],
  );

  // ответ клиенту
  res.status(201).json({ success: true, user: user.rows[0] });
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password", 400));
  }

  const user = await database.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  if (user.rows.length === 0) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }

  const isPasswordPatch = await bcrypt.compare(password, user.rows[0].password);

  if (!isPasswordPatch) {
    return next(new ErrorHandler("Invalid email or password.", 401));
  }

  // Ответ клиенту
  res
    .status(200)
    .json({ success: true, user: user.rows[0], message: "Logged in." });
});

export const getUser = catchAsyncErrors(async (req, res, next) => {});

export const logout = catchAsyncErrors(async (req, res, next) => {});
