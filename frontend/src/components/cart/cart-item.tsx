import { useCurrencyPricing } from "@/hooks/use-currency-pricing";
import type { CartLineItem } from "@/types";
import { Trash2 } from "lucide-react";
import Image from "next/image";

type CartItemProps = {
  item: CartLineItem;
  onRemove: (id: string) => void;
  onSaveForLater: (id: string) => void;
  onQtyChange: (id: string, qty: number) => void;
};

export default function CartItem({ item, onRemove, onSaveForLater, onQtyChange }: CartItemProps) {
  const { formatPrice } = useCurrencyPricing();
  return (
    <article className="ui-fade-up grid grid-cols-[84px_1fr] gap-3 border-b border-[#eff2f4] py-3 last:border-b-0">
      <div className="flex h-20 w-20 items-center justify-center rounded border border-[#e3e6eb]">
        <Image src={item.image} alt={item.title} width={68} height={68} style={{ width: "auto", height: "auto" }} className="object-contain" />
      </div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-[16px] font-semibold text-[#1c1c1c]">{item.title}</h3>
          <p className="text-[14px] text-[#8b96a5]">Quantity updates recalculate totals instantly.</p>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="ui-button-pop flex items-center gap-1 rounded border border-[#ffe3e3] px-2 py-0.5 text-[12px] font-semibold text-[#fa3434] hover:bg-[#fff3f3]"
            >
              <Trash2 className="h-3 w-3" />
              Remove
            </button>
            <button
              type="button"
              onClick={() => onSaveForLater(item.id)}
              className="ui-button-pop rounded border border-[#d9dfe7] px-2 py-0.5 text-[12px] font-semibold text-[#127fff] hover:bg-[#f7fbff]"
            >
              Save for later
            </button>
          </div>
        </div>
        <div className="text-right">
          <p className="mb-2 text-[24px] font-semibold text-[#1c1c1c]">{formatPrice(item.price * item.qty)}</p>
          <select
            aria-label={`Quantity for item ${item.id}`}
            value={item.qty}
            onChange={(event) => onQtyChange(item.id, Number(event.target.value))}
            className="h-9 rounded border border-[#d9dfe7] px-2 text-[14px] text-[#505050]"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((qty) => (
              <option key={qty} value={qty}>
                Qty: {qty}
              </option>
            ))}
          </select>
        </div>
      </div>
    </article>
  );
}
