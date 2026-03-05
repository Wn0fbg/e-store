import { catchAsyncErrors } from "./catchAsyncError";
import ErrorHandler from "./errorMiddleware";
import database from "../database/db";

export const isAuthenticated = catchAsyncErrors(async, (req, res, next) => {});

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {};
};
