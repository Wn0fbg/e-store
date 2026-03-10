import ErrorHandler from "../middlewares/errorMiddleware.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import database from "../database/db.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { promisify } from "util";
import { createTempToken } from "../utils/createToken.js";
import { generateResetPasswordToken } from "../utils/generateResetPasswordToken.js";
import { generateEmailTemplate } from "../utils/generateForgotPasswordEmailTemplate.js";
import { sendEmail } from "../utils/sendEmail.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please provide all required fields.", 400));
  }

  if (password.length < 8 || password.length > 16) {
    return next(
      new ErrorHandler("Password must be between 8 and 16 characters", 400),
    );
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

  const userResult = await database.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
    [name, email, hashedPassword],
  );

  const user = userResult.rows[0];

  const randomBytesAsync = promisify(crypto.randomBytes);
  const tokenBytes = await randomBytesAsync(48);
  const token = tokenBytes.toString("hex");

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);

  await database.query(
    `INSERT INTO token_store (user_id, token, expires_at) VALUES ($1, $2, $3)`,
    [user.id, token, expiresAt],
  );

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

  const token = createTempToken(32);
  const userId = user.rows[0].id;

  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await database.query(
    `INSERT INTO token_store (user_id, token, expires_at) VALUES ($1, $2, $3)`,
    [userId, token, expiresAt],
  );

  res.cookie("authToken", token, {
    httpOnly: true,
    maxAge: 1440 * 60 * 1000,
    sameSite: "lax",
  });

  res.status(200).json({
    success: true,
    user: {
      id: user.rows[0].id,
      email: user.rows[0].email,
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

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("authToken", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;
  const { frontedUrl } = req.query;

  let userResult = await database.query(
    `SELECT * FROM users WHERE email = $1`,
    [email],
  );

  if (userResult.rows.length === 0) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  const user = userResult.rows[0];
  const { hashedToken, resetPasswordExpireTime, resetToken } =
    generateResetPasswordToken();

  await database.query(
    `UPDATE users SET reset_password_token = $1, 
          reset_password_expire = to_timestamp($2), 
          WHERE email = #3 `,
    [hashedToken, resetPasswordExpireTime / 1000, email],
  );

  const resetPasswordUrl = `${frontedUrl}/password/reset/${resetToken}`;
  const message = generateEmailTemplate(resetPasswordUrl);

  try {
    await sendEmail({
      email: user.email,
      subject: "Eccomrece Password Recovery",
      message,
    });
    register.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfuly.`,
    });
  } catch (error) {
    await database.query(
      `UPDATE users SET reset_password_token = NULL, reset_password_expire = NULL WHERE 
       email = $1`,
      [email],
    );
    return next(new ErrorHandler("Emaail could not be sant", 500));
  }
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await database.query(
    "SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expire > NOW()",
    [resetPasswordToken],
  );

  if (user.rows.length === 0) {
    return next(new ErrorHandler("Invalid or expired reset token.", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password do not match", 400));
  }

  if (
    req.body.password?.length < 8 ||
    req.body.password?.length > 16 ||
    req.body.confirmPassword?.length < 8 ||
    req.body.confirmPassword?.length > 16
  ) {
    return next(
      new ErrorHandler("Password must be between 8 and 16 characters", 400),
    );
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const updatedUser = await database.query(
    `UPDATE users SET password = $1, 
      reset_password_token = NULL, 
      reset_password_expire = NULL WHERE id = $2 RETURNING *`,
    [hashedPassword, user.rows[0].id],
  );

  sendToken(updatedUser.rows[0], 200, "Password reset successfuly", res);
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  const isPasswordMatch = await bcrypt.compare(
    currentPassword,
    req.user.password,
  );

  if (!isPasswordMatch) {
    return next(new ErrorHandler("Current passsword is incorect", 401));
  }

  if (newPassword !== confirmNewPassword) {
    return next(new ErrorHandler("New passwords do not match", 400));
  }

  if (
    newPassword.length < 8 ||
    newPassword.length > 16 ||
    confirmNewPassword.length < 8 ||
    confirmNewPassword.length > 16
  ) {
    return next(
      new ErrorHandler("Password must be between 8 and 16 characters", 400),
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await database.query("UPDATE users SET password = $1 WHERE id = $2", [
    hashedPassword,
    req.user.id,
  ]);

  res.status(200).json({
    success: true,
    message: "Password updated successfuly",
  });
});

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return next(new ErrorHandler("Please all required fields", 400));
  }

  if (name.trim().length === 0 || email.trim().length === 0) {
    return next(new ErrorHandler("Name and email cannot be empty", 400));
  }
});
