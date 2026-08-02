import ToggleSwitch from "./ToggleSwitch";

export default function DataRetentionPoliciesCard() {
  const policies = [
    {
      title: "Patient Records",
      description: "6 years post-treatment",
      enabled: true,
    },
    {
      title: "Consent Records",
      description: "Permanent retention",
      enabled: false,
    },
  ];

  return (
    <section className="w-full rounded-xl border border-slate-200 bg-white p-4 sm:p-5" aria-labelledby="retention-policies-title">
      <h2 id="retention-policies-title" className="text-lg font-medium text-slate-900">
        Data Retention Policies
      </h2>

      {policies.map(({ title, description, enabled }) => (
        <div
          key={title}
          className="flex items-center justify-between gap-4 py-4"
        >
          <div>
            <p className="text-sm font-medium">{title}</p>
            <p className="mt-1 text-xs text-slate-500">{description}</p>
          </div>
          <ToggleSwitch
            checked={enabled}
            label={`${title} retention preview`}
          />
        </div>
      ))}
      <p className="sr-only">Retention switches are a visual preview and are not saved to the server.</p>
    </section>
  );
}
