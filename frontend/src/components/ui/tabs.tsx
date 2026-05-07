"use client";

import { useState } from "react";

export type TabItem = {
  id: string;
  label: string;
};

type TabsProps = {
  items: TabItem[];
  defaultActiveId?: string;
  onChange?: (item: TabItem) => void;
  className?: string;
};

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function Tabs({ items, defaultActiveId, onChange, className }: TabsProps) {
  const fallbackId = items[0]?.id ?? "";
  const [activeId, setActiveId] = useState(defaultActiveId ?? fallbackId);

  return (
    <div className={cn("w-full max-w-[350px] overflow-hidden rounded-md border border-[#e3e6eb] bg-white", className)}>
      <div className="flex border-b border-[#e3e6eb]">
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
                "relative px-4 py-2 text-[22px] font-medium transition-colors",
                isActive ? "text-[#0d6efd]" : "text-[#8b96a5] hover:text-[#5d6878]",
              )}
            >
              {item.label}
              {isActive ? <span className="absolute inset-x-0 bottom-[-1px] h-[2px] bg-[#0d6efd]" /> : null}
            </button>
          );
        })}
      </div>
      <div className="h-[88px] bg-white" />
    </div>
  );
}
