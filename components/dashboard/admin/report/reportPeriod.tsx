"use client";

import { Select } from "@components/Field";
import { getApiErrorMessage } from "@utils/apiError";

const FIRST_REPORT_YEAR = 2020;

export const MONTH_NAMES = Array.from({ length: 12 }, (_, index) =>
  new Intl.DateTimeFormat("en-GB", { month: "long" }).format(new Date(2000, index, 1)),
);

export const monthLabel = (month: number, year: number) => `${MONTH_NAMES[month - 1] ?? month} ${year}`;

export const reportYears = () => {
  const current = new Date().getFullYear();
  return Array.from({ length: current - FIRST_REPORT_YEAR + 1 }, (_, index) => current - index);
};

export const reportErrorMessage = (error: unknown) => {
  const status = (error as { response?: { status?: number } })?.response?.status;
  return status === 403
    ? "Reports are only available to administrators."
    : getApiErrorMessage(error, "Unable to load this report. Please try again.");
};

export const isAbortError = (error: unknown) =>
  (error as { name?: string })?.name === "CanceledError" ||
  (error as { code?: string })?.code === "ERR_CANCELED";

export function PeriodFilters({
  idPrefix,
  year,
  month,
  onYearChange,
  onMonthChange,
}: {
  idPrefix: string;
  year: number;
  /** null means every month of the year. */
  month: number | null;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number | null) => void;
}) {
  return (
    <>
      <div className="sm:w-32">
        <label htmlFor={`${idPrefix}-year`} className="mb-1 block text-xs font-medium text-slate-600">
          Year
        </label>
        <Select id={`${idPrefix}-year`} value={year} onChange={(e) => onYearChange(Number(e.target.value))}>
          {reportYears().map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </div>
      <div className="sm:w-44">
        <label htmlFor={`${idPrefix}-month`} className="mb-1 block text-xs font-medium text-slate-600">
          Month
        </label>
        <Select
          id={`${idPrefix}-month`}
          value={month ?? ""}
          onChange={(e) => onMonthChange(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">All months</option>
          {MONTH_NAMES.map((name, index) => (
            <option key={name} value={index + 1}>
              {name}
            </option>
          ))}
        </Select>
      </div>
    </>
  );
}
