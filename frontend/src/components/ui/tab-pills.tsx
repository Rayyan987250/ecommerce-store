"use client";

import { useState } from "react";

export type TabPillItem = {
  id: string;
  label: string;
};

type TabPillsProps = {
  items: TabPillItem[];
  defaultActiveId?: string;
  onChange?: (item: TabPillItem) => void;
  className?: string;
};

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function TabPills({ items, defaultActiveId, onChange, className }: TabPillsProps) {
  const fallbackId = items[0]?.id ?? "";
  const [activeId, setActiveId] = useState(defaultActiveId ?? fallbackId);

  return (
    <div className={cn("w-full max-w-[350px] rounded-md border border-[#e3e6eb] bg-white p-3", className)}>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveId(item.id);
                onChange?.(item);
              }}
              className={cn(
                "min-w-[76px] rounded-md px-4 py-2 text-[22px] font-medium transition-colors",
                isActive ? "bg-[#edf3fb] text-[#1c1c1c]" : "text-[#505050] hover:bg-[#f7f9fc]",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
