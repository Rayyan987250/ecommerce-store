"use client";

import { getOrders } from "@/services/cart";
import { useSessionQuery } from "@/services/queries/auth";
import { useCurrencyPricing } from "@/hooks/use-currency-pricing";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
  const { formatPrice } = useCurrencyPricing();
  const sessionQuery = useSessionQuery();
  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    enabled: Boolean(sessionQuery.data),
  });

  if (sessionQuery.isLoading) {
    return (
      <section className="rounded-2xl border border-[#dde5ef] bg-white p-8 text-center text-[#505050]">
        Loading your account...
      </section>
    );
  }

  if (!sessionQuery.data) {
    return (
      <section className="rounded-2xl border border-[#dde5ef] bg-white p-8 text-center">
        <h1 className="text-[30px] font-semibold text-[#10233d]">Sign in to view your account</h1>
        <p className="mt-2 text-[14px] text-[#5f6f84]">
          Your recent orders and account details will appear here after login.
        </p>
        <Link
          href="/login?next=/account"
          className="mt-5 inline-flex rounded-xl bg-[#127fff] px-4 py-2 text-[14px] font-semibold text-white hover:bg-[#0f73e6]"
        >
          Go to login
        </Link>
      </section>
    );
  }

  const orders = ordersQuery.data ?? [];

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-[#dde5ef] bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#7b8aa0]">Account</p>
            <h1 className="mt-1 text-[30px] font-semibold text-[#10233d]">{sessionQuery.data.name}</h1>
            <p className="mt-1 text-[14px] text-[#5f6f84]">{sessionQuery.data.email}</p>
          </div>
          <div className="grid min-w-[220px] gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#f6f9fc] p-4">
              <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7b8aa0]">Role</p>
              <p className="mt-2 text-[18px] font-semibold text-[#10233d]">
                {sessionQuery.data.isAdmin ? "Administrator" : "Customer"}
              </p>
            </div>
            <div className="rounded-2xl bg-[#f6f9fc] p-4">
              <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7b8aa0]">Orders</p>
              <p className="mt-2 text-[18px] font-semibold text-[#10233d]">{orders.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#dde5ef] bg-white p-5">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-[#127fff]" />
          <h2 className="text-[22px] font-semibold text-[#10233d]">Order history</h2>
        </div>

        {ordersQuery.isLoading ? (
          <div className="mt-5 flex items-center gap-2 text-[14px] text-[#5f6f84]">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading your orders...
          </div>
        ) : ordersQuery.isError ? (
          <div className="mt-5 rounded-2xl border border-[#ffd6d6] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#d63b42]">
            {ordersQuery.error.message || "Orders could not be loaded."}
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-[#d8e2ef] bg-[#fbfdff] p-8 text-center">
            <Package className="mx-auto h-10 w-10 text-[#8ea0b7]" />
            <p className="mt-3 text-[16px] font-semibold text-[#10233d]">No orders yet</p>
            <p className="mt-1 text-[14px] text-[#5f6f84]">
              Add products to your cart and complete checkout to see them here.
            </p>
            <Link
              href="/products"
              className="mt-5 inline-flex rounded-xl bg-[#127fff] px-4 py-2 text-[14px] font-semibold text-white hover:bg-[#0f73e6]"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {orders.map((order) => (
              <article key={order.id} className="rounded-2xl border border-[#e4ebf3] bg-[#fbfdff] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[16px] font-semibold text-[#10233d]">Order #{order.id}</p>
                    <p className="mt-1 text-[13px] text-[#6b7b90]">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[16px] font-semibold text-[#10233d]">{formatPrice(order.total)}</p>
                    <p className="mt-1 text-[13px] capitalize text-[#5f6f84]">
                      {order.status} • {order.itemCount} item{order.itemCount === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {order.items.map((item, index) => (
                    <div key={`${order.id}-${item.productId ?? index}`} className="rounded-xl border border-[#e8edf3] bg-white px-3 py-2">
                      <p className="text-[14px] font-semibold text-[#10233d]">{item.title}</p>
                      <p className="mt-1 text-[13px] text-[#5f6f84]">
                        {item.qty} x {formatPrice(item.price)} = {formatPrice(item.lineTotal)}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
