import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "ui-focus-field h-11 w-full rounded-md border border-[#d9dfe7] bg-white px-3 text-[15px] text-[#1c1c1c] outline-none transition focus:border-[#127fff] focus:ring-2 focus:ring-[#127fff]/20",
        className
      )}
      {...props}
    />
  );
}
