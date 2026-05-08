import type { NextFunction, Request, Response } from "express";
import { sql } from "../config/db.js";
import type { CheckoutInput } from "../schemas/cart-schemas.js";
import {
  TAX_RATE,
  clearCartForUser,
  getCartState,
  roundCurrency,
} from "../utils/cart-utils.js";

type OrderRow = {
  id: string;
  status: string;
  subtotal: string | number;
  discount: string | number;
  tax: string | number;
  total: string | number;
  item_count: number;
  coupon_code: string | null;
  created_at: string;
};

type OrderItemRow = {
  order_id: string;
  product_id: string | null;
  title_snapshot: string;
  image_snapshot: string;
  unit_price: string | number;
  quantity: number;
  line_total: string | number;
};

function requireUserId(req: Request) {
  const userId = req.user?.id;
  if (!userId) {
    const error = new Error("Not authorized") as Error & { statusCode?: number };
    error.statusCode = 401;
    throw error;
  }
  return userId;
}

function toOrderSummary(order: OrderRow, items: OrderItemRow[]) {
  return {
    id: order.id,
    status: order.status,
    subtotal: Number(order.subtotal),
    discount: Number(order.discount),
    tax: Number(order.tax),
    total: Number(order.total),
    itemCount: order.item_count,
    couponCode: order.coupon_code ?? undefined,
    createdAt: order.created_at,
    items: items.map((item) => ({
      productId: item.product_id ?? undefined,
      title: item.title_snapshot,
      image: item.image_snapshot,
      price: Number(item.unit_price),
      qty: item.quantity,
      lineTotal: Number(item.line_total),
    })),
  };
}

export async function checkout(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = requireUserId(req);
    const payload = req.body as CheckoutInput;
    const cart = await getCartState(userId);

    if (cart.items.length === 0) {
      res.status(400).json({ success: false, message: "Cart is empty" });
      return;
    }

    const normalizedCoupon = payload.couponCode?.trim().toUpperCase();
    const subtotal = cart.subtotal;
    const discount = normalizedCoupon === "SAVE10" ? roundCurrency(subtotal * 0.1) : 0;
    const taxableSubtotal = Math.max(subtotal - discount, 0);
    const tax = taxableSubtotal > 0 ? roundCurrency(taxableSubtotal * TAX_RATE) : 0;
    const total = roundCurrency(taxableSubtotal + tax);

    const order = await sql.begin(async (tx) => {
      const db = tx as unknown as typeof sql;
      const createdOrders = await tx<OrderRow[]>`
        INSERT INTO orders (user_id, status, subtotal, discount, tax, total, item_count, coupon_code)
        VALUES (
          ${userId}::bigint,
          'placed',
          ${subtotal},
          ${discount},
          ${tax},
          ${total},
          ${cart.itemCount},
          ${normalizedCoupon ?? null}
        )
        RETURNING
          id::text AS id,
          status,
          subtotal,
          discount,
          tax,
          total,
          item_count,
          coupon_code,
          created_at::text AS created_at
      `;
      const createdOrder = createdOrders[0];
      if (!createdOrder) {
        const error = new Error("Order creation failed") as Error & { statusCode?: number };
        error.statusCode = 500;
        throw error;
      }

      for (const item of cart.items) {
        await tx`
          INSERT INTO order_items (
            order_id,
            product_id,
            title_snapshot,
            image_snapshot,
            unit_price,
            quantity,
            line_total
          ) VALUES (
            ${createdOrder.id}::bigint,
            ${item.productId}::bigint,
            ${item.title},
            ${item.image},
            ${item.price},
            ${item.qty},
            ${item.lineTotal}
          )
        `;
      }

      await clearCartForUser(userId, db);

      const orderItems = await tx<OrderItemRow[]>`
        SELECT
          order_id::text AS order_id,
          product_id::text AS product_id,
          title_snapshot,
          image_snapshot,
          unit_price,
          quantity,
          line_total
        FROM order_items
        WHERE order_id = ${createdOrder.id}::bigint
        ORDER BY id ASC
      `;

      return toOrderSummary(createdOrder, orderItems);
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
}

export async function getOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = requireUserId(req);
    const orders = await sql<OrderRow[]>`
      SELECT
        id::text AS id,
        status,
        subtotal,
        discount,
        tax,
        total,
        item_count,
        coupon_code,
        created_at::text AS created_at
      FROM orders
      WHERE user_id = ${userId}::bigint
      ORDER BY created_at DESC, id DESC
    `;

    const orderIds = orders.map((order) => Number(order.id));
    const orderItems = orderIds.length
      ? await sql<OrderItemRow[]>`
          SELECT
            order_id::text AS order_id,
            product_id::text AS product_id,
            title_snapshot,
            image_snapshot,
            unit_price,
            quantity,
            line_total
          FROM order_items
          WHERE order_id IN ${sql(orderIds)}
          ORDER BY id ASC
        `
      : [];

    const itemsByOrderId = new Map<string, OrderItemRow[]>();
    for (const item of orderItems) {
      const group = itemsByOrderId.get(item.order_id) ?? [];
      group.push(item);
      itemsByOrderId.set(item.order_id, group);
    }

    res.status(200).json({
      success: true,
      data: orders.map((order) => toOrderSummary(order, itemsByOrderId.get(order.id) ?? [])),
    });
  } catch (error) {
    next(error);
  }
}
