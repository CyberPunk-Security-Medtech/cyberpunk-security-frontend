

//     useEffect(() => {
//   if (!orgId) {
//     setOrders([]);
//     setLoading(false);
//     return;
//   }

//   let ignore = false;

//   const loadOrders = async () => {
//     setLoading(true);
//     setUsingMockData(false);

//     try {
//       const [labTestsResponse, consultationsResponse] = await Promise.all([
//         labService.listOrganizationLabTests(orgId, {
//           statuses: FETCH_STATUSES,
//         }),
//         consultationService.listConsultations(orgId),
//       ]);

//       const normalizedOrders = normalizeLabOrders(labTestsResponse?.data ?? []);

//       const consultations = Array.isArray(consultationsResponse)
//         ? consultationsResponse
//         : consultationsResponse?.data ||
//           consultationsResponse?.consultations ||
//           consultationsResponse?.results ||
//           [];

//       const consultationMap = new Map(
//         consultations
//           .filter((consultation: any) => consultation?.id)
//           .map((consultation: any) => [consultation.id, consultation])
//       );

//       const enrichedOrders = normalizedOrders.map((order) => {
//         const consultation = consultationMap.get(order.consultation_id);

//         const patientName =
//           consultation?.patient_name ||
//           consultation?.patient?.full_name ||
//           consultation?.patient?.name ||
//           `${consultation?.patient?.first_name ?? ""} ${consultation?.patient?.last_name ?? ""}`.trim() ||
//           order.patientName ||
//           "Unknown Patient";

//         const patientId =
//           consultation?.patient_id ||
//           consultation?.patient?.id ||
//           order.patientId ||
//           "";

//         const patientGender =
//           consultation?.patient?.gender ||
//           consultation?.patient_gender ||
//           order.patientGender ||
//           "-";

//         const patientAge =
//           String(
//             consultation?.patient?.age ??
//               consultation?.patient_age ??
//               order.patientAge ??
//               "-"
//           ) || "-";

//         const orderingDoctor =
//           consultation?.ordering_doctor_name ||
//           consultation?.doctor_name ||
//           consultation?.doctor?.full_name ||
//           consultation?.doctor?.name ||
//           `${consultation?.doctor?.first_name ?? ""} ${consultation?.doctor?.last_name ?? ""}`.trim() ||
//           `${consultation?.assigned_doctor?.first_name ?? ""} ${consultation?.assigned_doctor?.last_name ?? ""}`.trim() ||
//           consultation?.assigned_doctor_name ||
//           order.orderingDoctor ||
//           "Unknown Doctor";

//         const departmentName =
//           consultation?.department_name ||
//           consultation?.department?.name ||
//           order.departmentName ||
//           "-";

//         return {
//           ...order,
//           patientName,
//           patientId,
//           patientGender,
//           patientAge,
//           orderingDoctor,
//           departmentName,
//         };
//       });

//       if (!ignore) {
//         setOrders(combineUniqueOrders(enrichedOrders));
//       }
//     } catch (error) {
//       console.error("Failed to load test orders", error);
//       if (!ignore) {
//         setOrders([]);
//       }
//     } finally {
//       if (!ignore) {
//         setLoading(false);
//       }
//     }
//   };

//   void loadOrders();

//   return () => {
//     ignore = true;
//   };
// }, [orgId]);

// const handleCreateOrder = async () => {
//     if (!form.patientId || !form.test_type) return;

    

//     try {
//       const consultations: any[] = await consultationService.listConsultations(orgId as string);
//       console.log("consultations:", consultations);
//       const consultationIds = (consultations || []).map((c: any) => c.id);
//       if (!usingMockData && orgId) {
//         const res = await labService.createLabTest?.(orgId, selectedConsultationId, form)
//         const created = res?.data;

//       const newOrder: LabOrder = {
//       id: created.id,
//       patientName: "",
//       patientId: form.patientId,
//       test_type: form.test_type,
//       test_name: form.test_name,
//       orderingDoctor: "",
//       priority: form.priority,
//       status: "pending",
//       orderedAt: new Date().toISOString(),
//       patientGender: "N/A",
//       patientAge: "0",
//       sampleType: "N/A",
//       departmentName: "N/A",
//       clinicalNotes: "",
//       orderedTests: [],
//     };

      

  
//       setOrders((prev) => [newOrder, ...prev]);
//   }

