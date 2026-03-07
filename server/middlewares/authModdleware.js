import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler, { errorModdleware } from "./errorMiddleware.js";
import database from "../database/db.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  const user = await database.query("SELECT * FROM users WHERE id = $1", [
    token.id,
  ]);

  req.user = user.rows[0];
  next(0);
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
