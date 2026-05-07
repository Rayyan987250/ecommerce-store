"use client";

import Link from "next/link";

type AppErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppError({ reset }: AppErrorProps) {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-[960px] items-center justify-center px-4 py-10">
      <section className="w-full rounded-md border border-[#ffd6d6] bg-white p-8 text-center">
        <h1 className="text-2xl font-semibold text-[#1c1c1c]">Something went wrong</h1>
        <p className="mt-2 text-[14px] text-[#6c788a]">
          We could not load this page. Please retry, or return to the homepage.
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-md bg-[#127fff] px-4 py-2 text-[14px] font-semibold text-white hover:bg-[#0f73e6]"
          >
            Retry
          </button>
          <Link href="/" className="rounded-md border border-[#d9dfe7] px-4 py-2 text-[14px] font-semibold text-[#1c1c1c]">
            Go home
          </Link>
        </div>
      </section>
    </main>
  );
}
