"use client";

import CartItem from "@/components/cart/cart-item";
import HomeFooterSection from "@/components/home/home-footer-section";
import { useCurrencyPricing } from "@/hooks/use-currency-pricing";
import { useSessionQuery } from "@/services/queries/auth";
import { useCartStore } from "@/store/use-cart-store";
import { ChevronLeft, Lock, MessageCircle, ShoppingCart, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const trustBadges = [
  { title: "Secure payment", text: "Your data is protected", Icon: Lock },
  { title: "Customer support", text: "24/7 dedicated team", Icon: MessageCircle },
  { title: "Free delivery", text: "On qualifying orders", Icon: Truck },
];

export default function CartPage() {
  const { formatPrice } = useCurrencyPricing();
  const router = useRouter();
  const sessionQuery = useSessionQuery();
  const items = useCartStore((state) => state.items);
  const savedItems = useCartStore((state) => state.saved);
  const removeItem = useCartStore((state) => state.removeItem);
  const moveToSaved = useCartStore((state) => state.moveToSaved);
  const moveToCart = useCartStore((state) => state.moveToCart);
  const updateQty = useCartStore((state) => state.updateQty);
  const clearCart = useCartStore((state) => state.clearCart);
  const removeSaved = useCartStore((state) => state.removeSaved);
  const checkout = useCartStore((state) => state.checkout);
  const isServerSyncing = useCartStore((state) => state.isServerSyncing);
  const syncError = useCartStore((state) => state.syncError);
  const lastOrder = useCartStore((state) => state.lastOrder);
  const clearLastOrder = useCartStore((state) => state.clearLastOrder);
  const [couponDraft, setCouponDraft] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  const subtotal = useMemo(() => items.reduce((total, item) => total + item.price * item.qty, 0), [items]);
  const discount = appliedCoupon === "SAVE10" ? subtotal * 0.1 : 0;
  const taxableSubtotal = Math.max(subtotal - discount, 0);
  const tax = taxableSubtotal > 0 ? taxableSubtotal * 0.05 : 0;
  const total = taxableSubtotal + tax;

  const onApplyCoupon = () => {
    const normalizedCoupon = couponDraft.trim().toUpperCase();
    if (normalizedCoupon === "SAVE10") {
      setAppliedCoupon(normalizedCoupon);
      setCouponMessage("Coupon applied successfully.");
      return;
    }

    setAppliedCoupon(null);
    setCouponMessage("Invalid coupon code.");
  };

  const onCheckout = async () => {
    if (!sessionQuery.data) {
      setCouponMessage("Please sign in before checkout.");
      router.push("/login?next=/cart");
      return;
    }

    try {
      await checkout(appliedCoupon ?? undefined);
      setCouponMessage("Order placed successfully.");
      setCouponDraft("");
      setAppliedCoupon(null);
    } catch (error) {
      setCouponMessage(error instanceof Error ? error.message : "Checkout failed.");
    }
  };

  return (
    <section className="space-y-5">
      <h1 className="text-[30px] font-semibold text-[#1c1c1c]">My cart ({items.length})</h1>

      {syncError ? (
        <div className="rounded-md border border-[#ffd6d6] bg-white px-4 py-3 text-[14px] text-[#d63b42]">
          {syncError}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <div className="rounded-md border border-[#e3e6eb] bg-white p-3">
          {items.length === 0 ? (
            <div className="py-8 text-center">
              <ShoppingCart className="mx-auto mb-3 h-12 w-12 text-[#8b96a5]" />
              <p className="text-[16px] text-[#505050]">Your cart is empty</p>
              <Link href="/products" className="mt-2 inline-block text-[14px] font-semibold text-[#127fff] hover:underline">
                Continue shopping
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={removeItem}
                onSaveForLater={moveToSaved}
                onQtyChange={updateQty}
              />
            ))
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <Link href="/products" className="ui-button-pop inline-flex items-center gap-1 rounded-md bg-[#127fff] px-3 py-2 text-[14px] font-semibold text-white hover:bg-[#0f73e6]">
              <ChevronLeft className="h-4 w-4" />
              Back to shop
            </Link>
            <button type="button" onClick={clearCart} className="ui-button-pop rounded-md border border-[#d9dfe7] px-3 py-2 text-[14px] font-semibold text-[#127fff] hover:bg-[#f7fbff]">
              Remove all
            </button>
          </div>
        </div>

        <aside className="space-y-3">
          <div className="rounded-md border border-[#e3e6eb] bg-white p-4">
            <h3 className="mb-2 text-[16px] font-semibold text-[#505050]">Have a coupon?</h3>
            <div className="flex">
              <input
                value={couponDraft}
                onChange={(event) => {
                  setCouponDraft(event.target.value);
                  setCouponMessage(null);
                }}
                placeholder="Try SAVE10"
                className="h-10 flex-1 rounded-l-md border border-r-0 border-[#d9dfe7] px-3 text-[14px] focus:outline-none"
              />
              <button type="button" onClick={onApplyCoupon} className="ui-button-pop h-10 rounded-r-md border border-[#d9dfe7] px-4 text-[14px] font-semibold text-[#127fff] hover:bg-[#f7fbff]">
                Apply
              </button>
            </div>
            {couponMessage ? <p className="mt-2 text-[13px] text-[#127fff]">{couponMessage}</p> : null}
          </div>

          <div className="rounded-md border border-[#e3e6eb] bg-white p-4">
            <div className="space-y-2 border-b border-[#eff2f4] pb-3 text-[15px] text-[#505050]">
              <div className="flex justify-between"><span>Subtotal:</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span>Discount:</span><span className="text-[#fa3434]">- {formatPrice(discount)}</span></div>
              <div className="flex justify-between"><span>Tax:</span><span className="text-[#00b517]">+ {formatPrice(tax)}</span></div>
            </div>
            <div className="mt-3 flex items-center justify-between text-[20px] font-semibold text-[#1c1c1c]">
              <span>Total:</span>
              <span>{formatPrice(total)}</span>
            </div>
            <button
              type="button"
              onClick={onCheckout}
              disabled={items.length === 0 || isServerSyncing}
              className="ui-button-pop mt-4 h-11 w-full rounded-md bg-[#00b517] text-[18px] font-semibold text-white transition hover:bg-[#00a114] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isServerSyncing ? "Processing..." : sessionQuery.data ? "Checkout" : "Sign in to checkout"}
            </button>
            <div className="mt-3 flex items-center gap-2 text-[12px] text-[#8b96a5]">
              <span className="rounded bg-[#f2f5f7] px-2 py-1">VISA</span>
              <span className="rounded bg-[#f2f5f7] px-2 py-1">Mastercard</span>
              <span className="rounded bg-[#f2f5f7] px-2 py-1">PayPal</span>
            </div>
          </div>
        </aside>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {trustBadges.map((badge) => (
          <div key={badge.title} className="flex items-center gap-2 rounded-md bg-[#eff2f4] px-3 py-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#d9dfe7] text-[#8b96a5]">
              <badge.Icon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[14px] font-semibold text-[#1c1c1c]">{badge.title}</p>
              <p className="text-[13px] text-[#8b96a5]">{badge.text}</p>
            </div>
          </div>
        ))}
      </div>

      {lastOrder ? (
        <section className="rounded-md border border-[#cce7d1] bg-white p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-[20px] font-semibold text-[#1c1c1c]">Last order confirmed</h2>
              <p className="mt-1 text-[14px] text-[#1e7b37]">
                Order #{lastOrder.id} was placed for {formatPrice(lastOrder.total)}.
              </p>
            </div>
            <button
              type="button"
              onClick={clearLastOrder}
              className="rounded-md border border-[#d9dfe7] px-3 py-2 text-[13px] font-semibold text-[#505050] hover:bg-[#f7fbff]"
            >
              Dismiss
            </button>
          </div>
        </section>
      ) : null}

      {savedItems.length > 0 ? (
        <section className="rounded-md border border-[#e3e6eb] bg-white p-3">
          <h2 className="mb-3 text-[28px] font-semibold text-[#1c1c1c]">Saved for later</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {savedItems.map((item) => (
              <article key={item.id} className="rounded-md border border-[#e3e6eb] bg-white p-3 transition hover:shadow-sm">
                <div className="mb-3 flex h-[160px] items-center justify-center rounded border border-[#eff2f4] bg-[#fafafa]">
                  <Image src={item.image} alt={item.title} width={120} height={120} style={{ width: "auto", height: "auto" }} className="object-contain" />
                </div>
                <p className="text-[22px] font-semibold text-[#1c1c1c]">{formatPrice(item.price)}</p>
                <p className="mt-1 text-[14px] text-[#505050]">{item.title}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => moveToCart(item.id)}
                    className="ui-button-pop inline-flex items-center gap-1 rounded border border-[#d9dfe7] px-2 py-1 text-[13px] font-semibold text-[#127fff] hover:bg-[#f7fbff]"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Move to cart
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSaved(item.id)}
                    className="ui-button-pop rounded border border-[#d9dfe7] px-2 py-1 text-[13px] font-semibold text-[#505050] hover:bg-[#f7fbff]"
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <HomeFooterSection />
    </section>
  );
}