//       setIsModalOpen(false);
//       setForm({
//         // patientName: "",
//         patientId: "",
//         test_type: "",
//         test_name: "",
//         doctor: "",
//         priority: "Normal",
//       });
//     } catch (error) {
//       console.error("Failed to create order", error);
//     }
//   };


//   const counts = useMemo(() => {
//     const result: Record<TabFilter, number> = {
//       all: orders.length,
//       pending: 0,
//       in_progress: 0,
//       completed: 0,
//       critical: 0,
//     };

//     for (const order of orders) {
//       if (order.status === "pending") result.pending += 1;
//       if (order.status === "in_progress") result.in_progress += 1;
//       if (order.status === "completed") result.completed += 1;
//       if (isCriticalOrder(order)) result.critical += 1;
//     }

//     return result;
//   }, [orders]);

//   const filteredOrders = useMemo(() => {
//     const text = query.trim().toLowerCase();
//     return orders.filter((order) => {
//       const tabMatch =
//         tab === "all"
//           ? true
//           : tab === "critical"
//           ? isCriticalOrder(order)
//           : order.status === tab;

//       const searchMatch =
//         text.length === 0 ||
//         order.patientName.toLowerCase().includes(text) ||
//         order.patientId.toLowerCase().includes(text) ||
//         order.test_type.toLowerCase().includes(text) ||
//         order.id.toLowerCase().includes(text);

//       return tabMatch && searchMatch;
//     });
//   }, [orders, query, tab]);

//   const openOrder = (id: string) => {
//     router.push(`/dashboard/lab-scientist/lab-orders/${id}`);
//   };

//   const markProcessing = (id: string, active: boolean) => {
//     setProcessingIds((prev) => {
//       const next = new Set(prev);
//       if (active) {
//         next.add(id);
//       } else {
//         next.delete(id);
//       }
//       return next;
//     });
//   };

//   const updateOrderStatus = (id: string, status: LabOrder["status"]) => {
//     setOrders((prev) =>
//       prev.map((order) => (order.id === id ? { ...order, status } : order))
//     );
//   };

//   // const handleStartProcessing = async (
//   //   order: LabOrder,
//   //   event?: MouseEvent
//   // ) => {
//   //   event?.stopPropagation();
//   //   if (!orgId || order.status !== "pending") return;
//   //   if (processingIds.has(order.id)) return;

//   //   markProcessing(order.id, true);
//   //   try {
//   //     if (!usingMockData) {
//   //       await labService.startLabOrder(orgId, order.id);
//   //     }
//   //     updateOrderStatus(order.id, "in_progress");
//   //   } catch (error) {
//   //     console.error("Failed to start lab order", error);
//   //   } finally {
//   //     markProcessing(order.id, false);
//   //   }
//   // };
//   console.log("rendering TestOrdersPageClient with orders:", orders, "filteredOrders:", filteredOrders, "loading:", loading, "usingMockData:", usingMockData);
//   return (
//     <div className="space-y-6 py-2 sm:py-4">
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
//         <div className="space-y-1">
//           <h2 className="text-xl font-semibold text-[#1A2380] sm:text-2xl">
//             Test Orders
//           </h2>
//           <p className="text-sm text-gray-500">
//             Track and review all lab orders from doctors.
//           </p>
//         </div>
//         <button
//           type="button"
//           onClick={() => setIsModalOpen(true)}
//           className="inline-flex h-12 items-center justify-center rounded-full bg-[#007F73] px-6 text-base font-medium text-white hover:bg-[#006E64]"
//         >
//           + New Test Order
//         </button>
//       </div>

