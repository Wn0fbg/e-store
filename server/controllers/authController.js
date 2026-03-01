import ErrorHandler from "../middlewares/errorMiddleware.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import database from "../database/db.js";

export const register = catchAsyncErrors(async (req, res, next) => {});

export const login = catchAsyncErrors(async (req, res, next) => {});

export const getUser = catchAsyncErrors(async (req, res, next) => {});

export const logout = catchAsyncErrors(async (req, res, next) => {});
