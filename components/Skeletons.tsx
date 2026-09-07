"use client";

import { Loader2 } from "lucide-react";

// Shared loader icon shown wherever data is being fetched. Rendered as a
// centered spinning icon; screen readers get the same message via role/aria.
export function LoaderIcon({ className = "" }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-flex items-center justify-center ${className}`}
    >
      <Loader2 className="h-5 w-5 animate-spin text-gray-400" aria-hidden="true" />
    </span>
  );
}

// Base skeleton slot — renders the loader icon in place of the block.
export function Skeleton({ className = "" }: { className?: string }) {
  return <LoaderIcon className={className} />;
}

// A loader row for list-style layouts.
export function SkeletonRow() {
  return (
    <div className="flex items-center justify-center border-b py-6 last:border-b-0">
      <LoaderIcon />
    </div>
  );
}

// Loader body for a table — a single row spanning the table's columns.
export function TableSkeleton({ columns = 1 }: { columns?: number }) {
  return (
    <tr>
      <td colSpan={columns} className="px-4 py-10 text-center">
        <LoaderIcon />
      </td>
    </tr>
  );
}

// Loader for card grid layouts.
export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  void count;
  return (
    <div className="flex items-center justify-center py-10">
      <LoaderIcon />
    </div>
  );
}

// Full-page loader for detail pages.
export function PageSkeleton() {
  return (
    <div className="flex items-center justify-center py-16">
      <LoaderIcon />
    </div>
  );
}
