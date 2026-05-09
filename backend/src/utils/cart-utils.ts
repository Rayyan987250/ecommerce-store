import { sql } from "../config/db.js";

export const TAX_RATE = 0.05;
export const MAX_CART_QTY = 99;

export type CartApiItem = {
  productId: string;
  title: string;
  image: string;
  price: number;
  qty: number;
  lineTotal: number;
};

export type CartState = {
  items: CartApiItem[];
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
};

type CartRow = {
  product_id: string;
  quantity: number;
  title: string;
  image: string;
  price: string | number;
};

export type CartMutationItem = {
  productId: number;
  qty: number;
};

type SqlExecutor = typeof sql;

export function roundCurrency(value: number) {
  return Number(value.toFixed(2));
}

export function buildCartState(items: CartApiItem[]): CartState {
  const subtotal = roundCurrency(items.reduce((sum, item) => sum + item.lineTotal, 0));
  const tax = subtotal > 0 ? roundCurrency(subtotal * TAX_RATE) : 0;
  const total = roundCurrency(subtotal + tax);
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);
  return {
    items,
    subtotal,
    tax,
    total,
    itemCount,
  };
}

export function normalizeCartItems(items: CartMutationItem[]) {
  const merged = new Map<number, number>();
  for (const item of items) {
    const nextQty = (merged.get(item.productId) ?? 0) + item.qty;
    merged.set(item.productId, Math.min(MAX_CART_QTY, nextQty));
  }
  return [...merged.entries()]
    .map(([productId, qty]) => ({ productId, qty }))
    .filter((item) => item.qty > 0);
}

export async function getOrCreateCartId(userId: string, db: SqlExecutor = sql) {
  const rows = await db<{ id: string }[]>`
    INSERT INTO carts (user_id)
    VALUES (${userId}::bigint)
    ON CONFLICT (user_id) DO UPDATE SET updated_at = NOW()
    RETURNING id::text AS id
  `;
  return Number(rows[0]?.id ?? 0);
}

export async function assertProductsExist(items: CartMutationItem[], db: SqlExecutor = sql) {
  const uniqueIds = [...new Set(items.map((item) => Number(item.productId)))];
  if (uniqueIds.length === 0) return;

  const products = await db<{ id: string }[]>`
    SELECT id::text AS id
    FROM products
    WHERE id IN ${db(uniqueIds)}
  `;
  if (products.length !== uniqueIds.length) {
    const error = new Error("One or more products do not exist") as Error & { statusCode?: number };
    error.statusCode = 400;
    throw error;
  }
}

export async function loadCartItems(userId: string, db: SqlExecutor = sql): Promise<CartApiItem[]> {
  const rows = await db<CartRow[]>`
    SELECT
      products.id::text AS product_id,
      cart_items.quantity,
      products.title,
      products.image,
      products.price
    FROM carts
    JOIN cart_items ON cart_items.cart_id = carts.id
    JOIN products ON products.id = cart_items.product_id
    WHERE carts.user_id = ${userId}::bigint
    ORDER BY cart_items.created_at ASC, products.id ASC
  `;

  return rows.map((row) => {
    const price = Number(row.price);
    const qty = Number(row.quantity);
    return {
      productId: row.product_id,
      title: row.title,
      image: row.image,
      price,
      qty,
      lineTotal: roundCurrency(price * qty),
    };
  });
}

export async function getCartState(userId: string, db: SqlExecutor = sql) {
  const items = await loadCartItems(userId, db);
  return buildCartState(items);
}

export async function clearCartForUser(userId: string, db: SqlExecutor = sql) {
  await db`
    DELETE FROM cart_items
    USING carts
    WHERE cart_items.cart_id = carts.id
    AND carts.user_id = ${userId}::bigint
  `;
  await db`
    UPDATE carts
    SET updated_at = NOW()
    WHERE user_id = ${userId}::bigint
  `;
}
