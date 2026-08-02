import BillingMetricCard, {
  type BillingMetric,
} from "./BillingMetricCard";
import BillingSummary from "./BillingSummary";
import ComingSoonOverlay from "./ComingSoonOverlay";
import PaymentPreview from "./PaymentPreview";

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

        <BillingSummary />
        <PaymentPreview />
      </div>

      <ComingSoonOverlay />
    </div>
  );
}
