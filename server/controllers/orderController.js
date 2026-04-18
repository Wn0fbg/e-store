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
  const shipping_price = total_price >= 0 ? 0 : 2;
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

export const fetchSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const { orderId } = req.params;
  const result = await database.query(
    `
    SELECT o.*,
       COALESCE((
         SELECT json_agg(json_build_object(
           'order_item_id', oi.id,
           'order_id', oi.order_id,
           'product_id', oi.product_id,
           'quantity', oi.quantity,
           'price', oi.price
         ))
         FROM order_items oi
         WHERE oi.order_id = o.id
       ), '[]'::json) AS order_items,
       json_build_object(
         'full_name', s.full_name,
         'state', s.state,
         'city', s.city,
         'country', s.country,
         'address', s.address,
         'pincode', s.pincode,
         'phone', s.phone
       ) AS shipping_info
    FROM orders o
    LEFT JOIN shipping_info s ON o.id = s.order_id
    WHERE o.id = $1;
  `,
    [orderId],
  );

  res.status(200).json({
    success: true,
    message: "Orders fetched.",
    orders: result.rows[0],
  });
});

export const fetchMyOrders = catchAsyncErrors(async (req, res, next) => {
  const result = await database.query(
    `
    SELECT
      o.*,
      COALESCE(
        json_agg(
          json_build_object(
            'order_item_id', oi.id,
            'order_id', oi.order_id,
            'product_id', oi.product_id,
            'quantity', oi.quantity,
            'price', oi.price,
            'image', oi.image,
            'title', oi.title
          )
        ) FILTER (WHERE oi.id IS NOT NULL), '[]'
      ) AS order_items,
      json_build_object(
        'full_name', s.full_name,
        'state', s.state,
        'city', s.city,
        'country', s.country,
        'address', s.address,
        'pincode', s.pincode,
        'phone', s.phone
      ) AS shipping_info
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN shipping_info s ON o.id = s.order_id
    WHERE o.buyer_id = $1 AND o.paid_at IS NOT NULL
    GROUP BY o.id, s.id
    `,
    [req.user.id],
  );

  res.status(200).json({
    success: true,
    message: "All your orderes are fetched",
    myOrders: result.rows,
  });
});

export const fetchAllOrders = catchAsyncErrors(async (req, res, next) => {
  const result = await database.query(`
    SELECT o.*,
    COALESCE(
      json_agg(
        json_build_object(
          'order_item_id', oi.id,
          'order_id', oi.order_id,
          'product_id', oi.product_id,
          'quantity', oi.quantity,
          'price', oi.price,
          'image', oi.image,
          'title', oi.title
        )
      ) FILTER (WHERE oi.id IS NOT NULL), '[]'
    ) AS order_items,
    json_build_object(
      'full_name', s.full_name,
      'state', s.state,
      'city', s.city,
      'country', s.country,
      'address', s.address,
      'pincode', s.pincode,
      'phone', s.phone
    ) AS shipping_info
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN shipping_info s on o.id = s.order_id
    GROUP BY o.id, s.id
  `);

  res.status(200).json({
    success: true,
    message: "All orders fetched",
    orders: result.rows,
  });
});

export const updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return next(new ErrorHandler("Provide a valid status for order.", 400));
  }

  const { orderId } = req.params;
  const result = await database.query(
    `
    SELECT * FROM orders WHERE id = $1
  `,
    [orderId],
  );

  if (result.rows.length === 0) {
    return next(new ErrorHandler("Invalid order ID.", 404));
  }

  const updateOrder = await database.query(
    `
    UPDATE orders SET order_status = $1 WHERE id = $2 RETURNING *
  `,
    [status, orderId],
  );

  res.status(200).json({
    success: true,
    message: "Order status updated",
    updatedOrder: updateOrder.rows[0],
  });
});

export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const { orderId } = req.params;
  const result = await database.query(
    `
    DELETE FROM orders WHERE id = $1 RETURNING *
  `,
    [orderId],
  );

  if (result.rows.length === 0) {
    return next(new ErrorHandler("Invalid order ID.", 404));
  }

  res.status(200).json({
    success: true,
    message: "Order deleted.",
    order: result.rows[0],
  });
});
