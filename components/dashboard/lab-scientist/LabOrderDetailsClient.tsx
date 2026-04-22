// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { ArrowLeft } from "lucide-react";
// import { StatusBadge } from "@components/StatusBadge";
// import { useAuth } from "@context/AuthContext";
// import { consultationService, labService } from "@services/api";
// import {
//   LabOrder,
//   formatDateTime,
//   // getMockLabOrderById,
//   isNotFoundApiError,
//   mapLabOrder,
//   toStatusBadgeType,
// } from "./labOrderUtils";

// function DetailsSkeleton() {
//   return (
//     <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
//       <div className="h-8 w-56 animate-pulse rounded bg-gray-100" />
//       <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
//         <div className="h-48 animate-pulse rounded bg-gray-100" />
//         <div className="h-48 animate-pulse rounded bg-gray-100" />
//       </div>
//     </div>
//   );
// }

// export default function LabOrderDetailsClient({ id }: { id: string }) {
//   const router = useRouter();
//   const { activeWorkspace } = useAuth();
//   const orgId = activeWorkspace?.id ?? null;

//   const [order, setOrder] = useState<LabOrder | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [hasError, setHasError] = useState(false);
//   const [usingMockData, setUsingMockData] = useState(false);

// useEffect(() => {
//   if (!orgId) {
//     setLoading(false);
//     setOrder(null);
//     return;
//   }

//   let ignore = false;

//   const loadDetails = async () => {
//     setLoading(true);
//     setHasError(false);
//     setUsingMockData(false);

//     try {
//          const consultationsRes = await consultationService.listConsultations(orgId);
// const consultations = Array.isArray(consultationsRes)
//   ? consultationsRes
//   : consultationsRes?.data ?? [];

// console.log("consultations normalized:", consultations);

// const consultationIds = consultations.map(
//   (c: any) => c.id || c._id || c.consultationId
// );

//       let found: any = null;
     

//       // 🔥 loop through consultations to find this lab test
//       for (const consultationId of consultationIds) {
//         const res = await labService.listLabTests(
//           orgId,
//           consultationId
//         );
//         console.log("lab tests response:", res);

//         const match = res?.data?.find(
//          (item: any) => String(item.id).trim() === String(id).trim()
//         );

//         if (match) {
//           found = match;
//           break;
//         }
//       }

//       if (!found) {
//         throw new Error("Lab test not found");
//       }

//       if (!ignore) {
//         setOrder(mapLabOrder(found));
//       }
//     } catch (error) {
//       // if (isNotFoundApiError(error)) {
//       //   // const mockOrder = getMockLabOrderById(id);
//       //   if (!ignore && mockOrder) {
//       //     setOrder(mockOrder);
//       //     setUsingMockData(true);
//       //     return;
//       //   }
//       // }

//       console.error("Failed to load lab order details", error);

//       if (!ignore) {
//         setHasError(true);
//         setOrder(null);
//       }
//     } finally {
//       if (!ignore) {
//         setLoading(false);
//       }
//     }
//   };

//   void loadDetails();

//   return () => {
//     ignore = true;
//   };
// }, [id, orgId, activeWorkspace]);

//   if (loading) {
//     return <DetailsSkeleton />;
//   }

//   if (!order) {
//     return (
//       <section className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
//         {hasError
//           ? "Unable to load this test order right now."
//           : "Lab order details are unavailable."}
//       </section>
//     );
//   }

//   return (
//     <div className="space-y-6 py-2 sm:py-4">
//       <div className="flex flex-wrap items-center gap-3">
//         <button
//           type="button"
//           onClick={() => router.push("/dashboard/lab-scientist/test-orders")}
//           className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
//         >
//           <ArrowLeft size={14} />
//           Back to Test Orders
//         </button>
//       </div>

