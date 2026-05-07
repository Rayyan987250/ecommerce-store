import { ChevronDown } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

type DropdownButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline";
  className?: string;
};

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const baseClasses =
  "inline-flex h-10 items-stretch overflow-hidden rounded-md border font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d6efd]/40 disabled:cursor-not-allowed disabled:opacity-60";

const variantClasses = {
  solid: "border-[#0d6efd] bg-gradient-to-b from-[#2f8ef6] to-[#0d6efd] text-white hover:from-[#2a86ee] hover:to-[#0b63d8]",
  outline: "border-[#d6dee8] bg-white text-[#0d6efd] hover:bg-[#f7fbff]",
};

const dividerClasses = {
  solid: "border-white/30",
  outline: "border-[#d6dee8]",
};

export function DropdownButton({
  variant = "solid",
  className,
  children,
  type = "button",
  ...props
}: DropdownButtonProps) {
  return (
    <button type={type} className={cn(baseClasses, variantClasses[variant], className)} {...props}>
      <span className="inline-flex items-center px-5 text-[16px]">{children}</span>
      <span
        className={cn(
          "inline-flex w-10 items-center justify-center border-l",
          dividerClasses[variant],
        )}
      >
        <ChevronDown className="h-4 w-4" />
      </span>
    </button>
  );
}
