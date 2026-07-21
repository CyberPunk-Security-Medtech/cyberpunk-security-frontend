import { Trash2 } from "lucide-react";

export default function DangerZoneSettings() {
  return (
    <section aria-labelledby="danger-zone-settings" className="rounded-2xl border border-red-300 bg-white px-4 py-6 sm:px-6 sm:py-8">
      <h2 id="danger-zone-settings" className="text-lg font-semibold text-red-600">Danger zone</h2>
      <p className="mt-1 text-xs text-slate-500">Irreversible actions — proceed with caution.</p>
      <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-base font-medium text-slate-900">Delete account</h3>
          <p id="delete-account-unavailable" className="mt-1 text-xs leading-5 text-slate-500">
            Account deletion is not available yet. No account data will be removed.
          </p>
        </div>
        <button
          type="button"
          disabled
          aria-describedby="delete-account-unavailable"
          className="dashboard-button min-h-11 rounded-lg border-2 border-red-500 px-5 text-sm font-semibold text-red-600 disabled:cursor-not-allowed disabled:opacity-70 sm:min-h-10"
        >
          <Trash2 size={18} aria-hidden="true" />
          Delete account
        </button>
      </div>
    </section>
  );
}
