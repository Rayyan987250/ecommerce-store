"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

type PaginationProps = {
  totalPages: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  showPrevNext?: boolean;
  className?: string;
};

type PagerWithLimitProps = PaginationProps & {
  limits?: number[];
  defaultLimit?: number;
  onLimitChange?: (limit: number) => void;
};

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function PageButton({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-10 min-w-10 items-center justify-center border border-[#e3e6eb] bg-white px-3 text-[18px] font-medium text-[#8b96a5] transition-colors hover:bg-[#f7f9fc]",
        active ? "bg-[#edf3fb] text-[#0d6efd]" : "",
      )}
    >
      {children}
    </button>
  );
}

export function Pagination({
  totalPages,
  defaultPage = 1,
  onPageChange,
  showPrevNext = true,
  className,
}: PaginationProps) {
  const [page, setPage] = useState(defaultPage);

  const pages = useMemo(() => {
    return Array.from({ length: Math.max(totalPages, 1) }, (_, index) => index + 1);
  }, [totalPages]);

  const setCurrentPage = (nextPage: number) => {
    const safePage = Math.min(Math.max(nextPage, 1), pages.length);
    setPage(safePage);
    onPageChange?.(safePage);
  };

  return (
    <div className={cn("inline-flex overflow-hidden rounded-md", className)}>
      {showPrevNext ? (
        <PageButton onClick={() => setCurrentPage(page - 1)}>
          <ChevronLeft className="h-4 w-4" />
        </PageButton>
      ) : null}
      {pages.map((pageNumber) => (
        <PageButton key={pageNumber} active={pageNumber === page} onClick={() => setCurrentPage(pageNumber)}>
          {pageNumber}
        </PageButton>
      ))}
      {showPrevNext ? (
        <PageButton onClick={() => setCurrentPage(page + 1)}>
          <ChevronRight className="h-4 w-4" />
        </PageButton>
      ) : null}
    </div>
  );
}

export function PaginationWithLimit({
  limits = [10, 15, 20, 25],
  defaultLimit = 15,
  onLimitChange,
  className,
  ...paginationProps
}: PagerWithLimitProps) {
  const [limit, setLimit] = useState(defaultLimit);

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <Pagination {...paginationProps} />
      <label className="sr-only" htmlFor="page-limit">
        Items per page
      </label>
      <select
        id="page-limit"
        value={limit}
        onChange={(event) => {
          const next = Number(event.target.value);
          setLimit(next);
          onLimitChange?.(next);
        }}
        className="h-10 min-w-[126px] rounded-md border border-[#e3e6eb] bg-white px-3 text-[18px] text-[#505050] focus:outline-none focus:ring-2 focus:ring-[#0d6efd]/30"
      >
        {limits.map((value) => (
          <option key={value} value={value}>
            Show {value}
          </option>
        ))}
      </select>
    </div>
  );
}
