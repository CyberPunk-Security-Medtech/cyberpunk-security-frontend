import { CreditCard, ShieldCheck } from "lucide-react";

type BillingMetric = {
  label: string;
  value: string;
  supportingText: string;
  tone: "neutral" | "blue" | "navy";
};

const billingMetrics: BillingMetric[] = [
  {
    label: "Transfers This Month",
    value: "100",
    supportingText: "Updated as of today",
    tone: "neutral",
  },
  {
    label: "Current Category",
    value: "Basic",
    supportingText: "1 – 400 patient transfers",
    tone: "blue",
  },
  {
    label: "Amount Due",
    value: "$100",
    supportingText: "Due by end of July 2026",
    tone: "navy",
  },
];

const summaryRows = [
  { label: "Billing Period", value: "July 2026", highlighted: false },
  { label: "Total Transfers", value: "100", highlighted: true },
  { label: "Tier Applied", value: "Basic (1 – 400)", highlighted: false },
  { label: "Rate per Transfer", value: "$1", highlighted: true },
];

export default function BillingPaymentPage() {
  return (
    <div className="relative h-full min-h-0 overflow-hidden bg-gradient-to-br from-[#EFFBFA] via-[#F7F8F8] to-[#F7F8F8]">
      <div
        inert
        aria-hidden="true"
        className="h-full space-y-6 overflow-hidden px-4 py-6 md:px-8"
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {billingMetrics.map((metric) => (
            <BillingMetricCard key={metric.label} metric={metric} />
          ))}
        </div>

        <BillSummary />
        <PaymentPreview />
      </div>

      <ComingSoonOverlay />
    </div>
  );
}

function BillingMetricCard({ metric }: { metric: BillingMetric }) {
  const isNeutral = metric.tone === "neutral";
  const backgroundClass =
    metric.tone === "blue"
      ? "bg-[#3D80EC]"
      : metric.tone === "navy"
        ? "bg-[#21178C]"
        : "border border-slate-200 bg-white";

  return (
    <article
      className={`rounded-2xl p-6 ${backgroundClass} ${
        isNeutral ? "text-slate-950" : "text-white"
      }`}
    >
      <p
        className={`text-sm tracking-[0.14em] ${
          isNeutral ? "text-slate-600" : "text-white/70"
        }`}
      >
        {metric.label}
      </p>
      <p className="mt-2 text-4xl font-semibold">{metric.value}</p>
      <p
        className={`mt-1 text-sm ${
          isNeutral ? "text-slate-700" : "text-white/60"
        }`}
      >
        {metric.supportingText}
      </p>
    </article>
  );
}

function BillSummary() {
  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"
      aria-labelledby="bill-summary-title"
    >
      <h1 id="bill-summary-title" className="text-2xl font-semibold text-slate-950">
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
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#009B82]" />
        <p>
          All payments are processed securely. Receipts are auto-generated and
          emailed to the registered billing address.
        </p>
      </div>
    </section>
  );
}

function PaymentPreview() {
  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"
      aria-labelledby="make-payment-title"
    >
      <h2 id="make-payment-title" className="text-2xl font-semibold text-slate-950">
        Make Payment
      </h2>
      <div className="mt-5 flex items-center gap-4 rounded-2xl border border-cyan-300 bg-cyan-50 px-5 py-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-cyan-500 text-white">
          <CreditCard className="h-7 w-7" />
        </span>
        <div>
          <p className="font-semibold text-[#21178C]">Pay with Paystack</p>
          <p className="mt-1 text-sm text-slate-500">
            Secure checkout via Paystack — cards, bank transfer &amp; USSD supported.
          </p>
        </div>
      </div>
    </section>
  );
}

function ComingSoonOverlay() {
  return (
    <section
      role="status"
      aria-live="polite"
      aria-label="Billing and Payment availability"
      className="absolute inset-0 z-20 bg-[#21178C]/90 text-white"
    >
      <div className="sticky top-0 flex h-[calc(100dvh-69px)] min-h-[22rem] items-center justify-center px-6 text-center">
        <div>
          <CreditCard
            className="mx-auto h-10 w-10 text-[#71E5D4]"
            aria-hidden="true"
          />
          <h1 className="mt-5 text-2xl font-semibold sm:text-3xl">
            Billing &amp; Payment Coming soon...
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/75">
            We are preparing a secure way to review bills and make payments.
            This page is not available yet.
          </p>
        </div>
      </div>
    </section>
  );
}
