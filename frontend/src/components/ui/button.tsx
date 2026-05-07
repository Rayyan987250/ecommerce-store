import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "solid" | "outline";
type ButtonSize = "sm" | "md" | "lg";
type IconPosition = "left" | "right";

export type UIButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: IconPosition;
  iconOnly?: boolean;
  className?: string;
};

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const baseClasses =
  "ui-button-pop inline-flex items-center justify-center gap-2 border font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d6efd]/40 disabled:cursor-not-allowed disabled:opacity-60";

const variantClasses: Record<ButtonVariant, string> = {
  solid:
    "border-[#0d6efd] bg-gradient-to-b from-[#2f8ef6] to-[#0d6efd] text-white hover:from-[#2a86ee] hover:to-[#0b63d8]",
  outline: "border-[#d6dee8] bg-white text-[#0d6efd] hover:bg-[#f7fbff]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 min-w-[82px] rounded-md px-4 text-sm",
  md: "h-10 min-w-[102px] rounded-md px-5 text-[18px]",
  lg: "h-14 min-w-[124px] rounded-lg px-6 text-[30px]",
};

const iconOnlySizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 w-8 rounded-md p-0",
  md: "h-10 w-10 rounded-md p-0",
  lg: "h-14 w-14 rounded-lg p-0",
};

function IconBadge({ variant, icon }: { variant: ButtonVariant; icon: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex h-4 w-4 items-center justify-center rounded-sm",
        variant === "solid" ? "bg-white text-[#0d6efd]" : "bg-[#0d6efd] text-white",
      )}
    >
      {icon}
    </span>
  );
}

export function Button({
  variant = "solid",
  size = "md",
  icon,
  iconPosition = "left",
  iconOnly = false,
  className,
  children,
  type = "button",
  ...props
}: UIButtonProps) {
  const classes = cn(
    baseClasses,
    variantClasses[variant],
    iconOnly ? iconOnlySizeClasses[size] : sizeClasses[size],
    className,
  );

  if (iconOnly) {
    return (
      <button type={type} className={classes} aria-label={props["aria-label"] ?? "Button"} {...props}>
        {icon ? <IconBadge variant={variant} icon={icon} /> : null}
      </button>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {icon && iconPosition === "left" ? <IconBadge variant={variant} icon={icon} /> : null}
      <span>{children}</span>
      {icon && iconPosition === "right" ? <IconBadge variant={variant} icon={icon} /> : null}
    </button>
  );
}
