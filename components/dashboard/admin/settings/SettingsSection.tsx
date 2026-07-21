import type { ReactNode } from "react";

type SettingsSectionProps = {
  id: string;
  title: string;
  children: ReactNode;
  cardClassName?: string;
};

export default function SettingsSection({
  id,
  title,
  children,
  cardClassName = "border-slate-300",
}: SettingsSectionProps) {
  return (
    <section aria-labelledby={id} className="space-y-3">
      <h2 id={id} className="text-xl font-semibold text-slate-900 sm:text-2xl">
        {title}
      </h2>
      <div className={`rounded-2xl border bg-white px-4 py-5 sm:px-6 sm:py-6 ${cardClassName}`}>
        {children}
      </div>
    </section>
  );
}
