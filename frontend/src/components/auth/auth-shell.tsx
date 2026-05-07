"use client";

import Link from "next/link";

type AuthShellProps = {
  title: string;
  alternateLabel: string;
  alternateHref: string;
  alternateText: string;
  children: React.ReactNode;
};

export default function AuthShell({
  title,
  alternateLabel,
  alternateHref,
  alternateText,
  children,
}: AuthShellProps) {
  return (
    <main className="auth-minimal min-h-screen px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center justify-center">
        <section className="auth-card auth-fade-up w-full rounded-[28px] border border-white/70 bg-white/92 p-8 shadow-[0_24px_72px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-10">
          <div className="mb-8 flex flex-col items-center">
            <Link href="/" className="auth-brand inline-flex items-center gap-3 rounded-full px-2 py-1 text-[#10233d]">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#127fff] text-sm font-semibold text-white shadow-[0_14px_30px_rgba(18,127,255,0.24)]">
                B
              </span>
              <span className="text-[15px] font-semibold tracking-[-0.02em]">Brand</span>
            </Link>
            <h1 className="mt-6 text-center text-[30px] font-semibold tracking-[-0.04em] text-[#10233d] sm:text-[34px]">
              {title}
            </h1>
          </div>

          {children}

          <div className="mt-8 text-center text-[14px] text-[#66758a]">
            {alternateText}{" "}
            <Link href={alternateHref} className="font-semibold text-[#127fff] transition hover:text-[#0f73e6]">
              {alternateLabel}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
