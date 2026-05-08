import { z } from "zod";

export const cartItemMutationSchema = z.object({
  productId: z.coerce.number().int().positive(),
  qty: z.coerce.number().int().min(1).max(99),
});

export const cartSyncSchema = z.object({
  items: z.array(cartItemMutationSchema).max(200),
});

export const cartQtyUpdateSchema = z.object({
  qty: z.coerce.number().int().min(1).max(99),
});

export const checkoutSchema = z.object({
  couponCode: z.string().trim().max(32).optional(),
});

export type CartItemMutationInput = z.infer<typeof cartItemMutationSchema>;
export type CartSyncInput = z.infer<typeof cartSyncSchema>;
export type CartQtyUpdateInput = z.infer<typeof cartQtyUpdateSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
