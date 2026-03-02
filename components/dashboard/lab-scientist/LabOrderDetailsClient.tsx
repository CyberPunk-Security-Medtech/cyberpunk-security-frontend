"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { StatusBadge } from "@components/StatusBadge";
import { useAuth } from "@context/AuthContext";
import { labService } from "@services/api";
import {
  LabOrder,
  formatDateTime,
  getMockLabOrderById,
  isNotFoundApiError,
  mapLabOrder,
  toStatusBadgeType,
} from "./labOrderUtils";

function DetailsSkeleton() {
  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="h-8 w-56 animate-pulse rounded bg-gray-100" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="h-48 animate-pulse rounded bg-gray-100" />
        <div className="h-48 animate-pulse rounded bg-gray-100" />
      </div>
    </div>
  );
}

export default function LabOrderDetailsClient({ id }: { id: string }) {
  const router = useRouter();
  const { activeWorkspace } = useAuth();
  const orgId = activeWorkspace?.id ?? null;

  const [order, setOrder] = useState<LabOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    if (!orgId) {
      setLoading(false);
      setOrder(null);
      return;
    }

    let ignore = false;

    const loadDetails = async () => {
      setLoading(true);
      setHasError(false);
      setUsingMockData(false);

      try {
        const response = await labService.getLabOrderDetails(orgId, id);
        if (!ignore) {
          setOrder(mapLabOrder(response));
        }
      } catch (error) {
        if (isNotFoundApiError(error)) {
          const mockOrder = getMockLabOrderById(id);
          if (!ignore && mockOrder) {
            setOrder(mockOrder);
            setUsingMockData(true);
            return;
          }
        }

        console.error("Failed to load lab order details", error);
        if (!ignore) {
          setHasError(true);
          setOrder(null);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void loadDetails();

    return () => {
      ignore = true;
    };
  }, [id, orgId]);

  if (loading) {
    return <DetailsSkeleton />;
  }

  if (!order) {
    return (
      <section className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
        {hasError
          ? "Unable to load this test order right now."
          : "Lab order details are unavailable."}
      </section>
    );
  }

  return (
    <div className="space-y-6 py-2 sm:py-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => router.push("/dashboard/lab-scientist/test-orders")}
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft size={14} />
          Back to Test Orders
        </button>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#1A2380]">
              Test Order {order.id}
            </h2>
            <p className="text-sm text-gray-500">{order.testType}</p>
          </div>
          <div className="flex items-center">
            <StatusBadge status={toStatusBadgeType(order.status)} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="space-y-4 rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-[#1A2380]">Patient Information</h3>
            <div className="grid grid-cols-1 gap-2 text-sm text-gray-700 sm:grid-cols-2">
              <p>
                Name: <span className="font-medium">{order.patientName}</span>
              </p>
              <p>
                Patient ID: <span className="font-medium">{order.patientId}</span>
              </p>
              <p>
                Gender: <span className="font-medium">{order.patientGender}</span>
              </p>
              <p>
                Age: <span className="font-medium">{order.patientAge}</span>
              </p>
            </div>
          </div>

          <div className="space-y-4 rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-[#1A2380]">Order Summary</h3>
            <div className="grid grid-cols-1 gap-2 text-sm text-gray-700 sm:grid-cols-2">
              <p>
                Order Timestamp:{" "}
                <span className="font-medium">{formatDateTime(order.orderedAt)}</span>
              </p>
              <p>
                Priority: <span className="font-medium">{order.priority}</span>
              </p>
              <p>
                Ordering Doctor:{" "}
                <span className="font-medium">{order.orderingDoctor}</span>
              </p>
              <p>
                Sample Type: <span className="font-medium">{order.sampleType}</span>
              </p>
              <p className="sm:col-span-2">
                Department (read-only):{" "}
                <span className="font-medium">{order.departmentName}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="mb-3 text-sm font-semibold text-[#1A2380]">Ordered Tests</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {order.orderedTests.length === 0 && (
                <li className="text-gray-500">No ordered tests listed.</li>
              )}
              {order.orderedTests.map((testName, index) => (
                <li key={`${testName}-${index}`} className="rounded-md bg-gray-50 px-3 py-2">
                  {testName}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="mb-3 text-sm font-semibold text-[#1A2380]">Clinical Notes</h3>
            <p className="text-sm leading-relaxed text-gray-700">{order.clinicalNotes}</p>
          </div>
        </div>
      </section>
      {usingMockData && (
        <p className="text-xs text-blue-700">
          Backend lab-order detail endpoint is not available yet. Showing sample data.
        </p>
      )}
    </div>
  );
}
