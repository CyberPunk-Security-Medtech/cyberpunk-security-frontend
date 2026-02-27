"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@components/StatusBadge";
import { useAuth } from "@context/AuthContext";
import { LabOrderStatusFilter, labService } from "@services/api";
import {
  LabOrder,
  combineUniqueOrders,
  formatDateTime,
  getMockLabOrdersByStatus,
  isNotFoundApiError,
  normalizeLabOrders,
  toStatusBadgeType,
} from "./labOrderUtils";

const statusFilters: LabOrderStatusFilter[] = ["pending", "in_progress"];

const buildDisplayName = (user: {
  first_name?: string;
  last_name?: string;
  email?: string;
} | null) => {
  const fullName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();
  if (fullName) return fullName;
  return user?.email?.split("@")?.[0] || "Lab Scientist";
};

function QueueSkeleton() {
  return (
    <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-16 animate-pulse rounded-md bg-gray-100"
        />
      ))}
    </div>
  );
}

export default function LabScientistDashboardClient() {
  const router = useRouter();
  const { user, activeWorkspace } = useAuth();
  const orgId = activeWorkspace?.id ?? null;

  const [orders, setOrders] = useState<LabOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    if (!orgId) {
      setOrders([]);
      setLoading(false);
      return;
    }

    let ignore = false;

    const loadOrders = async () => {
      setLoading(true);
      setHasError(false);
      setUsingMockData(false);

      try {
        const responses = await Promise.allSettled(
          statusFilters.map((status) => labService.listLabOrders(orgId, status))
        );

        const successfulResponses = responses
          .filter(
            (
              result
            ): result is PromiseFulfilledResult<unknown> =>
              result.status === "fulfilled"
          )
          .map((result) => result.value);

        const normalized = successfulResponses.flatMap((response) =>
          normalizeLabOrders(response)
        );

        if (normalized.length > 0) {
          if (!ignore) {
            setOrders(combineUniqueOrders(normalized));
          }
          return;
        }

        const allFailuresAre404 =
          responses.length > 0 &&
          responses.every(
            (result) =>
              result.status === "rejected" && isNotFoundApiError(result.reason)
          );

        if (allFailuresAre404) {
          if (!ignore) {
            setOrders(getMockLabOrdersByStatus(["pending", "in_progress"]));
            setUsingMockData(true);
          }
          return;
        }

        if (!ignore) {
          setOrders([]);
          setHasError(true);
        }
      } catch (error) {
        console.error("Failed to load lab queue", error);
        if (!ignore) {
          setOrders([]);
          setHasError(true);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void loadOrders();

    return () => {
      ignore = true;
    };
  }, [orgId]);

  const stats = useMemo(() => {
    const pending = orders.filter((order) => order.status === "pending").length;
    const inProgress = orders.filter(
      (order) => order.status === "in_progress"
    ).length;
    return {
      total: orders.length,
      pending,
      inProgress,
    };
  }, [orders]);

  const openOrder = (id: string) => {
    router.push(`/dashboard/lab-scientist/lab-orders/${id}`);
  };

  return (
    <div className="space-y-6 py-2 sm:py-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-[#1A2380] sm:text-2xl">
          Good morning, Sci. {buildDisplayName(user)}!
        </h2>
        <p className="text-sm text-gray-500">
          Welcome back. Review pending and active test orders from your queue.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Total Orders</p>
          <p className="mt-1 text-2xl font-semibold text-[#1A2380]">
            {loading ? "..." : stats.total}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Pending</p>
          <p className="mt-1 text-2xl font-semibold text-[#1A2380]">
            {loading ? "..." : stats.pending}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">In Progress</p>
          <p className="mt-1 text-2xl font-semibold text-[#1A2380]">
            {loading ? "..." : stats.inProgress}
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-[#1A2380]">Test Order Queue</h3>
          <button
            type="button"
            onClick={() => router.push("/dashboard/lab-scientist/test-orders")}
            className="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            View All Orders
          </button>
        </div>

        {loading && <QueueSkeleton />}

        {!loading && orders.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
            No pending or in-progress lab orders right now.
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[980px] border-collapse text-left text-sm">
                <thead className="border-b bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Patient</th>
                    <th className="px-4 py-3 font-medium">Test Type</th>
                    <th className="px-4 py-3 font-medium">Ordering Doctor</th>
                    <th className="px-4 py-3 font-medium">Time Ordered</th>
                    <th className="px-4 py-3 font-medium">Priority</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="cursor-pointer border-b hover:bg-gray-50"
                      onClick={() => openOrder(order.id)}
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#1A2380]">
                          {order.patientName}
                        </div>
                        <div className="break-all text-xs text-gray-500">
                          {order.patientId}
                        </div>
                      </td>
                      <td className="px-4 py-3">{order.testType}</td>
                      <td className="px-4 py-3">{order.orderingDoctor}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {formatDateTime(order.orderedAt)}
                      </td>
                      <td className="px-4 py-3">{order.priority}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={toStatusBadgeType(order.status)} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          className="rounded-md border border-gray-200 px-3 py-1.5 hover:bg-gray-50"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 p-3 lg:hidden">
              {orders.map((order) => (
                <button
                  key={order.id}
                  type="button"
                  onClick={() => openOrder(order.id)}
                  className="w-full rounded-lg border border-gray-200 p-4 text-left hover:bg-gray-50"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-words font-medium text-[#1A2380]">
                        {order.patientName}
                      </p>
                      <p className="break-all text-xs text-gray-500">{order.patientId}</p>
                    </div>
                    <StatusBadge status={toStatusBadgeType(order.status)} />
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-xs text-gray-600 sm:grid-cols-2">
                    <p>
                      Test:{" "}
                      <span className="font-medium text-gray-800">
                        {order.testType}
                      </span>
                    </p>
                    <p>
                      Priority:{" "}
                      <span className="font-medium text-gray-800">
                        {order.priority}
                      </span>
                    </p>
                    <p className="sm:col-span-2">
                      Doctor:{" "}
                      <span className="font-medium text-gray-800">
                        {order.orderingDoctor}
                      </span>
                    </p>
                    <p className="sm:col-span-2">
                      Ordered:{" "}
                      <span className="font-medium text-gray-800">
                        {formatDateTime(order.orderedAt)}
                      </span>
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {hasError && (
          <p className="text-xs text-amber-700">
            Some queue data could not be loaded. Please retry.
          </p>
        )}
        {usingMockData && (
          <p className="text-xs text-blue-700">
            Backend lab-orders endpoint is not available yet. Showing sample data.
          </p>
        )}
      </section>
    </div>
  );
}