//        <Modal
//         title="Create Test Order"
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//       >
//         <div className="space-y-4">
//       <select
//   value={selectedConsultationId}
//   onChange={(e) => setSelectedConsultationId(e.target.value)}
//   className="w-full border p-2 rounded"
// >
//   <option value="">Select Consultation</option>
//   {consultations.map((c: any) => (
//     <option key={c.id || c._id} value={c.id || c._id}>
//       {c.patient?.first_name||"Unknown Patient"} - {c.patient?.last_name||"Unknown Patient"} 
//     </option>
//   ))}
// </select>
//           <input
//             placeholder="Patient ID"
//             value={form.patientId}
//             onChange={(e) =>
//               setForm({ ...form, patientId: e.target.value })
//             }
//             className="w-full border p-2 rounded"
//           />
//           <input
//             placeholder="Test Type"
//             value={form.test_type}
//             onChange={(e) =>
//               setForm({ ...form, test_type: e.target.value })
//             }
//             className="w-full border p-2 rounded"
//           />
//           <input
//             placeholder="Test Name"
//             value={form.test_name}
//             onChange={(e) =>
//               setForm({ ...form, test_name: e.target.value })
//             }
//             className="w-full border p-2 rounded"
//           />
//           <input
//             placeholder="Doctor"
//             value={form.doctor}
//             onChange={(e) =>
//               setForm({ ...form, doctor: e.target.value })
//             }
//             className="w-full border p-2 rounded"
//           />

//           <button
//             onClick={handleCreateOrder}
//             className="w-full bg-[#00B8A8] text-white py-2 rounded"
//           >
//             Create Order
//           </button>
//         </div>
//       </Modal>

//       <section className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
//         <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
//           <div className="flex flex-wrap gap-2">
//             {(Object.keys(TAB_LABELS) as TabFilter[]).map((key) => {
//               const active = tab === key;
//               return (
//                 <button
//                   key={key}
//                   type="button"
//                   onClick={() => setTab(key)}
//                   className={`rounded-full px-3 py-1.5 text-sm transition ${
//                     active
//                       ? "bg-[#00B8A8] text-white"
//                       : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
//                   }`}
//                 >
//                   {TAB_LABELS[key]} ({counts[key]})
//                 </button>
//               );
//             })}
//           </div>

//           <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
//             <div className="relative w-full sm:w-64">
//               <Search
//                 size={16}
//                 className="pointer-events-none absolute left-3 top-2.5 text-gray-400"
//               />
//               <input
//                 value={query}
//                 onChange={(event) => setQuery(event.target.value)}
//                 placeholder="Search test order"
//                 className="w-full rounded-full border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-[#00B8A8]"
//               />
//             </div>

//             <div className="inline-flex overflow-hidden rounded-md border border-gray-200">
//               <button
//                 type="button"
//                 onClick={() => setViewMode("cards")}
//                 className={`px-3 py-2 ${viewMode === "cards" ? "bg-[#1A2380] text-white" : "bg-white text-gray-600"}`}
//                 aria-label="Card view"
//               >
//                 <LayoutGrid size={16} />
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setViewMode("table")}
//                 className={`px-3 py-2 ${viewMode === "table" ? "bg-[#1A2380] text-white" : "bg-white text-gray-600"}`}
//                 aria-label="Table view"
//               >
//                 <List size={16} />
//               </button>
//             </div>
//           </div>
//         </div>

//         {loading && <OrdersSkeleton />}

//         {!loading && filteredOrders.length === 0 && (
//           <div className="rounded-lg border border-dashed border-gray-300 p-6 text-sm text-gray-500">
//             No lab test orders matched your filter.
//           </div>
//         )}

//         {!loading && filteredOrders.length > 0 && viewMode === "cards" && (
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
//             {filteredOrders.map((order) => (
//               <div
//                 key={order.id}
//                 className="rounded-xl border border-gray-200 bg-white p-4"
//               >
//                 <div className="mb-3 flex items-start justify-between gap-3">
//                   <div className="min-w-0">
//                     <p className="break-words text-sm font-semibold text-[#1A2380]">
//                       {order.patientName}
//                     </p>
//                     <p className="break-all text-xs text-gray-500">{order.id}</p>
//                   </div>
//                   <StatusBadge status={toStatusBadgeType(order.status)} />
//                 </div>

