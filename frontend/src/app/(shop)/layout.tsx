import type { ReactNode } from "react";
import Header from "@/components/shared/header";
import Navbar from "@/components/shared/navbar";

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-white px-3 py-2 text-sm font-semibold text-[#127fff] focus:not-sr-only focus:absolute focus:left-3 focus:top-3"
      >
        Skip to main content
      </a>
      <Header />
      <Navbar />
      <main id="main-content">{children}</main>
    </div>
  );
}
