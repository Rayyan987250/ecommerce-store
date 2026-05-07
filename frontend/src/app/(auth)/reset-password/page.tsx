"use client";

import AuthField from "@/components/auth/auth-field";
import AuthShell from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const error = useMemo(() => {
    if (!touched) return "";
    if (!email.trim()) return "Enter the email you use to sign in.";
    if (!emailPattern.test(email.trim())) return "Enter a valid email address.";
    return "";
  }, [email, touched]);

  const isValid = emailPattern.test(email.trim());

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    if (!isValid) return;

    setIsSubmitting(true);
    setIsSubmitted(false);

    await new Promise((resolve) => window.setTimeout(resolve, 700));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <AuthShell
      title="Reset your password"
      alternateText="Remembered it?"
      alternateLabel="Sign in"
      alternateHref="/login"
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <AuthField
          id="reset-email"
          label="Email"
          type="email"
          value={email}
          onChange={(value) => {
            setEmail(value);
            setIsSubmitted(false);
          }}
          onBlur={() => setTouched(true)}
          error={error}
          isValid={touched && !error && isValid}
          autoComplete="email"
        />

        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="h-12 w-full rounded-2xl border-[#127fff] bg-[#127fff] text-[15px] font-semibold text-white shadow-[0_12px_28px_rgba(18,127,255,0.20)] hover:bg-[#0f73e6]"
          icon={<ArrowRight className="h-3.5 w-3.5" />}
          iconPosition="right"
        >
          {isSubmitting ? "Sending reset link..." : "Send reset link"}
        </Button>

        {isSubmitted ? (
          <p className="rounded-2xl border border-[#cce7d1] bg-[#f3fcf5] px-4 py-3 text-[13px] font-medium text-[#1e7b37]">
            If an account exists for {email.trim()}, a reset link has been sent.
          </p>
        ) : null}
      </form>

      <div className="mt-6 text-center text-[13px] text-[#6b7280]">
        <Link href="/signup" className="font-medium text-[#127fff] transition hover:text-[#0f73e6] hover:underline">
          Need an account? Create one
        </Link>
      </div>
    </AuthShell>
  );
}
