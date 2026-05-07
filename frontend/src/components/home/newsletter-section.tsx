"use client";

import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";
import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const { message, showToast } = useToast();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      showToast("Enter an email address to subscribe.");
      return;
    }
    showToast(`Subscribed ${email} to product updates.`);
    setEmail("");
  };

  return (
    <section className="rounded-md border border-[#e3e6eb] bg-[#eff2f4] px-4 py-8 text-center sm:px-6">
      <h3 className="text-[30px] font-semibold leading-tight text-[#1c1c1c] sm:text-[36px]">
        Subscribe on our newsletter
      </h3>
      <p className="mt-1 text-[15px] text-[#505050] sm:text-[18px]">
        Get daily news on upcoming offers from many suppliers all over the world
      </p>

      <form onSubmit={onSubmit} className="mx-auto mt-4 flex max-w-[520px] flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="newsletter-email">
          Email
        </label>
        <div className="relative flex-1">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b96a5]" />
          <input
            id="newsletter-email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-11 w-full rounded-md border border-[#d9dfe7] bg-white pl-9 pr-3 text-[16px] text-[#1c1c1c] placeholder:text-[#8b96a5] transition-colors hover:border-[#a9c7f1] focus:outline-none focus:ring-2 focus:ring-[#127fff]/25"
          />
        </div>
        <button
          type="submit"
          className="h-11 rounded-md bg-gradient-to-b from-[#2f8ef6] to-[#0d6efd] px-5 text-[16px] font-medium text-white transition-all duration-150 hover:-translate-y-[1px] hover:from-[#2a86ee] hover:to-[#0b63d8] hover:shadow-sm"
        >
          Subscribe
        </button>
      </form>
      {message ? <p className="mt-3 text-[14px] font-medium text-[#127fff]">{message}</p> : null}
    </section>
  );
}
