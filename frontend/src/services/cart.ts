import { apiRequest } from "@/services/http";
import type { CartMutationItem, CartServerState, Order } from "@/types";

function toPayload(items: CartMutationItem[]) {
  return items.map((item) => ({
    productId: Number(item.productId),
    qty: item.qty,
  }));
}

export async function getCart() {
  const response = await apiRequest<CartServerState>("/cart");
  return response.data as CartServerState;
}

export async function syncCart(items: CartMutationItem[]) {
  const response = await apiRequest<CartServerState>("/cart/sync", {
    method: "PUT",
    body: JSON.stringify({ items: toPayload(items) }),
  });
  return response.data as CartServerState;
}

export async function mergeCart(items: CartMutationItem[]) {
  const response = await apiRequest<CartServerState>("/cart/merge", {
    method: "POST",
    body: JSON.stringify({ items: toPayload(items) }),
  });
  return response.data as CartServerState;
}

export async function clearServerCart() {
  const response = await apiRequest<CartServerState>("/cart", {
    method: "DELETE",
  });
  return response.data as CartServerState;
}

export async function checkoutCart(couponCode?: string) {
  const response = await apiRequest<Order>("/orders/checkout", {
    method: "POST",
    body: JSON.stringify(couponCode ? { couponCode } : {}),
  });
  return response.data as Order;
}

export async function getOrders() {
  const response = await apiRequest<Order[]>("/orders");
  return (response.data ?? []) as Order[];
}
