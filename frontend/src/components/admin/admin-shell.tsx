"use client";

import { useLogoutMutation, useSessionQuery } from "@/services/queries/auth";
import { LayoutDashboard, LogOut, PackageSearch, Store } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLink({
  href,
  label,
  active,
  icon,
}: {
  href: string;
  label: string;
  active: boolean;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[14px] font-semibold transition ${
        active ? "bg-[#127fff] text-white" : "text-[#505050] hover:bg-[#edf4ff] hover:text-[#127fff]"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

export default function AdminShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const sessionQuery = useSessionQuery();
  const logoutMutation = useLogoutMutation();

  return (
    <section className="mx-auto max-w-[1360px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[28px] border border-[#d7e0ea] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <header className="border-b border-[#e8edf3] bg-[linear-gradient(135deg,#f8fbff_0%,#eef5ff_58%,#f9fcff_100%)] px-5 py-5 sm:px-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#6b7b90]">
                Store Admin
              </p>
              <h1 className="mt-1 text-[28px] font-semibold text-[#10233d]">{title}</h1>
              <p className="mt-1 text-[14px] text-[#5f6f84]">
                Signed in as {sessionQuery.data?.email ?? "admin"}.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <NavLink
                href="/admin"
                label="Dashboard"
                active={pathname === "/admin"}
                icon={<LayoutDashboard className="h-4 w-4" />}
              />
              <NavLink
                href="/admin/products"
                label="Products"
                active={pathname === "/admin/products"}
                icon={<PackageSearch className="h-4 w-4" />}
              />
              <NavLink
                href="/"
                label="Storefront"
                active={false}
                icon={<Store className="h-4 w-4" />}
              />
              <button
                type="button"
                onClick={() => logoutMutation.mutate()}
                className="inline-flex items-center gap-2 rounded-xl border border-[#d9dfe7] px-3 py-2 text-[14px] font-semibold text-[#505050] hover:bg-[#f7fbff]"
              >
                <LogOut className="h-4 w-4" />
                {logoutMutation.isPending ? "Signing out..." : "Logout"}
              </button>
            </div>
          </div>
        </header>
        <div className="bg-[#f6f8fb] p-4 sm:p-6">{children}</div>
      </div>
    </section>
  );
}
