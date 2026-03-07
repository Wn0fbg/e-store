import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./errorMiddleware.js";
import database from "../database/db.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { authToken } = req.cookies;

  if (!authToken) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  // Поиск токена в таблице tokens и получение associated user_id
  const tokenRow = await database.query(
    "SELECT user_id FROM token_store WHERE token = $1 AND expires_at > NOW()",
    [authToken],
  );

  if (!tokenRow.rows || tokenRow.rows.length === 0) {
    return next(new ErrorHandler("User not found", 404));
  }

  const userId = tokenRow.rows[0].user_id;

  const user = await database.query("SELECT * FROM users WHERE id = $1", [
    userId,
  ]);

  if (!user.rows || user.rows.length === 0) {
    return next(new ErrorHandler("User not found", 404));
  }

  req.user = user.rows[0];
  next();
});

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access to this resourse`,
        ),
      );
    }
    next();
  };
};
