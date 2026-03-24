import ErrorHandler from "../middlewares/errorMiddleware.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import database from "../database/db.js";

export const gettAllUsers = catchAsyncErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;

  const totalUsersResult = await database.query(
    "SELECT COUNT(*) FROM users WHERE role = $1",
    ["User"],
  );

  const totalUsers = parseInt(totalUsersResult.rows[0].count);

  const offset = (page - 1) * 10;

  const users = await database.query(
    "SELECT * FROM users WHERE role = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
    ["User", 10, offset],
  );

  res.status(200).json({
    success: true,
    totalUsers,
    currentPage: page,
    users: users.rows,
  });
});

export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const deleteUser = await database.query(
    "DELETE FROM users WHERE id = $1 RETURNING *",
    [id],
  );

  if (deleteUser.rows.length === 0) {
    return next(new ErrorHandler("User not found", 400));
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

export const dashboardStats = catchAsyncErrors(async (req, res, next) => {
  const today = new Date();
  const todayDate = today.toISOString().split("T")[0];
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const yesterdayDate = yesterday.toISOString().split("T")[0];

  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const previeousMonthStart = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
  );

  const previousMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

  const totalRevenueAllTimeQuery = await database.query(`
    SELECT SUM(total_price) FROM orders 
  `);

  const totalRevenueAllTime =
    parseFloat(totalRevenueAllTimeQuery.rows[0].sum) || 0;

  // total Users
  const totalUsersCountQuery = await database.query(`
        SELECT COUNT(*) FROM users WHERE role = 'User'
  `);

  const totalUsersCount = parseInt(totalUsersCountQuery.rows[0].count) || 0;

  // order status counts
  const orderStatusCountsQuery = await database.query(`
    SELECT order_status, COUNT(*) FROM orders GROUP BY order_status
  `);

  const orderStatusCounts = {
    Processing: 0,
    Shipped: 0,
    Delivered: 0,
    Canceled: 0,
    g,
  };

  orderStatusCountsQuery.rows.forEach((row) => {
    orderStatusCounts[row.order_status] = parseInt(row.count);
  });

  // today's revenue
  const todayRevenueQuery = await database.query(`
    SELECT SUM(total_price) FROM orders WHERE DATE(created_at) = $1
  `, [todayDate]);
});
