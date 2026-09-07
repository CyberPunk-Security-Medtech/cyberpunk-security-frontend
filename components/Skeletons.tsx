"use client";

import type { ReactNode } from "react";

// Base skeleton block — a pulsing placeholder shaped by the caller.
export function Skeleton({
  className = "",
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded bg-gray-200 ${className}`}
    >
      {children}
    </div>
  );
}

// A single skeleton row shaped like a table row: leading element
// (avatar / pill), a couple of text lines, trailing cell.
export function SkeletonRow({
  leading = "h-9 w-9 rounded-full",
  lines = ["h-3.5 w-40", "h-3 w-24"],
  trailing,
}: {
  leading?: string;
  lines?: string[];
  trailing?: string;
}) {
  return (
    <div className="flex items-center gap-4 border-b py-3.5 last:border-b-0">
      <div className={`shrink-0 animate-pulse rounded bg-gray-200 ${leading}`} />
      <div className="min-w-0 flex-1 space-y-2">
        {lines.map((line) => (
          <div key={line} className={`animate-pulse rounded bg-gray-200 ${line}`} />
        ))}
      </div>
      {trailing && (
        <div className={`shrink-0 animate-pulse rounded bg-gray-200 ${trailing}`} />
      )}
    </div>
  );
}

// Skeleton body for a table (headers + N rows) that sits inside the
// table's <tbody>, matching a colSpan.
export function TableSkeleton({
  rows = 5,
  columns = 1,
  rowLeading = "h-9 w-9 rounded-full",
  rowLines = ["h-3.5 w-40", "h-3 w-24"],
  rowTrailing,
}: {
  rows?: number;
  columns?: number;
  rowLeading?: string;
  rowLines?: string[];
  rowTrailing?: string;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={index} className="border-b last:border-b-0">
          <td colSpan={columns} className="px-4 py-1">
            <SkeletonRow leading={rowLeading} lines={rowLines} trailing={rowTrailing} />
          </td>
        </tr>
      ))}
    </>
  );
}

// Skeleton grid for card layouts (patient cards, stat cards, etc.).
export function CardGridSkeleton({
  count = 6,
  cardClassName = "h-32",
}: {
  count?: number;
  cardClassName?: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`animate-pulse rounded-lg border border-gray-200 bg-gray-100 ${cardClassName}`}
        />
      ))}
    </div>
  );
}

// Full-page skeleton for detail pages (header block + content lines).
export function PageSkeleton() {
  return (
    <div role="status" aria-label="Loading" className="space-y-6">
      <Skeleton className="h-8 w-56" />
      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-3.5 w-28" />
          </div>
        </div>
        <div className="space-y-3 pt-2">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-5/6" />
          <Skeleton className="h-3.5 w-2/3" />
        </div>
      </div>
    </div>
  );
}
