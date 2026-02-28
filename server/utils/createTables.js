import { createUserTable } from "../models/userTable.js";
import { createShippingInfoTable } from "../models/shippingInfoTable.js";
import { createProductTable } from "../models/productTable.js";
import { createProductReviewsTable } from "../models/productReviewsTable.js";
import { createPaymentsTable } from "../models/paymentsTable.js";
import { createOrdersTable } from "../models/orderTable.js";
import { createOrderItemsTable } from "../models/orderItemsTable.js";

export const createTables = async () => {
  try {
    await createUserTable();
    await createProductTable();
    await createShippingInfoTable();
    await createOrdersTable();
    await createOrderItemsTable();
    await createPaymentsTable();
    await createProductReviewsTable();
    console.log("All tables create successfuly");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};
