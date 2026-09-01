"use client";

type PaginationProps = {
  /** Current 1-indexed page. */
  page: number;
  /** Total number of pages available. */
  totalPages: number;
  onPageChange: (page: number) => void;
};

/**
 * Builds the list of page labels to render, collapsing long ranges with
 * ellipses (e.g. 1 … 4 5 6 … 12).
 */
const getPageItems = (page: number, totalPages: number): Array<number | "…"> => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...pages]
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((a, b) => a - b);

  const items: Array<number | "…"> = [];
  sorted.forEach((value, index) => {
    if (index > 0 && value - sorted[index - 1] > 1) items.push("…");
    items.push(value);
  });
  return items;
};

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pageItems = getPageItems(page, totalPages);

  return (
    <div className="flex flex-col gap-3 text-xs sm:flex-row sm:items-center sm:justify-between">
      <p>
        Page {page} of {totalPages}
      </p>

      <div className="flex flex-wrap gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="min-h-10 min-w-10 rounded border px-3 text-xs hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#051466] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Prev
        </button>

        {pageItems.map((item, index) =>
          item === "…" ? (
            <span
              key={`ellipsis-${index}`}
              aria-hidden="true"
              className="inline-flex min-h-10 min-w-10 items-center justify-center px-3 text-xs text-slate-400"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-current={item === page ? "page" : undefined}
              className={`min-h-10 min-w-10 rounded border px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#051466] ${
                item === page
                  ? "bg-blue-50 font-semibold text-blue-600"
                  : "hover:bg-slate-50"
              }`}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="min-h-10 min-w-10 rounded border px-3 text-xs hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#051466] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
