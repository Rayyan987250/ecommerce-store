"use client";

import AuthField from "@/components/auth/auth-field";
import AuthShell from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import {
  useConfirmPasswordResetMutation,
  useRequestPasswordResetMutation,
} from "@/services/queries/auth";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type TouchedState = {
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
};

function ResetPasswordPageContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const isConfirmMode = token.length > 0;

  const requestMutation = useRequestPasswordResetMutation();
  const confirmMutation = useConfirmPasswordResetMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState<TouchedState>({
    email: false,
    password: false,
    confirmPassword: false,
  });

  const errors = useMemo(() => {
    if (!isConfirmMode) {
      return {
        email: !touched.email
          ? ""
          : !email.trim()
            ? "Enter the email you use to sign in."
            : !emailPattern.test(email.trim())
              ? "Enter a valid email address."
              : "",
        password: "",
        confirmPassword: "",
      };
    }

    return {
      email: "",
      password: !touched.password
        ? ""
        : !password
          ? "Enter your new password."
          : password.length < 8
            ? "Password must be at least 8 characters."
            : "",
      confirmPassword: !touched.confirmPassword
        ? ""
        : !confirmPassword
          ? "Please confirm your new password."
          : confirmPassword !== password
            ? "Passwords do not match."
            : "",
    };
  }, [confirmPassword, email, isConfirmMode, password, touched]);

  const canSubmit = isConfirmMode
    ? password.length >= 8 && confirmPassword === password
    : emailPattern.test(email.trim());

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isConfirmMode) {
      setTouched((current) => ({ ...current, password: true, confirmPassword: true }));
      if (!canSubmit) return;
      confirmMutation.mutate({ token, password });
      return;
    }

    setTouched((current) => ({ ...current, email: true }));
    if (!canSubmit) return;
    requestMutation.mutate(email.trim());
  };

  return (
    <AuthShell
      title={isConfirmMode ? "Create a new password" : "Reset your password"}
      alternateText="Remembered it?"
      alternateLabel="Sign in"
      alternateHref="/login"
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {!isConfirmMode ? (
          <AuthField
            id="reset-email"
            label="Email"
            type="email"
            value={email}
            onChange={(value) => {
              setEmail(value);
              requestMutation.reset();
            }}
            onBlur={() => setTouched((current) => ({ ...current, email: true }))}
            error={errors.email}
            isValid={touched.email && !errors.email && emailPattern.test(email.trim())}
            autoComplete="email"
          />
        ) : (
          <>
            <AuthField
              id="reset-password"
              label="New password"
              type="password"
              value={password}
              onChange={(value) => {
                setPassword(value);
                confirmMutation.reset();
              }}
              onBlur={() => setTouched((current) => ({ ...current, password: true }))}
              error={errors.password}
              isValid={touched.password && !errors.password && password.length >= 8}
              autoComplete="new-password"
            />
            <AuthField
              id="reset-confirm-password"
              label="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={(value) => {
                setConfirmPassword(value);
                confirmMutation.reset();
              }}
              onBlur={() => setTouched((current) => ({ ...current, confirmPassword: true }))}
              error={errors.confirmPassword}
              isValid={touched.confirmPassword && !errors.confirmPassword && confirmPassword === password && confirmPassword.length > 0}
              autoComplete="new-password"
            />
          </>
        )}

        <Button
          type="submit"
          disabled={!canSubmit || requestMutation.isPending || confirmMutation.isPending}
          className="h-12 w-full rounded-2xl border-[#127fff] bg-[#127fff] text-[15px] font-semibold text-white shadow-[0_12px_28px_rgba(18,127,255,0.20)] hover:bg-[#0f73e6]"
          icon={<ArrowRight className="h-3.5 w-3.5" />}
          iconPosition="right"
        >
          {isConfirmMode
            ? confirmMutation.isPending
              ? "Updating password..."
              : "Update password"
            : requestMutation.isPending
              ? "Generating reset link..."
              : "Send reset link"}
        </Button>

        {requestMutation.data ? (
          <div className="rounded-2xl border border-[#cce7d1] bg-[#f3fcf5] px-4 py-3 text-[13px] font-medium text-[#1e7b37]">
            <p>{requestMutation.data.message}</p>
            <p className="mt-2 text-[#5f6f84]">If email delivery is configured, the reset instructions will be sent there.</p>
          </div>
        ) : null}

        {confirmMutation.data ? (
          <div className="rounded-2xl border border-[#cce7d1] bg-[#f3fcf5] px-4 py-3 text-[13px] font-medium text-[#1e7b37]">
            <p>{confirmMutation.data.message}</p>
            <p className="mt-2">
              <Link href="/login" className="text-[#127fff] underline">
                Continue to sign in
              </Link>
            </p>
          </div>
        ) : null}

        {requestMutation.error ? (
          <p className="rounded-2xl border border-[#ffd6d6] bg-[#fff5f5] px-4 py-3 text-[13px] font-medium text-[#d63b42]">
            {requestMutation.error.message || "Reset request failed. Please try again."}
          </p>
        ) : null}

        {confirmMutation.error ? (
          <p className="rounded-2xl border border-[#ffd6d6] bg-[#fff5f5] px-4 py-3 text-[13px] font-medium text-[#d63b42]">
            {confirmMutation.error.message || "Password reset failed. Please try again."}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7fafc]" />}>
      <ResetPasswordPageContent />
    </Suspense>
  );
}
