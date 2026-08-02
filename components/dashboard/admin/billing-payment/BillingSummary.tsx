import { ShieldCheck } from "lucide-react";

const summaryRows = [
  { label: "Billing Period", value: "July 2026", highlighted: false },
  { label: "Total Transfers", value: "100", highlighted: true },
  { label: "Tier Applied", value: "Basic (1 – 400)", highlighted: false },
  { label: "Rate per Transfer", value: "$1", highlighted: true },
];

export default function BillingSummary() {
  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"
      aria-labelledby="bill-summary-title"
    >
      <h1
        id="bill-summary-title"
        className="text-2xl font-semibold text-slate-950"
      >
        Bill Summary
      </h1>

      <dl className="mt-6 text-sm sm:text-base">
        {summaryRows.map(({ label, value, highlighted }) => (
          <div
            key={label}
            className={`flex flex-col gap-1 rounded-md px-3 py-2 sm:flex-row sm:items-center sm:justify-between ${
              highlighted ? "bg-[#D4F3F0]" : ""
            }`}
          >
            <dt>{label}</dt>
            <dd className="font-medium tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-3 flex items-center justify-between border-t border-slate-200 px-3 py-5">
        <span className="text-lg font-semibold">Total Due</span>
        <span className="text-2xl font-semibold text-[#21178C]">$100</span>
      </div>

      <div className="mt-2 flex items-start gap-3 rounded-2xl bg-[#D4F3F0] px-5 py-4 text-sm text-slate-800">
        <ShieldCheck
          className="mt-0.5 h-5 w-5 shrink-0 text-[#009B82]"
          aria-hidden="true"
        />
        <p>
          All payments are processed securely. Receipts are auto-generated and
          emailed to the registered billing address.
        </p>
      </div>
    </section>
  );
}
