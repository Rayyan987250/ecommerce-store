import {
  Pagination,
  PaginationWithLimit,
} from "@/components/ui/pagination";
import {
  TabPills,
  type TabPillItem,
} from "@/components/ui/tab-pills";
import { Tabs, type TabItem } from "@/components/ui/tabs";
import {
  VerticalMenu,
  type VerticalMenuItem,
} from "@/components/ui/vertical-menu";
import type { ReactNode } from "react";

const menuItems: VerticalMenuItem[] = [
  { id: "active", label: "Active menu" },
  { id: "first", label: "Menu item" },
  { id: "second", label: "Menu item" },
  { id: "third", label: "Menu item" },
];

const pillItems: TabPillItem[] = [
  { id: "active", label: "Active" },
  { id: "first", label: "First" },
  { id: "second", label: "Second" },
  { id: "third", label: "Third" },
];

const tabItems: TabItem[] = [
  { id: "active", label: "Tab active" },
  { id: "first", label: "Tab menu" },
  { id: "second", label: "Tab menu" },
];

function CardTitle({ children }: { children: ReactNode }) {
  return <h3 className="mb-4 text-[46px] font-semibold text-[#1c1c1c]">{children}</h3>;
}

export function NavTabPaginationShowcase() {
  return (
    <section className="space-y-8">
      <div className="rounded-none bg-[#edf3fb] px-5 py-8">
        <h2 className="text-[64px] font-semibold leading-none text-[#1c1c1c]">Nav, Tab, Pagination</h2>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div>
          <CardTitle>Vertical menu</CardTitle>
          <VerticalMenu items={menuItems} />
        </div>
        <div>
          <CardTitle>Tab pills</CardTitle>
          <TabPills items={pillItems} />
        </div>
        <div>
          <CardTitle>Tabs</CardTitle>
          <Tabs items={tabItems} />
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-[52px] font-semibold text-[#1c1c1c]">Pagination</h3>
        <div className="space-y-4">
          <Pagination totalPages={5} />
          <PaginationWithLimit totalPages={4} defaultPage={2} />
        </div>
      </div>
    </section>
  );
}
