"use client";

import { useSystemStatusQuery } from "@/services/queries/system";
import { Database, Package, ShoppingCart, Users } from "lucide-react";
import Link from "next/link";

const cards = [
  { key: "users", label: "Users", Icon: Users },
  { key: "products", label: "Products", Icon: Package },
  { key: "carts", label: "Active carts", Icon: ShoppingCart },
  { key: "orders", label: "Orders", Icon: Database },
] as const;

export default function AdminDashboard() {
  const systemQuery = useSystemStatusQuery();
  const stats = systemQuery.data;

  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ key, label, Icon }) => (
          <article key={key} className="rounded-2xl border border-[#dde5ef] bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7b8aa0]">{label}</p>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#edf4ff] text-[#127fff]">
                <Icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-4 text-[34px] font-semibold text-[#10233d]">
              {systemQuery.isLoading ? "..." : stats?.[key] ?? 0}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <article className="rounded-2xl border border-[#dde5ef] bg-white p-5">
          <h2 className="text-[20px] font-semibold text-[#10233d]">Environment status</h2>
          <div className="mt-4 space-y-3 text-[14px] text-[#505050]">
            <div className="flex items-center justify-between rounded-xl bg-[#f6f9fc] px-4 py-3">
              <span>Database</span>
              <span className="font-semibold text-[#0f8c4c]">{stats?.database ?? "connected"}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[#f6f9fc] px-4 py-3">
              <span>Last DB timestamp</span>
              <span className="font-semibold text-[#10233d]">{stats?.databaseTime ?? "Unavailable"}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[#f6f9fc] px-4 py-3">
              <span>Polling status</span>
              <span className="font-semibold text-[#10233d]">
                {systemQuery.isFetching ? "Refreshing..." : "Healthy"}
              </span>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-[#dde5ef] bg-white p-5">
          <h2 className="text-[20px] font-semibold text-[#10233d]">Next actions</h2>
          <div className="mt-4 space-y-3 text-[14px] text-[#505050]">
            <p className="rounded-xl bg-[#f6f9fc] px-4 py-3">
              Manage live catalog entries, pricing, images, and merchandising from the products panel.
            </p>
            <p className="rounded-xl bg-[#f6f9fc] px-4 py-3">
              Checkout is now persisted server-side, so new orders and cart activity will appear in these counts.
            </p>
            <Link
              href="/admin/products"
              className="inline-flex rounded-xl bg-[#127fff] px-4 py-2 text-[14px] font-semibold text-white hover:bg-[#0f73e6]"
            >
              Open product manager
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}
