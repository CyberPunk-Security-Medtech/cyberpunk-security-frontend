import SettingsSection from "./SettingsSection";

type Preference = {
  label: string;
  description: string;
  enabled: boolean;
};

const emailPreferences: Preference[] = [
  { label: "Security alerts", description: "Sign-ins, password changes, suspicious activity", enabled: true },
  { label: "Weekly reports", description: "Summary of activity and key metrics", enabled: true },
  { label: "Billing updates", description: "Invoices, payment confirmations, plan changes", enabled: false },
];

const mobilePreferences: Preference[] = [
  { label: "Critical alerts", description: "System outages and urgent issues", enabled: true },
  { label: "Two-factor SMS codes", description: "Authentication codes sent by text message", enabled: true },
];

function PreviewSwitch({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={`${label} notification preference`}
      aria-describedby="notification-preview-note"
      disabled
      className={`relative h-7 w-14 shrink-0 cursor-not-allowed rounded-full border transition-colors disabled:opacity-75 ${
        enabled ? "border-[#1A2380] bg-[#1A2380]" : "border-slate-400 bg-slate-500"
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-slate-100 shadow-sm transition-transform ${enabled ? "left-7" : "left-1"}`}
      />
    </button>
  );
}

function PreferenceGroup({ title, preferences }: { title: string; preferences: Preference[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      <div className="mt-1">
        {preferences.map((preference, index) => (
          <div
            key={preference.label}
            className={`flex items-center justify-between gap-4 py-5 ${index < preferences.length - 1 ? "border-b border-slate-300" : ""}`}
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-800">{preference.label}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">{preference.description}</p>
            </div>
            <PreviewSwitch label={preference.label} enabled={preference.enabled} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NotificationSettings() {
  return (
    <SettingsSection id="notification-settings" title="Notification">
      <p id="notification-preview-note" className="mb-5 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600">
        Preview only. Notification preferences are not connected to the server yet.
      </p>
      <div className="space-y-4">
        <PreferenceGroup title="Emails" preferences={emailPreferences} />
        <PreferenceGroup title="Push & SMS" preferences={mobilePreferences} />
      </div>
    </SettingsSection>
  );
}