//                 <div className="space-y-1 text-xs text-gray-600">
//                   <p>
//                     Test Type:{" "}
//                     <span className="font-medium text-gray-800">{order.test_type}</span>
//                   </p>
//                   <p>
//                     Ordering Doctor:{" "}
//                     <span className="font-medium text-gray-800">
//                       {order.orderingDoctor}
//                     </span>
//                   </p>
//                   <p>
//                     Ordered:{" "}
//                     <span className="font-medium text-gray-800">
//                       {formatDateTime(order.orderedAt)}
//                     </span>
//                   </p>
//                   <p>
//                     Priority:{" "}
//                     <span className="font-medium text-gray-800">
//                       {order.priority}
//                     </span>
//                   </p>
//                 </div>

//                 <div className="mt-4 space-y-2">
//                   <button
//                     type="button"
//                     // onClick={(event) => handleStartProcessing(order, event)}
//                     disabled={order.status !== "pending" || processingIds.has(order.id)}
//                     className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
//                   >
//                     Start Processing
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => openOrder(order.id)}
//                     className="w-full rounded-full bg-[#00B8A8] px-4 py-2 text-sm font-medium text-white hover:bg-[#00A899]"
//                   >
//                     View Test Report
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {!loading && filteredOrders.length > 0 && viewMode === "table" && (
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[980px] border-collapse text-left text-sm">
//               <thead className="border-b bg-gray-50 text-gray-600">
//                 <tr>
//                   <th className="px-4 py-3 font-medium">Order ID</th>
//                   <th className="px-4 py-3 font-medium">Patient Name</th>
//                   <th className="px-4 py-3 font-medium">Test Type</th>
//                   <th className="px-4 py-3 font-medium">Ordering Doctor</th>
//                   <th className="px-4 py-3 font-medium">Order Date</th>
//                   <th className="px-4 py-3 font-medium">Status</th>
//                   <th className="px-4 py-3 text-right font-medium">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredOrders.map((order) => (
//                   <tr
//                     key={order.id}
//                     className="cursor-pointer border-b hover:bg-gray-50"
//                     onClick={() => openOrder(order.id)}
//                   >
//                     <td className="px-4 py-3">{order.id}</td>
//                     <td className="px-4 py-3">{order.patientName}</td>
//                     <td className="px-4 py-3">{order.test_type}</td>
//                     <td className="px-4 py-3">{order.orderingDoctor}</td>
//                     <td className="px-4 py-3 text-gray-500">
//                       {formatDateTime(order.orderedAt)}
//                     </td>
//                     <td className="px-4 py-3">
//                       <StatusBadge status={toStatusBadgeType(order.status)} />
//                     </td>
//                     <td className="px-4 py-3 text-right">
//                       <div className="inline-flex items-center gap-2">
//                         <button
//                           type="button"
//                           // onClick={(event) => handleStartProcessing(order, event)}
//                           disabled={order.status !== "pending" || processingIds.has(order.id)}
//                           className="rounded-md border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
//                         >
//                           Start Processing
//                         </button>
//                         <button
//                           type="button"
//                           onClick={(event) => {
//                             event.stopPropagation();
//                             openOrder(order.id);
//                           }}
//                           className="rounded-md border border-gray-200 px-3 py-1.5 hover:bg-gray-50"
//                         >
//                           View
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//         {usingMockData && (
//           <p className="text-xs text-blue-700">
//             Backend lab-orders endpoint is not available yet. Showing sample data.
//           </p>
//         )}
//       </section>
//     </div>
//   );
// }


"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutGrid, List, Search } from "lucide-react";
import { StatusBadge } from "@components/StatusBadge";
import { useAuth } from "@context/AuthContext";
import {
  consultationService,
  LabOrderStatusFilter,
  labService,
} from "@services/api";
import {
  LabOrder,
  combineUniqueOrders,
  formatDateTime,
  normalizeLabOrders,
  toStatusBadgeType,
  RawConsultation,
  getConsultationsArray,
  buildPatientName,
  getPatientId,
  buildDoctorName,
} from "./labOrderUtils";
import CreateTestOrderModal from "./CreateTestOrderModal";

type ViewMode = "cards" | "table";
type TabFilter = "all" | "pending" | "in_progress" | "completed" | "critical";

const FETCH_STATUSES: LabOrderStatusFilter[] = [
  "pending",
  "in_progress",
  "completed",
];

const TAB_LABELS: Record<TabFilter, string> = {
  all: "All Tests",
  pending: "Pending Tests",
  in_progress: "In-Progress Tests",
  completed: "Completed Tests",
  critical: "Critical",
};

const isCriticalOrder = (order: LabOrder): boolean => {
  const normalized = order.priority.toLowerCase();
  return ["urgent", "emergency", "critical", "stat"].includes(normalized);
};

function OrdersSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-52 animate-pulse rounded-xl border border-gray-200 bg-white"
        />
      ))}
    </div>
  );
}

