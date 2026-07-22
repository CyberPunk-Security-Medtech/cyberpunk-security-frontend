import SettingsSection from "./SettingsSection";

type ProfileSettingsProps = {
  fullName: string;
  displayName: string;
  email: string;
  jobTitle: string;
  department: string;
  membershipUnavailable?: boolean;
};

const fields = [
  ["Full name", "full-name"],
  ["Display name", "display-name"],
  ["Email address", "email-address"],
  ["Job title", "job-title"],
  ["Department", "department"],
] as const;

export default function ProfileSettings({
  fullName,
  displayName,
  email,
  jobTitle,
  department,
  membershipUnavailable = false,
}: ProfileSettingsProps) {
  const values: Record<(typeof fields)[number][1], string> = {
    "full-name": fullName,
    "display-name": displayName,
    "email-address": email,
    "job-title": jobTitle,
    department,
  };
  const initials = fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "A";

  return (
    <SettingsSection id="profile-settings" title="Profile">
      <div className="flex flex-col gap-4 border-b border-slate-300 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div
            aria-hidden="true"
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#1A2380] text-lg font-semibold text-white ring-4 ring-indigo-50"
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="break-words text-xl font-semibold text-slate-900 sm:text-2xl">
              {fullName}
            </p>
            <p className="mt-1 break-words text-sm text-slate-500">
              {jobTitle} <span aria-hidden="true">|</span> {department}
            </p>
          </div>
        </div>
        <div className="sm:text-right">
          <button
            type="button"
            disabled
            aria-describedby="photo-unavailable"
            className="dashboard-button min-h-11 rounded-lg border border-slate-300 px-4 text-sm text-slate-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70 sm:min-h-10"
          >
            Remove Photo
          </button>
          <p id="photo-unavailable" className="mt-2 max-w-xs text-xs leading-5 text-slate-500 sm:ml-auto">
            Profile photo management is not available yet.
          </p>
        </div>
      </div>

      <div>
        {fields.map(([label, id], index) => (
          <div
            key={id}
            className={`grid gap-2 py-5 sm:grid-cols-[minmax(0,1fr)_minmax(220px,300px)] sm:items-center ${index < fields.length - 1 ? "border-b border-slate-300" : "pb-0"}`}
          >
            <div>
              <label htmlFor={id} className="text-sm font-medium text-slate-800">
                {label}
              </label>
              {id === "display-name" && (
                <p className="mt-1 text-xs text-slate-500">Shown across the dashboard</p>
              )}
            </div>
            <input
              id={id}
              value={values[id]}
              readOnly
              aria-readonly="true"
              className="h-10 w-full rounded-lg border border-slate-300 bg-slate-100 px-3 text-sm text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-[#051466]"
            />
          </div>
        ))}
      </div>

      {membershipUnavailable && (
        <p role="status" className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Job title and department could not be refreshed. Other profile details are still available.
        </p>
      )}
    </SettingsSection>
  );
}
