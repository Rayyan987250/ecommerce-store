"use client";

import { checkoutCart, clearServerCart, getCart, mergeCart, syncCart } from "@/services/cart";
import { useAuthStore } from "@/store/use-auth-store";
import type { CartLineItem, CartMutationItem, CartServerState, Order, Product, SavedProduct } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartState = {
  items: CartLineItem[];
  saved: SavedProduct[];
  ownerUserId: string | null;
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
  isServerSyncing: boolean;
  syncError: string | null;
  lastOrder: Order | null;
  setServerCart: (cart: CartServerState) => void;
  loadServerCart: () => Promise<void>;
  syncServerCart: () => Promise<void>;
  mergeServerCart: () => Promise<void>;
  isSaved: (id: string) => boolean;
  addItem: (product: Product, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  saveProduct: (product: Product) => void;
  removeSaved: (id: string) => void;
  moveToSaved: (id: string) => void;
  moveToCart: (id: string) => void;
  checkout: (couponCode?: string) => Promise<Order>;
  clearLastOrder: () => void;
  claimOwnership: (userId: string) => void;
  resetAfterSignOut: () => void;
  resetForUserSwitch: (userId: string) => void;
};

const MAX_CART_QTY = 99;

let cartMutationQueue: Promise<void> = Promise.resolve();

function clampQty(value: number) {
  return Math.min(Math.max(Math.trunc(value) || 1, 1), MAX_CART_QTY);
}

function enqueueCartMutation(task: () => Promise<void>) {
  const next = cartMutationQueue.then(task, task);
  cartMutationQueue = next.catch(() => undefined);
  return next;
}

async function waitForCartQueue() {
  await cartMutationQueue.catch(() => undefined);
}

function toSavedProduct(product: Pick<Product, "id" | "title" | "image" | "price">): SavedProduct {
  return { id: product.id, title: product.title, image: product.image, price: product.price };
}

function toServerPayload(items: CartLineItem[]): CartMutationItem[] {
  return items.map((item) => ({ productId: item.id, qty: clampQty(item.qty) }));
}

function buildLocalTotals(items: CartLineItem[]) {
  const subtotal = Number(items.reduce((total, item) => total + item.price * item.qty, 0).toFixed(2));
  const tax = subtotal > 0 ? Number((subtotal * 0.05).toFixed(2)) : 0;
  const total = Number((subtotal + tax).toFixed(2));
  const itemCount = items.reduce((count, item) => count + item.qty, 0);
  return { subtotal, tax, total, itemCount };
}

async function pushServerCart(items: CartLineItem[]) {
  const user = useAuthStore.getState().user;
  if (!user) return null;
  return syncCart(toServerPayload(items));
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      saved: [],
      ownerUserId: null,
      subtotal: 0,
      tax: 0,
      total: 0,
      itemCount: 0,
      isServerSyncing: false,
      syncError: null,
      lastOrder: null,
      setServerCart: (cart) =>
        set(() => ({
          items: cart.items.map((item) => ({
            id: item.productId,
            title: item.title,
            image: item.image,
            price: item.price,
            qty: item.qty,
          })),
          subtotal: cart.subtotal,
          tax: cart.tax,
          total: cart.total,
          itemCount: cart.itemCount,
          syncError: null,
        })),
      loadServerCart: async () => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        set({ isServerSyncing: true });
        try {
          const cart = await getCart();
          get().setServerCart(cart);
          set({ ownerUserId: user._id });
        } catch (error) {
          set({ syncError: error instanceof Error ? error.message : "Cart could not be loaded." });
          throw error;
        } finally {
          set({ isServerSyncing: false });
        }
      },
      syncServerCart: async () => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        set({ isServerSyncing: true });
        try {
          const cart = await pushServerCart(get().items);
          if (cart) {
            get().setServerCart(cart);
            set({ ownerUserId: user._id });
          }
        } catch (error) {
          set({ syncError: error instanceof Error ? error.message : "Cart could not be synced." });
          throw error;
        } finally {
          set({ isServerSyncing: false });
        }
      },
      mergeServerCart: async () => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        set({ isServerSyncing: true });
        try {
          const cart = await mergeCart(toServerPayload(get().items));
          get().setServerCart(cart);
          set({ ownerUserId: user._id });
        } catch (error) {
          set({ syncError: error instanceof Error ? error.message : "Cart could not be merged." });
          throw error;
        } finally {
          set({ isServerSyncing: false });
        }
      },
      isSaved: (id) => get().saved.some((item) => item.id === id),
      addItem: (product, qty = 1) => {
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);
          const nextQty = clampQty((existing?.qty ?? 0) + qty);
          const items = existing
            ? state.items.map((item) =>
                item.id === product.id ? { ...item, qty: nextQty } : item
              )
            : [
                ...state.items,
                { id: product.id, title: product.title, image: product.image, price: product.price, qty: clampQty(qty) },
              ];

          return {
            items,
            saved: state.saved.filter((item) => item.id !== product.id),
            ...buildLocalTotals(items),
            syncError: null,
          };
        });
        const user = useAuthStore.getState().user;
        if (user) {
          get().claimOwnership(user._id);
        }
        if (user) {
          void enqueueCartMutation(async () => {
            await get().syncServerCart();
          });
        }
      },
      removeItem: (id) => {
        const items = get().items.filter((item) => item.id !== id);
        set(() => ({
          items,
          ...buildLocalTotals(items),
          syncError: null,
        }));
        if (useAuthStore.getState().user) {
          void enqueueCartMutation(async () => {
            await get().syncServerCart();
          });
        }
      },
      updateQty: (id, qty) => {
        const items = get().items.map((item) => (item.id === id ? { ...item, qty: clampQty(qty) } : item));
        set(() => ({
          items,
          ...buildLocalTotals(items),
          syncError: null,
        }));
        if (useAuthStore.getState().user) {
          void enqueueCartMutation(async () => {
            await get().syncServerCart();
          });
        }
      },
      clearCart: () => {
        set(() => ({
          items: [],
          ...buildLocalTotals([]),
          syncError: null,
        }));
        if (useAuthStore.getState().user) {
          void enqueueCartMutation(async () => {
            set({ isServerSyncing: true });
            try {
              const cart = await clearServerCart();
              get().setServerCart(cart);
            } catch (error) {
              set({ syncError: error instanceof Error ? error.message : "Cart could not be cleared." });
            } finally {
              set({ isServerSyncing: false });
            }
          });
        }
      },
      saveProduct: (product) => {
        set((state) => {
          if (state.saved.some((item) => item.id === product.id)) return state;
          return { saved: [...state.saved, toSavedProduct(product)], syncError: null };
        });
        const user = useAuthStore.getState().user;
        if (user) {
          get().claimOwnership(user._id);
        }
      },
      removeSaved: (id) => set((state) => ({ saved: state.saved.filter((item) => item.id !== id), syncError: null })),
      moveToSaved: (id) => {
        set((state) => {
          const item = state.items.find((entry) => entry.id === id);
          if (!item) return state;
          const nextSaved = state.saved.some((entry) => entry.id === id)
            ? state.saved
            : [...state.saved, { id: item.id, title: item.title, image: item.image, price: item.price }];
          const items = state.items.filter((entry) => entry.id !== id);
          return {
            items,
            saved: nextSaved,
            ...buildLocalTotals(items),
            syncError: null,
          };
        });
        if (useAuthStore.getState().user) {
          void enqueueCartMutation(async () => {
            await get().syncServerCart();
          });
        }
      },
      moveToCart: (id) => {
        set((state) => {
          const savedItem = state.saved.find((entry) => entry.id === id);
          if (!savedItem) return state;
          const existing = state.items.find((entry) => entry.id === id);
          const nextQty = clampQty((existing?.qty ?? 0) + 1);
          const items = existing
            ? state.items.map((entry) => (entry.id === id ? { ...entry, qty: nextQty } : entry))
            : [...state.items, { ...savedItem, qty: 1 }];
          return {
            saved: state.saved.filter((entry) => entry.id !== id),
            items,
            ...buildLocalTotals(items),
            syncError: null,
          };
        });
        if (useAuthStore.getState().user) {
          void enqueueCartMutation(async () => {
            await get().syncServerCart();
          });
        }
      },
      checkout: async (couponCode) => {
        if (!useAuthStore.getState().user) {
          throw new Error("Please sign in to complete checkout.");
        }

        set({ isServerSyncing: true });
        try {
          await waitForCartQueue();
          const order = await checkoutCart(couponCode);
          set(() => ({
            items: [],
            subtotal: 0,
            tax: 0,
            total: 0,
            itemCount: 0,
            syncError: null,
            lastOrder: order,
          }));
          return order;
        } catch (error) {
          set({ syncError: error instanceof Error ? error.message : "Checkout failed." });
          throw error;
        } finally {
          set({ isServerSyncing: false });
        }
      },
      clearLastOrder: () => set({ lastOrder: null }),
      claimOwnership: (userId) => set({ ownerUserId: userId }),
      resetAfterSignOut: () =>
        set({
          items: [],
          saved: [],
          ownerUserId: null,
          subtotal: 0,
          tax: 0,
          total: 0,
          itemCount: 0,
          isServerSyncing: false,
          syncError: null,
          lastOrder: null,
        }),
      resetForUserSwitch: (userId) =>
        set({
          items: [],
          saved: [],
          ownerUserId: userId,
          subtotal: 0,
          tax: 0,
          total: 0,
          itemCount: 0,
          isServerSyncing: false,
          syncError: null,
          lastOrder: null,
        }),
    }),
    {
      name: "frontend-cart-store",
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const totals = buildLocalTotals(state.items);
        state.subtotal = totals.subtotal;
        state.tax = totals.tax;
        state.total = totals.total;
        state.itemCount = totals.itemCount;
      },
    }
  )
);
