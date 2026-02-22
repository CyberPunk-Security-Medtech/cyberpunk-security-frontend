import Link from "next/link";

export default function AssistantPage() {
  return (
    <main className="mx-auto w-full max-w-4xl p-6 sm:p-10">
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-[#1A2380]">AI Assistant</h1>
        <p className="mt-2 text-sm text-gray-600">
          This assistant route is now available on production and local deployments.
        </p>
        <p className="mt-2 text-sm text-gray-600">
          If your role-specific assistant is required, use the dashboard link for that module.
        </p>
        <div className="mt-5">
          <Link
            href="/auth/workspace-select"
            className="inline-flex rounded-full bg-[#1A2380] px-4 py-2 text-sm font-medium text-white"
          >
            Go to Workspace Select
          </Link>
        </div>
      </section>
    </main>
  );
}