export default function TestOrdersPageClient() {
  const router = useRouter();
  const { activeWorkspace } = useAuth();
  const orgId = activeWorkspace?.id ?? null;

  const [orders, setOrders] = useState<LabOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [tab, setTab] = useState<TabFilter>("all");
  const [query, setQuery] = useState("");
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (!orgId) {
      setOrders([]);
      setLoading(false);
      return;
    }

    let ignore = false;

    const loadOrders = async () => {
      setLoading(true);

      try {
        const [labTestsResponse, consultationsResponse] = await Promise.all([
          labService.listOrganizationLabTests(orgId, {
            statuses: FETCH_STATUSES,
          }),
          consultationService.listConsultations(orgId),
        ]);

        const rawLabTests = Array.isArray(labTestsResponse?.data)
          ? labTestsResponse.data
          : Array.isArray(labTestsResponse)
            ? labTestsResponse
            : [];
        const normalizedOrders = normalizeLabOrders(rawLabTests);
        const consultationList = getConsultationsArray(consultationsResponse);

        const consultationMap = new Map<string, RawConsultation>(
          consultationList
            .filter((consultation) => consultation?.id)
            .map((consultation) => [consultation.id, consultation])
        );

        const enrichedOrders = normalizedOrders.map((order) => {
          const consultation = consultationMap.get(order.consultation_id!);

          return {
            ...order,
            patientName: buildPatientName(consultation!, order.patientName),
            patientId: getPatientId(consultation!, order.patientId),
            patientGender:
              consultation?.patient?.gender ||
              (consultation as any)?.patient_gender ||
              order.patientGender ||
              "-",
            patientAge:
              String(
                consultation?.patient?.age ??
                  (consultation as any)?.patient_age ??
                  order.patientAge ??
                  "-"
              ) || "-",
            orderingDoctor: buildDoctorName(
              consultation!,
              order.orderingDoctor
            ),
            departmentName:
              consultation?.department_name ||
              consultation?.department?.name ||
              order.departmentName ||
              "-",
          };
        });

        if (!ignore) {
          setOrders(combineUniqueOrders(enrichedOrders));
        }
      } catch (error) {
        console.error("Failed to load test orders", error);

        if (!ignore) {
          setOrders([]);
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

  const counts = useMemo(() => {
    const result: Record<TabFilter, number> = {
      all: orders.length,
      pending: 0,
      in_progress: 0,
      completed: 0,
      critical: 0,
    };

    for (const order of orders) {
      if (order.status === "pending") result.pending += 1;
      if (order.status === "in_progress") result.in_progress += 1;
      if (order.status === "completed") result.completed += 1;
      if (isCriticalOrder(order)) result.critical += 1;
    }

    return result;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const text = query.trim().toLowerCase();

    return orders.filter((order) => {
      const tabMatch =
        tab === "all"
          ? true
          : tab === "critical"
          ? isCriticalOrder(order)
          : order.status === tab;

      const searchMatch =
        text.length === 0 ||
        order.patientName.toLowerCase().includes(text) ||
        order.patientId.toLowerCase().includes(text) ||
        order.test_type.toLowerCase().includes(text) ||
        order.id.toLowerCase().includes(text);

      return tabMatch && searchMatch;
    });
  }, [orders, query, tab]);

  const openOrder = (id: string) => {
    router.push(`/dashboard/lab-scientist/lab-orders/${id}`);
  };

  const updateOrderStatus = (id: string, status: LabOrder["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? {
              ...order,
              status,
            }
          : order
      )
    );
  };

  const handleOrderCreated = (order: LabOrder) => {
    setOrders((current) => combineUniqueOrders([order, ...current]));
  };

  return (
    <div className="space-y-6 py-2 sm:py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-[#1A2380] sm:text-2xl">
            Test Orders
          </h2>
          <p className="text-sm text-gray-500">
            Track and review all lab orders from doctors.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex h-11 items-center justify-center rounded-full bg-[#007F73] px-5 text-sm font-medium text-white hover:bg-[#006E64]"
        >
          + Create lab test
        </button>
      </div>

      <CreateTestOrderModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onOrderCreated={handleOrderCreated}
      />

      <section className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(TAB_LABELS) as TabFilter[]).map((key) => {
              const active = tab === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  className={`rounded-full px-3 py-1.5 text-sm transition ${
                    active
                      ? "bg-[#00B8A8] text-white"
                      : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {TAB_LABELS[key]} ({counts[key]})
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-64">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-2.5 text-gray-400"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search test order"
                className="w-full rounded-full border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-[#00B8A8]"
              />
            </div>

            <div className="inline-flex overflow-hidden rounded-md border border-gray-200">
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`px-3 py-2 ${
                  viewMode === "cards"
                    ? "bg-[#1A2380] text-white"
                    : "bg-white text-gray-600"
                }`}
                aria-label="Card view"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`px-3 py-2 ${
                  viewMode === "table"
                    ? "bg-[#1A2380] text-white"
                    : "bg-white text-gray-600"
                }`}
                aria-label="Table view"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {loading && <OrdersSkeleton />}

        {!loading && filteredOrders.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 p-6 text-sm text-gray-500">
            No lab test orders matched your filter.
          </div>
        )}

        {!loading && filteredOrders.length > 0 && viewMode === "cards" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl border border-gray-200 bg-white p-4"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold text-[#1A2380]">
                      {order.patientName || "Unknown Patient"}
                    </p>
                    <p className="break-all text-xs text-gray-500">{order.id}</p>
                  </div>
                  <StatusBadge status={toStatusBadgeType(order.status)} />
                </div>

                <div className="space-y-1 text-xs text-gray-600">
                  <p>
                    Test Type:{" "}
                    <span className="font-medium text-gray-800">
                      {order.test_type || order.test_name || "-"}
                    </span>
                  </p>
                  <p>
                    Ordering Doctor:{" "}
                    <span className="font-medium text-gray-800">
                      {order.orderingDoctor || "Unknown Doctor"}
                    </span>
                  </p>
                  <p>
                    Ordered:{" "}
                    <span className="font-medium text-gray-800">
                      {formatDateTime(order.orderedAt)}
                    </span>
                  </p>
                  <p>
                    Priority:{" "}
                    <span className="font-medium text-gray-800">
                      {order.priority}
                    </span>
                  </p>
                </div>

                <div className="mt-4 space-y-2">
                  <button
                    type="button"
                    onClick={() => openOrder(order.id)}
                    className="w-full rounded-full bg-[#00B8A8] px-4 py-2 text-sm font-medium text-white hover:bg-[#00A899]"
                  >
                    View Test Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredOrders.length > 0 && viewMode === "table" && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left text-sm">
              <thead className="border-b bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Order ID</th>
                  <th className="px-4 py-3 font-medium">Patient Name</th>
                  <th className="px-4 py-3 font-medium">Test Type</th>
                  <th className="px-4 py-3 font-medium">Ordering Doctor</th>
                  <th className="px-4 py-3 font-medium">Order Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="cursor-pointer border-b hover:bg-gray-50"
                    onClick={() => openOrder(order.id)}
                  >
                    <td className="px-4 py-3">{order.id}</td>
                    <td className="px-4 py-3">
                      {order.patientName || "Unknown Patient"}
                    </td>
                    <td className="px-4 py-3">
                      {order.test_type || order.test_name || "-"}
                    </td>
                    <td className="px-4 py-3">
                      {order.orderingDoctor || "Unknown Doctor"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {formatDateTime(order.orderedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={toStatusBadgeType(order.status)} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            openOrder(order.id);
                          }}
                          className="rounded-md border border-gray-200 px-3 py-1.5 hover:bg-gray-50"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </section>
    </div>
  );
}
