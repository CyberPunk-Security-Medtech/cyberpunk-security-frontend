"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function HMOViewHeader({ name }: { name: string }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 space-y-1">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
          <Link href="/dashboard/admin/hmo-management" className="hover:underline">
            HMOs
          </Link>
          <span className="mx-1" aria-hidden="true">›</span>
          <span aria-current="page" className="text-gray-700">{name}</span>
        </nav>
        <h1 className="dashboard-page-title truncate">{name}</h1>
      </div>

      <Link
        href="/dashboard/admin/hmo-management"
        className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-gray-300 px-5 text-sm hover:bg-gray-50"
      >
        <ArrowLeft size={16} aria-hidden="true" /> Back to HMOs
      </Link>
    </div>
  );
}
