import { createUserTable } from "../models/userTable.js";
import { createProductTable } from "../models/productTable.js";
import { createOrdersTable } from "../models/orderTable.js";
import { createOrderItemsTable } from "../models/orderItemsTable.js";

import { createPaymentsTable } from "../models/paymentsTable.js";
import { createProductReviewsTable } from "../models/productReviewsTable.js";
import { createShippingInfoTable } from "../models/shippingInfoTable.js";
import { createTokenStoreTable } from "../models/tokenStoreTable.js";

export const createTables = async () => {
  try {
    await createUserTable();
    await createProductTable();
    await createOrdersTable();
    await createOrderItemsTable();
    await createShippingInfoTable();
    await createPaymentsTable();
    await createProductReviewsTable();
    await createTokenStoreTable();
    console.log("All tables create successfuly");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};