//       <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
//         <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h2 className="text-xl font-semibold text-[#1A2380]">
//               Test Order {order.id}
//             </h2>
//             <p className="text-sm text-gray-500">{order.test_type}</p>
//           </div>
//           <div className="flex items-center">
//             <StatusBadge status={toStatusBadgeType(order.status)} />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
//           <div className="space-y-4 rounded-lg border border-gray-200 p-4">
//             <h3 className="text-sm font-semibold text-[#1A2380]">Patient Information</h3>
//             <div className="grid grid-cols-1 gap-2 text-sm text-gray-700 sm:grid-cols-2">
//               <p>
//                 Name: <span className="font-medium">{order.patientName}</span>
//               </p>
//               <p>
//                 Patient ID: <span className="font-medium">{order.patientId}</span>
//               </p>
//               <p>
//                 Gender: <span className="font-medium">{order.patientGender}</span>
//               </p>
//               <p>
//                 Age: <span className="font-medium">{order.patientAge}</span>
//               </p>
//             </div>
//           </div>

//           <div className="space-y-4 rounded-lg border border-gray-200 p-4">
//             <h3 className="text-sm font-semibold text-[#1A2380]">Order Summary</h3>
//             <div className="grid grid-cols-1 gap-2 text-sm text-gray-700 sm:grid-cols-2">
//               <p>
//                 Order Timestamp:{" "}
//                 <span className="font-medium">{formatDateTime(order.orderedAt)}</span>
//               </p>
//               <p>
//                 Priority: <span className="font-medium">{order.priority}</span>
//               </p>
//               <p>
//                 Ordering Doctor:{" "}
//                 <span className="font-medium">{order.orderingDoctor}</span>
//               </p>
//               <p>
//                 Sample Type: <span className="font-medium">{order.sampleType}</span>
//               </p>
//               <p className="sm:col-span-2">
//                 Department (read-only):{" "}
//                 <span className="font-medium">{order.departmentName}</span>
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
//           <div className="rounded-lg border border-gray-200 p-4">
//             <h3 className="mb-3 text-sm font-semibold text-[#1A2380]">Ordered Tests</h3>
//             <ul className="space-y-2 text-sm text-gray-700">
//               {order.orderedTests.length === 0 && (
//                 <li className="text-gray-500">No ordered tests listed.</li>
//               )}
//               {order.orderedTests.map((testName, index) => (
//                 <li key={`${testName}-${index}`} className="rounded-md bg-gray-50 px-3 py-2">
//                   {testName}
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div className="rounded-lg border border-gray-200 p-4">
//             <h3 className="mb-3 text-sm font-semibold text-[#1A2380]">Clinical Notes</h3>
//             <p className="text-sm leading-relaxed text-gray-700">{order.clinicalNotes}</p>
//           </div>
//         </div>
//       </section>
//       {usingMockData && (
//         <p className="text-xs text-blue-700">
//           Backend lab-order detail endpoint is not available yet. Showing sample data.
//         </p>
//       )}
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { StatusBadge } from "@components/StatusBadge";
import { useAuth } from "@context/AuthContext";
import { consultationService, labService } from "@services/api";
import {
  LabOrder,
  formatDateTime,
  isNotFoundApiError,
  normalizeLabOrders,
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

type ConsultationRecord = {
  id?: string;
  _id?: string;
  patient_name?: string;
  patient_id?: string;
  patient_gender?: string;
  patient_age?: string | number;
  department_name?: string;
  doctor_name?: string;
  ordering_doctor_name?: string;
  assigned_doctor_name?: string;
  patient?: {
    id?: string;
    patient_id?: string;
    name?: string;
    full_name?: string;
    first_name?: string;
    last_name?: string;
    gender?: string;
    age?: string | number;
  };
  doctor?: {
    name?: string;
    full_name?: string;
    first_name?: string;
    last_name?: string;
  };
  assigned_doctor?: {
    first_name?: string;
    last_name?: string;
  };
  department?: {
    name?: string;
  };
};

const getConsultationsArray = (response: any): ConsultationRecord[] => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.consultations)) return response.consultations;
  if (Array.isArray(response?.results)) return response.results;
  return [];
};

const getPatientName = (consultation?: ConsultationRecord, fallback = "") =>
  consultation?.patient_name ||
  consultation?.patient?.full_name ||
  consultation?.patient?.name ||
  `${consultation?.patient?.first_name ?? ""} ${
    consultation?.patient?.last_name ?? ""
  }`.trim() ||
  fallback ||
  "Unknown Patient";

