import ErrorHandler from "../middlewares/errorMiddleware.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import database from "../database/db.js";

export const placeNewOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    full_name,
    state,
    city,
    country,
    address,
    pincode,
    phone,
    orderedItems,
  } = req.body;

  if (
    !full_name ||
    !state ||
    !city ||
    !country ||
    !address ||
    !pincode ||
    !phone
  ) {
    return next(
      new ErrorHandler("Please provide complete shipping details.", 400),
    );
  }

  // Обработаем orderedItems внимательно
  let items = orderedItems;
  if (typeof items === "string") {
    try {
      items = JSON.parse(items);
    } catch (e) {
      return next(new ErrorHandler("Invalid orderedItems format.", 400));
    }
  }

  if (!Array.isArray(items) || items.length === 0) {
    return next(new ErrorHandler("No items in cart.", 400));
  }

  // product.id массив
  const productIds = items.map((item) => {
    if (!item || !item.product || !item.product.id) {
      return null;
    }
    return item.product.id;
  });

  if (productIds.includes(null)) {
    return next(new ErrorHandler("Invalid item structure in cart.", 400));
  }

  const { rows: products } = await database.query(
    `
    SELECT id, price, stock, name FROM products WHERE id = ANY($1::uuid[])
  `,
    [productIds],
  );

  let total_price = 0;
  const values = [];
  const placeholders = [];

  items.forEach((item, index) => {
    // Безопасный доступ к структуре item
    const productId = item?.product?.id;
    const product = products.find((p) => p.id === productId);

    if (!product) {
      return next(
        new ErrorHandler(`Product not found for id: ${productId}`, 404),
      );
    }

    // Проверка наличия stock
    const qty = item?.quantity ?? 0;
    if (qty > product.stock) {
      return next(
        new ErrorHandler(
          `Only ${product.stock} units available for ${product.name}`,
        ),
      );
    }

    const itemTotal = product.price * qty;
    total_price += itemTotal;

    // Безопасный доступ к image
    const imageUrl =
      item?.product?.image &&
      Array.isArray(item.product.image) &&
      item.product.image.length > 0 &&
      item.product.image[0]?.url
        ? item.product.image[0].url
        : "";

    values.push(null, product.id, qty, product.price, imageUrl, product.name);

    const offset = index * 6;
    placeholders.push(`(
      $${offset + 1},
      $${offset + 2},
      $${offset + 3},
      $${offset + 4},
      $${offset + 5},
      $${offset + 6}
     )`);
  });

  const tax_price = 0.008;
  const shipping_price = 2;
  total_price = Math.round(
    total_price + total_price * tax_price + shipping_price,
  );

  const orderResult = await database.query(
    `
    INSERT INTO orders (buyer_id, total_price, tax_price, shipping_price)
    VALUES ($1, $2, $3, $4) RETURNING *
  `,
    [req.user.id, total_price, tax_price, shipping_price],
  );
  const orderId = orderResult.rows[0].id;

  for (let i = 0; i < values.length; i += 6) {
    values[i] = orderId;
  }

  await database.query(
    `
    INSERT INTO order_items (order_id, product_id, quantity, price, image, title)
    VALUES ${placeholders.join(", ")} RETURNING *
  `,
    values,
  );

  await database.query(
    `
    INSERT INTO shipping_info 
    (order_id, full_name, state, city, country, address, pincode, phone)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
  `,
    [orderId, full_name, state, city, country, address, pincode, phone],
  );

  res.status(200).json({
    success: true,
    message: "Order placed successfuly. Please proceed to payment",
    total_price,
  });
});
