import type { ReactNode } from "react";

type ButtonGroupProps = {
  children: ReactNode;
  className?: string;
};

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function ButtonGroup({ children, className }: ButtonGroupProps) {
  return (
    <div
      className={cn(
        "inline-flex [&>*:not(:first-child)]:-ml-px [&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:first-child]:rounded-r-none [&>*:last-child]:rounded-l-none",
        className,
      )}
      role="group"
    >
      {children}
    </div>
  );
}
