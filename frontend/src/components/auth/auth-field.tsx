"use client";

import { Input } from "@/components/ui/input";
import { CheckCircle2, CircleAlert } from "lucide-react";

type AuthFieldProps = {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  isValid?: boolean;
  autoComplete?: string;
};

export default function AuthField({
  id,
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  isValid,
  autoComplete,
}: AuthFieldProps) {
  const hasValue = value.trim().length > 0;
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div className="space-y-1.5">
      <div className="group relative">
        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-4 z-10 origin-left rounded px-1 text-[13px] font-medium transition-all duration-150 ${
            hasValue
              ? "top-0 -translate-y-1/2 scale-[0.92] bg-white text-[#127fff]"
              : "top-1/2 -translate-y-1/2 scale-100 bg-transparent text-[#8a97aa] group-focus-within:top-0 group-focus-within:-translate-y-1/2 group-focus-within:scale-[0.92] group-focus-within:bg-white group-focus-within:text-[#127fff]"
          }`}
        >
          {label}
        </label>
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`h-14 rounded-2xl border bg-white px-4 pt-5 text-[15px] text-[#10233d] shadow-none transition focus:ring-4 ${
            error
              ? "border-[#f1b6b6] focus:border-[#e5484d] focus:ring-[#e5484d]/12"
              : isValid
                ? "border-[#bfe3ca] focus:border-[#1e9e52] focus:ring-[#1e9e52]/12"
                : "border-[#d9e1ea] focus:border-[#127fff] focus:ring-[#127fff]/12"
          }`}
        />
        {error ? (
          <CircleAlert className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#e5484d]" />
        ) : isValid ? (
          <CheckCircle2 className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1e9e52]" />
        ) : null}
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-[12px] font-medium text-[#d63b42]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
