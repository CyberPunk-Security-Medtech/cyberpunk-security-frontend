import Link from "next/link";

export default function ReportsAnalyticsPage() {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-[#1A2380]">Reports & Analytics</h1>
      <p className="mt-2 text-sm text-gray-600">
        This page is now routed correctly in production. Reports and analytics workflow UI can be added here.
      </p>
      <div className="mt-5">
        <Link
          href="/dashboard/admin-dashboard"
          className="inline-flex rounded-full border border-[#1A2380] px-4 py-2 text-sm font-medium text-[#1A2380]"
        >
          Back to Dashboard
        </Link>
      </div>
    </section>
  );
}
