"use client";

import type { ReactNode } from "react";
import { Search, X } from "lucide-react";

type Option = { value: string; label: string };

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Read by screen readers; describe what the search covers. */
  label: string;
};

export function SearchInput({ value, onChange, placeholder = "Search", label }: SearchInputProps) {
  return (
    <div className="relative w-full lg:max-w-sm">
      <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        maxLength={100}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-9 text-sm outline-none placeholder:text-gray-400 focus:border-[#00B8A8] focus:ring-1 focus:ring-[#00B8A8] [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-600"
        >
          <X aria-hidden className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

type FilterSelectProps = {
  /** Shown as the "everything" option, e.g. "All departments". */
  allLabel: string;
  /** Read by screen readers, e.g. "Filter by department". */
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
};

export function FilterSelect({ allLabel, label, value, onChange, options }: FilterSelectProps) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:border-[#00B8A8] focus:ring-1 focus:ring-[#00B8A8] sm:w-auto sm:min-w-[160px] ${
        value ? "border-[#00B8A8] text-gray-900" : "border-gray-200 text-gray-600"
      }`}
    >
      <option value="">{allLabel}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

type ListToolbarProps = {
  /** The search input, usually <SearchInput />. */
  search?: ReactNode;
  /** Filter dropdowns, usually <FilterSelect /> elements. */
  filters?: ReactNode;
  /** Rows shown after filtering. Omit to hide the count. */
  shown?: number;
  /** Rows before filtering. */
  total?: number;
  /** Whether any search or filter is applied; shows "Clear filters". */
  active?: boolean;
  onClear?: () => void;
  noun?: string;
};

export default function ListToolbar({
  search,
  filters,
  shown,
  total,
  active = false,
  onClear,
  noun = "results",
}: ListToolbarProps) {
  return (
    <div className="mb-4 space-y-2">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {search}
        {filters && <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">{filters}</div>}
      </div>
      {active && typeof shown === "number" && (
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500" aria-live="polite">
          <span>
            Showing {shown}
            {typeof total === "number" ? ` of ${total}` : ""} {noun}
          </span>
          {onClear && (
            <button type="button" onClick={onClear} className="font-medium text-[#00B8A8] hover:underline">
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
