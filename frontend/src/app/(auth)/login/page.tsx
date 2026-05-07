"use client";

import AuthField from "@/components/auth/auth-field";
import AuthShell from "@/components/auth/auth-shell";
import { useAuthForm } from "@/components/auth/use-auth-form";
import { Button } from "@/components/ui/button";
import { useLoginMutation } from "@/services/queries/auth";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const mutation = useLoginMutation();
  const form = useAuthForm("login");

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    form.touchField("email");
    form.touchField("password");
    if (!form.isValid) return;
    mutation.mutate({
      email: form.values.email,
      password: form.values.password,
    });
  };

  return (
    <AuthShell
      title="Sign in to your account"
      alternateText="Don&apos;t have an account?"
      alternateLabel="Sign up"
      alternateHref="/signup"
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <AuthField
          id="login-email"
          label="Email"
          type="email"
          value={form.values.email}
          onChange={(value) => {
            mutation.reset();
            form.setValue("email", value);
          }}
          onBlur={() => form.touchField("email")}
          error={form.showError("email")}
          isValid={form.showSuccess("email")}
          autoComplete="email"
        />
        <AuthField
          id="login-password"
          label="Password"
          type="password"
          value={form.values.password}
          onChange={(value) => {
            mutation.reset();
            form.setValue("password", value);
          }}
          onBlur={() => form.touchField("password")}
          error={form.showError("password")}
          isValid={form.showSuccess("password")}
          autoComplete="current-password"
        />

        <div className="flex justify-end">
          <Link href="/reset-password" className="text-[13px] font-medium text-[#127fff] transition hover:text-[#0f73e6] hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={!form.isValid || mutation.isPending}
          className="h-12 w-full rounded-2xl border-[#127fff] bg-[#127fff] text-[15px] font-semibold text-white shadow-[0_12px_28px_rgba(18,127,255,0.20)] hover:bg-[#0f73e6]"
          icon={<ArrowRight className="h-3.5 w-3.5" />}
          iconPosition="right"
        >
          {mutation.isPending ? "Signing in..." : "Sign in"}
        </Button>

        {mutation.data ? (
          <p className="rounded-2xl border border-[#cce7d1] bg-[#f3fcf5] px-4 py-3 text-[13px] font-medium text-[#1e7b37]">
            {mutation.data.message}
          </p>
        ) : null}
        {mutation.error ? (
          <p className="rounded-2xl border border-[#ffd6d6] bg-[#fff5f5] px-4 py-3 text-[13px] font-medium text-[#d63b42]">
            {mutation.error.message || "Sign in failed. Please try again."}
          </p>
        ) : null}
      </form>
    </AuthShell>
  );
}
