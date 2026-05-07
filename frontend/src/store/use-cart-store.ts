"use client";

import type { CartLineItem, Product, SavedProduct } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartState = {
  items: CartLineItem[];
  saved: SavedProduct[];
  isSaved: (id: string) => boolean;
  addItem: (product: Product, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  saveProduct: (product: Product) => void;
  removeSaved: (id: string) => void;
  moveToSaved: (id: string) => void;
  moveToCart: (id: string) => void;
};

function toSavedProduct(product: Pick<Product, "id" | "title" | "image" | "price">): SavedProduct {
  return { id: product.id, title: product.title, image: product.image, price: product.price };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      saved: [],
      isSaved: (id) => get().saved.some((item) => item.id === id),
      addItem: (product, qty = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id ? { ...item, qty: item.qty + qty } : item
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { id: product.id, title: product.title, image: product.image, price: product.price, qty },
            ],
            saved: state.saved.filter((item) => item.id !== product.id),
          };
        }),
      removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      updateQty: (id, qty) =>
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, qty: Math.max(1, qty) } : item)),
        })),
      clearCart: () => set({ items: [] }),
      saveProduct: (product) =>
        set((state) => {
          if (state.saved.some((item) => item.id === product.id)) return state;
          return { saved: [...state.saved, toSavedProduct(product)] };
        }),
      removeSaved: (id) => set((state) => ({ saved: state.saved.filter((item) => item.id !== id) })),
      moveToSaved: (id) =>
        set((state) => {
          const item = state.items.find((entry) => entry.id === id);
          if (!item) return state;
          const nextSaved = state.saved.some((entry) => entry.id === id)
            ? state.saved
            : [...state.saved, { id: item.id, title: item.title, image: item.image, price: item.price }];
          return {
            items: state.items.filter((entry) => entry.id !== id),
            saved: nextSaved,
          };
        }),
      moveToCart: (id) =>
        set((state) => {
          const savedItem = state.saved.find((entry) => entry.id === id);
          if (!savedItem) return state;
          const existing = state.items.find((entry) => entry.id === id);
          return {
            saved: state.saved.filter((entry) => entry.id !== id),
            items: existing
              ? state.items.map((entry) => (entry.id === id ? { ...entry, qty: entry.qty + 1 } : entry))
              : [...state.items, { ...savedItem, qty: 1 }],
          };
        }),
    }),
    {
      name: "frontend-cart-store",
    }
  )
);
