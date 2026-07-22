import Link from "next/link";

export default function AdminHelpPage() {
  return (
    <div className="p-6">
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="dashboard-page-title text-[#1A2380]">Help</h1>
      <p className="mt-2 text-sm text-gray-600">
        Help route has been added so sidebar navigation no longer returns 404 in production.
      </p>
      <div className="mt-5">
        <Link
          href="/dashboard/admin"
          className="inline-flex rounded-full border border-[#1A2380] px-4 py-2 text-sm font-medium text-[#1A2380]"
        >
          Back to Dashboard
        </Link>
      </div>
    </section>
    </div>
  );
}
