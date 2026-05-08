// Header.tsx
"use client";

import SearchBar from "@/components/shared/search-bar";
import { useLogoutMutation, useSessionQuery } from "@/services/queries/auth";
import { useCartStore } from "@/store/use-cart-store";
import { Heart, LogOut, MessageSquare, ShieldCheck, ShoppingBag, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState, type ReactNode } from "react";

const cartPersist = useCartStore.persist;

const UserIcon = () => (
  <User className="h-5 w-5" strokeWidth={1.8} />
);

const MessageIcon = () => (
  <MessageSquare className="h-5 w-5" strokeWidth={1.8} />
);

const HeartIcon = () => (
  <Heart className="h-5 w-5" strokeWidth={1.8} />
);

const CartIcon = () => (
  <ShoppingCart className="h-5 w-5" strokeWidth={1.8} />
);

const AdminIcon = () => (
  <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />
);

const LogoutIcon = () => (
  <LogOut className="h-5 w-5" strokeWidth={1.8} />
);

const BagLogo = () => (
  <ShoppingBag className="h-5 w-5 text-white" strokeWidth={1.8} />
);

const ActionItem = ({
  icon,
  label,
  href,
  badge,
}: {
  icon: ReactNode;
  label: string;
  href: string;
  badge?: number;
}) => (
  <Link
    href={href}
    className="ui-link-motion relative flex min-w-[56px] flex-col items-center gap-[2px] rounded-md px-1 text-[#8f96a1] transition-all duration-150 hover:bg-[#f1f4f9] hover:text-[#0d6efd] sm:min-w-[60px]"
  >
    <span className="transition-colors duration-150">{icon}</span>
    <span className="whitespace-nowrap text-[12px] leading-none">{label}</span>
    {badge ? (
      <span className="absolute right-0 top-0 inline-flex min-w-5 items-center justify-center rounded-full bg-[#127fff] px-1 text-[10px] font-semibold text-white">
        {badge}
      </span>
    ) : null}
  </Link>
);

function useCartHydrated() {
  const [hydrated, setHydrated] = useState(() => cartPersist?.hasHydrated?.() ?? false);

  useEffect(() => {
    if (!cartPersist?.onFinishHydration) {
      return;
    }

    const unsubscribe = cartPersist.onFinishHydration(() => setHydrated(true));
    return unsubscribe;
  }, []);

  return hydrated;
}

export default function Header() {
  const hydrated = useCartHydrated();
  const sessionQuery = useSessionQuery();
  const logoutMutation = useLogoutMutation();
  const cartCount = useCartStore((state) => state.items.reduce((total, item) => total + item.qty, 0));
  const savedCount = useCartStore((state) => state.saved.length);
  const badgeCartCount = hydrated ? cartCount : 0;
  const badgeSavedCount = hydrated ? savedCount : 0;
  const user = sessionQuery.data;

  return (
    <header className="w-full border-b border-[#e1e1e1] bg-[#ececec] py-3 md:py-4">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-3 sm:px-4 md:flex-row md:items-center md:gap-[18px] md:px-[22px]">
        {/* Brand */}
        <Link href="/" className="inline-flex min-w-[128px] items-center gap-[10px] no-underline">
          <span className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[8px] bg-[#5f95e9]">
            <BagLogo />
          </span>
          <span className="text-[34px] font-bold leading-none tracking-[-0.3px] text-[#82a6dc] sm:text-[38px]">Brand</span>
        </Link>

        {/* Search */}
        <Suspense fallback={<div className="order-3 h-10 w-full max-w-[920px] flex-1 rounded-[8px] border-2 border-[#5e95d8] bg-white md:order-none" />}>
          <SearchBar />
        </Suspense>

        {/* Right actions */}
        <nav className="hidden items-center gap-2 self-end sm:flex md:gap-[14px] lg:gap-[22px]" aria-label="Quick links">
          <ActionItem icon={<UserIcon />} label={user ? "Account" : "Profile"} href={user ? (user.isAdmin ? "/admin" : "/account") : "/login"} />
          {user?.isAdmin ? <ActionItem icon={<AdminIcon />} label="Admin" href="/admin/products" /> : <ActionItem icon={<MessageIcon />} label="Message" href="/login" />}
          <ActionItem icon={<HeartIcon />} label="Saved" href="/cart" badge={badgeSavedCount} />
          <ActionItem icon={<CartIcon />} label="My cart" href="/cart" badge={badgeCartCount} />
          {user ? (
            <button
              type="button"
              onClick={() => logoutMutation.mutate()}
              className="ui-link-motion inline-flex items-center gap-2 rounded-md px-2 py-1 text-[13px] font-semibold text-[#505050] transition hover:bg-[#f1f4f9] hover:text-[#0d6efd]"
            >
              <LogoutIcon />
              {logoutMutation.isPending ? "Signing out..." : "Logout"}
            </button>
          ) : null}
        </nav>
        <nav className="flex items-center gap-2 self-end sm:hidden" aria-label="Mobile quick links">
          <ActionItem icon={<UserIcon />} label={user ? "Account" : "Profile"} href={user ? (user.isAdmin ? "/admin" : "/account") : "/login"} />
          {user?.isAdmin ? <ActionItem icon={<AdminIcon />} label="Admin" href="/admin" /> : null}
          <ActionItem icon={<HeartIcon />} label="Saved" href="/cart" badge={badgeSavedCount} />
          <ActionItem icon={<CartIcon />} label="Cart" href="/cart" badge={badgeCartCount} />
        </nav>
      </div>
    </header>
  );
}
