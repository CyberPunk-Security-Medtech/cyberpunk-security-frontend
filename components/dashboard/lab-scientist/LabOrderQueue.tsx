"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronRight, FlaskConical } from "lucide-react";
import { StatusBadge } from "@components/StatusBadge";
import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";
import { labService } from "@services/api";
import {
  LabOrder,
  combineUniqueOrders,
  formatDateTime,
  normalizeLabOrders,
  toStatusBadgeType,
} from "./labOrderUtils";

/**
 * Loads the organization's lab tests in ONE request. The list endpoint already
 * carries everything the queue shows (name, category, priority, status, time),
 * so nothing else — consultations, patients — is fetched for the queue.
 */
export function useLabOrders(orgId: string | null) {
  const [orders, setOrders] = useState<LabOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const load = useCallback(async (signal?: { cancelled: boolean }) => {
    if (!orgId) {
      setOrders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setHasError(false);
    try {
      const response = await labService.listOrganizationLabTests(orgId);
      const raw = Array.isArray(response)
        ? response
        : Array.isArray((response as { data?: unknown })?.data)
          ? (response as { data: unknown[] }).data
          : [];
      if (!signal?.cancelled) setOrders(combineUniqueOrders(normalizeLabOrders(raw)));
    } catch (error) {
      console.error("Failed to load lab orders", error);
      if (!signal?.cancelled) {
        setOrders([]);
        setHasError(true);
      }
    } finally {
      if (!signal?.cancelled) setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    const signal = { cancelled: false };
    void load(signal);
    return () => {
      signal.cancelled = true;
    };
  }, [load]);

  return { orders, setOrders, loading, hasError, reload: () => load() };
}

const PRIORITY_STYLES: Record<string, string> = {
  emergency: "bg-red-50 text-red-700 ring-red-200",
  stat: "bg-red-50 text-red-700 ring-red-200",
  critical: "bg-red-50 text-red-700 ring-red-200",
  urgent: "bg-amber-50 text-amber-800 ring-amber-200",
};

export function PriorityBadge({ priority }: { priority: string }) {
  const label = /^stat$/i.test(priority) ? "Emergency" : priority || "Routine";
  const style = PRIORITY_STYLES[priority.toLowerCase()] ?? "bg-gray-50 text-gray-700 ring-gray-200";
  return (
    <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${style}`}>
      {label}
    </span>
  );
}

const testName = (order: LabOrder) => order.test_name || order.test_type || "Unnamed test";

type QueueProps = {
  orders: LabOrder[];
  onOpen: (id: string) => void;
  label?: string;
};

/** Shared queue table — identical on the dashboard and the Test Orders page. */
export function LabOrderTable({ orders, onOpen, label = "Lab test orders" }: QueueProps) {
  return (
    <ResponsiveTableRegion label={label}>
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead className="border-b bg-gray-50 text-gray-600">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">Test name</th>
            <th scope="col" className="px-4 py-3 font-medium">Test category</th>
            <th scope="col" className="px-4 py-3 font-medium">Time ordered</th>
            <th scope="col" className="px-4 py-3 font-medium">Priority</th>
            <th scope="col" className="px-4 py-3 font-medium">Status</th>
            <th scope="col" className="px-4 py-3 text-right font-medium">
              <span className="sr-only">Action</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="cursor-pointer border-b last:border-0 hover:bg-gray-50"
              onClick={() => onOpen(order.id)}
            >
              <td className="px-4 py-3 font-medium text-gray-900">{testName(order)}</td>
              <td className="px-4 py-3 text-gray-600">{order.testCategory || "—"}</td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-600">{formatDateTime(order.orderedAt)}</td>
              <td className="px-4 py-3">
                <PriorityBadge priority={order.priority} />
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={toStatusBadgeType(order.status)} />
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onOpen(order.id);
                  }}
                  aria-label={`View ${testName(order)}`}
                  className="rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ResponsiveTableRegion>
  );
}

/** Vertical list: one full-width row per order, easy to scan top to bottom. */
export function LabOrderList({ orders, onOpen }: QueueProps) {
  return (
    <ul className="divide-y divide-gray-100 overflow-hidden rounded-md border border-gray-200">
      {orders.map((order) => (
        <li key={order.id}>
          <button
            type="button"
            onClick={() => onOpen(order.id)}
            className="flex w-full items-center gap-4 px-4 py-3 text-left hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none"
          >
            <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-md bg-teal-50 text-[#007F73] sm:flex">
              <FlaskConical size={18} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium text-gray-900">{testName(order)}</span>
              <span className="block text-xs text-gray-500">
                {order.testCategory || "Uncategorized"} · Ordered {formatDateTime(order.orderedAt)}
              </span>
            </span>
            <span className="flex shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-center sm:gap-3">
              <PriorityBadge priority={order.priority} />
              <StatusBadge status={toStatusBadgeType(order.status)} />
            </span>
            <ChevronRight size={18} className="shrink-0 text-gray-400" aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
  );
}

export function LabOrderQueueSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2 rounded-md border border-gray-200 bg-white p-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-12 animate-pulse rounded-md bg-gray-100" />
      ))}
    </div>
  );
}
