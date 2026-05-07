"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("search") ?? "";

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const rawValue = formData.get("search");
    const nextQuery = typeof rawValue === "string" ? rawValue.trim() : "";
    const params = new URLSearchParams(searchParams.toString());
    if (nextQuery) {
      params.set("search", nextQuery);
    } else {
      params.delete("search");
    }
    params.delete("page");
    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      className="order-3 flex h-10 w-full max-w-[920px] flex-1 overflow-hidden rounded-[8px] border-2 border-[#5e95d8] bg-white md:order-none"
    >
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa1ac]" />
        <input
          name="search"
          type="search"
          placeholder="Search products, brands, or categories"
          aria-label="Search products"
          defaultValue={query}
          key={query}
          className="h-full w-full border-0 pl-9 pr-3 text-[14px] text-[#616975] placeholder:text-[#9aa1ac] focus:outline-none sm:px-[14px] sm:pl-10 sm:text-[16px]"
        />
      </div>
      <button
        type="submit"
        className="w-[96px] bg-[#2f8ef6] text-[14px] font-semibold text-white transition hover:bg-[#2383ee] sm:text-[16px]"
      >
        Search
      </button>
    </form>
  );
}
