import ErrorHandler from "../middlewares/errorMiddleware.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import database from "../database/db.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { promisify } from "util";
import { createTempToken } from "../utils/createToken.js";

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

  // создаем пользователя
  const userResult = await database.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
    [name, email, hashedPassword],
  );

  const user = userResult.rows[0];

  // Генерация токена без JWT
  // 1) случайная строка
  const randomBytesAsync = promisify(crypto.randomBytes);
  const tokenBytes = await randomBytesAsync(48);
  const token = tokenBytes.toString("hex"); // 96 символов

  // 2) срок действия (например, 1 час)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);

  // 3) сохраняем токен в БД (с привязкой к пользователю)
  // предполагается наличие таблицы token_store (user_id, token, expires_at)
  await database.query(
    `INSERT INTO token_store (user_id, token, expires_at) VALUES ($1, $2, $3)`,
    [user.id, token, expiresAt],
  );

  // Ответ клиенту: пользователь + токен
  res.status(201).json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
    tokenExpiresAt: expiresAt,
  });
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

  // Генерируем токен и сохраняем его в БД
  const token = createTempToken(32);
  const userId = user.rows[0].id;

  // Расчёт времени истечения
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  // Сохранение токена в БД (пример на PostgreSQL)
  // Если у вас другая структура, адаптируйте запрос
  await database.query(
    `INSERT INTO token_store (user_id, token, expires_at) VALUES ($1, $2, $3)`,
    [userId, token, expiresAt],
  );

  // Установка cookie httpOnly. Можно добавить Secure для https.
  res.cookie("authToken", token, {
    httpOnly: true,
    maxAge: 1440 * 60 * 1000,
    // secure: true, // раскомментировать в продакшн
    sameSite: "lax",
  });

  // Ответ клиенту
  res.status(200).json({
    success: true,
    user: {
      id: user.rows[0].id,
      email: user.rows[0].email,
      // можно вернуть другие безопасные поля
    },
    message: "Logged in.",
  });
});

export const getUser = catchAsyncErrors(async (req, res, next) => {
  const { user } = req;
  if (!user) {
    return next(new ErrorHandler("User data not available", 500));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

export const logout = catchAsyncErrors(async (req, res, next) => {});
