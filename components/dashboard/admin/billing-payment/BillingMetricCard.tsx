export type BillingMetric = {
  label: string;
  value: string;
  supportingText: string;
  tone: "neutral" | "blue" | "navy";
};

const toneClasses: Record<
  BillingMetric["tone"],
  {
    card: string;
    label: string;
    supportingText: string;
  }
> = {
  neutral: {
    card: "border border-slate-200 bg-white text-slate-950",
    label: "text-slate-600",
    supportingText: "text-slate-700",
  },
  blue: {
    card: "bg-[#3D80EC] text-white",
    label: "text-white/70",
    supportingText: "text-white/60",
  },
  navy: {
    card: "bg-[#21178C] text-white",
    label: "text-white/70",
    supportingText: "text-white/60",
  },
};

type BillingMetricCardProps = {
  metric: BillingMetric;
};

export default function BillingMetricCard({
  metric,
}: BillingMetricCardProps) {
  const classes = toneClasses[metric.tone];

  return (
    <article className={`rounded-2xl p-6 ${classes.card}`}>
      <p className={`text-sm tracking-[0.14em] ${classes.label}`}>
        {metric.label}
      </p>
      <p className="mt-2 text-4xl font-semibold">{metric.value}</p>
      <p className={`mt-1 text-sm ${classes.supportingText}`}>
        {metric.supportingText}
      </p>
    </article>
  );
}
