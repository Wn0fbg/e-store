import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./errorMiddleware.js";
import database from "../database/db.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  const user = await database.query(
    "SELECT * FROM users WHERE user_id = $1 LIMIT 1",
    [token.id],
  );

  if (!user.rows.length) {
    return next(new ErrorHandler("User not found", 401));
  }

  req.user = user.rows[0];
  next();
});

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
        ),
      );
    }
    next(); // добавлено
  };
};
