"use client";

import { useState } from "react";

export type VerticalMenuItem = {
  id: string;
  label: string;
};

type VerticalMenuProps = {
  items: VerticalMenuItem[];
  defaultActiveId?: string;
  onChange?: (item: VerticalMenuItem) => void;
  className?: string;
};

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function VerticalMenu({ items, defaultActiveId, onChange, className }: VerticalMenuProps) {
  const fallbackId = items[0]?.id ?? "";
  const [activeId, setActiveId] = useState(defaultActiveId ?? fallbackId);

  return (
    <div className={cn("w-full max-w-[350px] rounded-md border border-[#e3e6eb] bg-white p-3", className)}>
      <ul className="space-y-1">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => {
                  setActiveId(item.id);
                  onChange?.(item);
                }}
                className={cn(
                  "w-full rounded-md px-3 py-2 text-left text-[24px] font-medium transition-colors",
                  isActive ? "bg-[#edf3fb] text-[#1c1c1c]" : "text-[#505050] hover:bg-[#f7f9fc]",
                )}
              >
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