const getPatientId = (consultation?: ConsultationRecord, fallback = "") =>
  consultation?.patient_id ||
  consultation?.patient?.id ||
  consultation?.patient?.patient_id ||
  fallback ||
  "";

const getDoctorName = (consultation?: ConsultationRecord, fallback = "") =>
  consultation?.ordering_doctor_name ||
  consultation?.doctor_name ||
  consultation?.doctor?.full_name ||
  consultation?.doctor?.name ||
  `${consultation?.doctor?.first_name ?? ""} ${
    consultation?.doctor?.last_name ?? ""
  }`.trim() ||
  `${consultation?.assigned_doctor?.first_name ?? ""} ${
    consultation?.assigned_doctor?.last_name ?? ""
  }`.trim() ||
  consultation?.assigned_doctor_name ||
  fallback ||
  "Unknown Doctor";

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
        const [labTestsResponse, consultationsRes] = await Promise.all([
          labService.listOrganizationLabTests(orgId, {
            statuses: ["pending", "in_progress", "completed"],
          }),
          consultationService.listConsultations(orgId),
        ]);

        const normalizedOrders = normalizeLabOrders(labTestsResponse?.data ?? []);
        const foundOrder =
          normalizedOrders.find(
            (item) => String(item.id).trim() === String(id).trim()
          ) ?? null;

        if (!foundOrder) {
          throw new Error("Lab test not found");
        }

        const consultations = getConsultationsArray(consultationsRes);
        const consultationMap = new Map<string, ConsultationRecord>(
          consultations
            .filter((consultation) => consultation?.id)
            .map((consultation) => [consultation.id as string, consultation])
        );

        const consultation = consultationMap.get(foundOrder.consultation_id ?? "");

        const enrichedOrder: LabOrder = {
          ...foundOrder,
          patientName: getPatientName(consultation, foundOrder.patientName),
          patientId: getPatientId(consultation, foundOrder.patientId),
          patientGender:
            consultation?.patient?.gender ||
            consultation?.patient_gender ||
            foundOrder.patientGender ||
            "-",
          patientAge:
            String(
              consultation?.patient?.age ??
                consultation?.patient_age ??
                foundOrder.patientAge ??
                "-"
            ) || "-",
          orderingDoctor: getDoctorName(
            consultation,
            foundOrder.orderingDoctor
          ),
          departmentName:
            consultation?.department_name ||
            consultation?.department?.name ||
            foundOrder.departmentName ||
            "-",
        };

        if (!ignore) {
          setOrder(enrichedOrder);
        }
      } catch (error) {
        console.error("Failed to load lab order details", error);

        if (!ignore) {
          if (isNotFoundApiError(error)) {
            setUsingMockData(true);
          }
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
            <p className="text-sm text-gray-500">
              {order.test_type || order.test_name}
            </p>
          </div>
          <div className="flex items-center">
            <StatusBadge status={toStatusBadgeType(order.status)} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="space-y-4 rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-[#1A2380]">
              Patient Information
            </h3>
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
            <h3 className="text-sm font-semibold text-[#1A2380]">
              Order Summary
            </h3>
            <div className="grid grid-cols-1 gap-2 text-sm text-gray-700 sm:grid-cols-2">
              <p>
                Order Timestamp:{" "}
                <span className="font-medium">
                  {formatDateTime(order.orderedAt)}
                </span>
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
            <h3 className="mb-3 text-sm font-semibold text-[#1A2380]">
              Ordered Tests
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {order.orderedTests.length === 0 && (
                <li className="text-gray-500">No ordered tests listed.</li>
              )}
              {order.orderedTests.map((testName, index) => (
                <li
                  key={`${testName}-${index}`}
                  className="rounded-md bg-gray-50 px-3 py-2"
                >
                  {testName}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="mb-3 text-sm font-semibold text-[#1A2380]">
              Clinical Notes
            </h3>
            <p className="text-sm leading-relaxed text-gray-700">
              {order.clinicalNotes}
            </p>
          </div>
        </div>
      </section>

      {usingMockData && (
        <p className="text-xs text-blue-700">
          Backend lab-order detail endpoint is not available yet. Showing sample
          data.
        </p>
      )}
    </div>
  );
}