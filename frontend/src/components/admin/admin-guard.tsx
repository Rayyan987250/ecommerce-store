"use client";

import { useSessionQuery } from "@/services/queries/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const sessionQuery = useSessionQuery();
  const pathname = usePathname();

  if (sessionQuery.isLoading) {
    return (
      <section className="rounded-2xl border border-[#d9e1ea] bg-white p-8 text-center text-[#505050]">
        Verifying admin access...
      </section>
    );
  }

  if (!sessionQuery.data) {
    return (
      <section className="rounded-2xl border border-[#ffd6d6] bg-white p-8 text-center">
        <h1 className="text-2xl font-semibold text-[#1c1c1c]">Admin sign-in required</h1>
        <p className="mt-2 text-[14px] text-[#6c788a]">
          Please sign in with an admin account to manage the storefront.
        </p>
        <Link
          href={`/login?next=${encodeURIComponent(pathname || "/admin")}`}
          className="mt-4 inline-block rounded-xl bg-[#127fff] px-4 py-2 text-[14px] font-semibold text-white hover:bg-[#0f73e6]"
        >
          Go to login
        </Link>
      </section>
    );
  }

  if (!sessionQuery.data.isAdmin) {
    return (
      <section className="rounded-2xl border border-[#ffd6d6] bg-white p-8 text-center">
        <h1 className="text-2xl font-semibold text-[#1c1c1c]">Admin access denied</h1>
        <p className="mt-2 text-[14px] text-[#6c788a]">
          This account is signed in, but it does not have admin privileges.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-xl border border-[#d9dfe7] px-4 py-2 text-[14px] font-semibold text-[#1c1c1c] hover:bg-[#f7fbff]"
        >
          Return to storefront
        </Link>
      </section>
    );
  }

  return <>{children}</>;
}
