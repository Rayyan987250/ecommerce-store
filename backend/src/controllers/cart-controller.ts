import type { NextFunction, Request, Response } from "express";
import { sql } from "../config/db.js";
import type {
  CartItemMutationInput,
  CartQtyUpdateInput,
  CartSyncInput,
} from "../schemas/cart-schemas.js";
import {
  assertProductsExist,
  clearCartForUser,
  getCartState,
  getOrCreateCartId,
  normalizeCartItems,
} from "../utils/cart-utils.js";

function parseProductId(value: unknown) {
  const parsed = Number.parseInt(String(value), 10);
  if (Number.isNaN(parsed) || parsed <= 0) return null;
  return parsed;
}

function requireUserId(req: Request) {
  const userId = req.user?.id;
  if (!userId) {
    const error = new Error("Not authorized") as Error & { statusCode?: number };
    error.statusCode = 401;
    throw error;
  }
  return userId;
}

export async function getCart(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = requireUserId(req);
    const cart = await getCartState(userId);
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
}

export async function syncCart(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = requireUserId(req);
    const payload = req.body as CartSyncInput;
    const items = normalizeCartItems(payload.items);

    const cart = await sql.begin(async (tx) => {
      const db = tx as unknown as typeof sql;
      const cartId = await getOrCreateCartId(userId, db);
      await assertProductsExist(items, db);
      await tx`DELETE FROM cart_items WHERE cart_id = ${cartId}::bigint`;

      for (const item of items) {
        await tx`
          INSERT INTO cart_items (cart_id, product_id, quantity)
          VALUES (${cartId}::bigint, ${item.productId}::bigint, ${item.qty})
        `;
      }

      await tx`
        UPDATE carts
        SET updated_at = NOW()
        WHERE id = ${cartId}::bigint
      `;

      return getCartState(userId, db);
    });

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
}

export async function addCartItem(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = requireUserId(req);
    const payload = req.body as CartItemMutationInput;

    const cart = await sql.begin(async (tx) => {
      const db = tx as unknown as typeof sql;
      const cartId = await getOrCreateCartId(userId, db);
      await assertProductsExist([{ productId: payload.productId, qty: payload.qty }], db);

      await tx`
        INSERT INTO cart_items (cart_id, product_id, quantity)
        VALUES (${cartId}::bigint, ${payload.productId}::bigint, ${payload.qty})
        ON CONFLICT (cart_id, product_id) DO UPDATE SET
          quantity = cart_items.quantity + EXCLUDED.quantity,
          updated_at = NOW()
      `;

      await tx`
        UPDATE carts
        SET updated_at = NOW()
        WHERE id = ${cartId}::bigint
      `;

      return getCartState(userId, db);
    });

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
}

export async function updateCartItem(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = requireUserId(req);
    const productId = parseProductId(req.params.productId);
    const payload = req.body as CartQtyUpdateInput;

    if (!productId) {
      res.status(400).json({ success: false, message: "Invalid product id" });
      return;
    }

    const cart = await sql.begin(async (tx) => {
      const db = tx as unknown as typeof sql;
      const cartId = await getOrCreateCartId(userId, db);
      const updated = await tx<{ product_id: string }[]>`
        UPDATE cart_items
        SET quantity = ${payload.qty}, updated_at = NOW()
        WHERE cart_id = ${cartId}::bigint
        AND product_id = ${productId}::bigint
        RETURNING product_id::text AS product_id
      `;

      if (updated.length === 0) {
        const error = new Error("Cart item not found") as Error & { statusCode?: number };
        error.statusCode = 404;
        throw error;
      }

      await tx`
        UPDATE carts
        SET updated_at = NOW()
        WHERE id = ${cartId}::bigint
      `;

      return getCartState(userId, db);
    });

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
}

export async function removeCartItem(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = requireUserId(req);
    const productId = parseProductId(req.params.productId);

    if (!productId) {
      res.status(400).json({ success: false, message: "Invalid product id" });
      return;
    }

    const cart = await sql.begin(async (tx) => {
      const db = tx as unknown as typeof sql;
      const cartId = await getOrCreateCartId(userId, db);
      const deleted = await tx<{ product_id: string }[]>`
        DELETE FROM cart_items
        WHERE cart_id = ${cartId}::bigint
        AND product_id = ${productId}::bigint
        RETURNING product_id::text AS product_id
      `;

      if (deleted.length === 0) {
        const error = new Error("Cart item not found") as Error & { statusCode?: number };
        error.statusCode = 404;
        throw error;
      }

      await tx`
        UPDATE carts
        SET updated_at = NOW()
        WHERE id = ${cartId}::bigint
      `;

      return getCartState(userId, db);
    });

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
}

export async function clearCart(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = requireUserId(req);
    await clearCartForUser(userId);
    const cart = await getCartState(userId);
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
}
