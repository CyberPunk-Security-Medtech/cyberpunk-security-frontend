"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";
import Pagination from "@components/dashboard/admin/staff-management/Pagination";
import { TableSkeleton } from "@components/Skeletons";
import type { HmoSummary } from "./hmoData";

const PAGE_SIZE = 10;

export const hmoDetailHref = (name: string) =>
  `/dashboard/admin/hmo-management/view-hmo?provider=${encodeURIComponent(name)}`;

const formatDate = (value: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(date);
};

type HMOTableProps = {
  hmos: HmoSummary[];
  loading: boolean;
  year: number;
  emptyMessage: string;
};

export default function HMOTable({ hmos, loading, year, emptyMessage }: HMOTableProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(hmos.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedHmos = hmos.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <ResponsiveTableRegion label="HMO providers">
      <table className="w-full min-w-[820px] text-sm">
        <thead className="bg-slate-100 text-slate-600">
          <tr>
            <th scope="col" className="min-w-[200px] bg-slate-100 px-4 py-3 text-left">HMO</th>
            <th scope="col" className="px-4 py-3 text-right">Enrolled patients</th>
            <th scope="col" className="px-4 py-3 text-right" title="Policies not past their expiry date">
              Current policies
            </th>
            <th scope="col" className="px-4 py-3 text-right">Expired policies</th>
            <th scope="col" className="px-4 py-3 text-right">Consultations ({year})</th>
            <th scope="col" className="px-4 py-3 text-left">Last enrolment</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <TableSkeleton columns={6} />
          ) : hmos.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            pagedHmos.map((hmo) => (
              <tr
                key={hmo.key}
                onClick={() => router.push(hmoDetailHref(hmo.name))}
                className="group cursor-pointer border-t bg-white hover:bg-slate-50"
              >
                <td className="bg-white px-4 py-3 group-hover:bg-slate-50">
                  {/* A real link keeps the row reachable by keyboard and middle-click. */}
                  <Link
                    href={hmoDetailHref(hmo.name)}
                    onClick={(event) => event.stopPropagation()}
                    className="font-medium text-[#051466] hover:underline"
                  >
                    {hmo.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-right tabular-nums">{hmo.patients.length}</td>
                <td className="px-4 py-3 text-right tabular-nums">{hmo.activePolicies}</td>
                <td className={`px-4 py-3 text-right tabular-nums ${hmo.expiredPolicies ? "font-medium text-red-700" : ""}`}>
                  {hmo.expiredPolicies}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">{hmo.consultations}</td>
                <td className="whitespace-nowrap px-4 py-3">{formatDate(hmo.lastEnrolledAt)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="border-t px-4 py-3">
          <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </ResponsiveTableRegion>
  );
}
