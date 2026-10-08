// "use client";

// import { useEffect, useMemo, useState } from "react";
// import type { MouseEvent } from "react";
// import { useRouter } from "next/navigation";
// import { StatusBadge } from "@components/StatusBadge";
// import { useAuth } from "@context/AuthContext";
// import { consultationService, LabOrderStatusFilter, labService } from "@services/api";
// import {
//   LabOrder,
//   combineUniqueOrders,
//   formatDateTime,
//   // getMockLabOrdersByStatus,
//   isNotFoundApiError,
//   normalizeLabOrders,
//   toStatusBadgeType,
// } from "./labOrderUtils";

// const statusFilters: LabOrderStatusFilter[] = ["pending", "in_progress"];

// const buildDisplayName = (user: {
//   first_name?: string;
//   last_name?: string;
//   email?: string;
// } | null) => {
//   const fullName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();
//   if (fullName) return fullName;
//   return user?.email?.split("@")?.[0] || "Lab Scientist";
// };

// function QueueSkeleton() {
//   return (
//     <div className="space-y-3 rounded-md border border-gray-200 bg-white p-4">
//       {Array.from({ length: 4 }).map((_, index) => (
//         <div
//           key={index}
//           className="h-16 animate-pulse rounded-md bg-gray-100"
//         />
//       ))}
//     </div>
//   );
// }

// export default function LabScientistDashboardClient() {
//   const router = useRouter();
//   const { user, activeWorkspace } = useAuth();
//   const orgId = activeWorkspace?.id ?? null;

//   const [orders, setOrders] = useState<LabOrder[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [hasError, setHasError] = useState(false);
//   const [usingMockData, setUsingMockData] = useState(false);
//   const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

// //   useEffect(() => {
// //   if (!orgId) {
// //     setOrders([]);
// //     setLoading(false);
// //     return;
// //   }

// //   let ignore = false;

// //   const loadOrders = async () => {
// //     setLoading(true);
// //     setHasError(false);
// //     setUsingMockData(false);

// //     try {
// //        const consultations = await consultationService.listConsultations(orgId);
// //       const consultationIds = (consultations || []).map((c: any) => c.id);

// //       const responses = await Promise.allSettled(
// //         consultationIds.map((id: string) =>
// //           labService.listLabTests(orgId, id)
// //         )
// //       );

// //        console.log("consultations raw:", consultations);

// //       const successfulResponses = responses
// //         .filter(
// //           (r: { status: string; }): r is PromiseFulfilledResult<any> =>
// //             r.status === "fulfilled"
// //         )
// //         .map((r: { value: any; }) => r.value);

// //       const normalized = successfulResponses.flatMap((response) =>
// //         normalizeLabOrders(response)
// //       );

// //       if (!ignore) {
// //         setOrders(combineUniqueOrders(normalized));
// //       }
// //     } catch (error) {
// //       console.error("Failed to load lab queue", error);
// //       if (!ignore) {
// //         setOrders([]);
// //         setHasError(true);
// //       }
// //     } finally {
// //       if (!ignore) setLoading(false);
// //     }
// //   };

// //   void loadOrders();

// //   return () => {
// //     ignore = true;
// //   };
// // }, [orgId, activeWorkspace]);


// useEffect(() => {
//   if (!orgId) {
//     setOrders([]);
//     setLoading(false);
//     return;
//   }

//   let ignore = false;

//   const loadOrders = async () => {
//     setLoading(true);
//     setHasError(false);
//     setUsingMockData(false);

//     try {
//       const response = await labService.listOrganizationLabTests(orgId, {
//         statuses: ["pending", "in_progress"],
//       });

//       const normalized = normalizeLabOrders(response?.data ?? []);
//       console.log("Normalized lab orders:", normalized);

//       if (!ignore) {
//         setOrders(combineUniqueOrders(normalized));
//       }
//     } catch (error) {
//       console.error("Failed to load lab queue", error);

//       if (!ignore) {
//         setOrders([]);
//         setHasError(true);
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

//   const stats = useMemo(() => {
//     const pending = orders.filter((order) => order.status === "pending").length;
//     const inProgress = orders.filter(
//       (order) => order.status === "in_progress"
//     ).length;
//     return {
//       total: orders.length,
//       pending,
//       inProgress,
//     };
//   }, [orders]);

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
// const handleStartProcessing = async (
//   order: LabOrder,
//   event?: MouseEvent
// ) => {
//   event?.stopPropagation();
//   if (!orgId || order.status !== "pending") return;
//   if (processingIds.has(order.id)) return;

//   markProcessing(order.id, true);
//   try {
//     await labService.updateLabTestStatus(
//       orgId,
//       order.id,
//       "in_progress"
//     );

//     updateOrderStatus(order.id, "in_progress");
//   } catch (error) {
//     console.error("Failed to start lab order", error);
//   } finally {
//     markProcessing(order.id, false);
//   }
//   };
//   return (
//     <div className="space-y-6 py-2 sm:py-4">
//       <div className="space-y-1">
//         <h2 className="text-xl font-semibold text-[#1A2380] sm:text-2xl">
//           {greeting}, Sci. {buildDisplayName(user)}!
//         </h2>
//         <p className="text-sm text-gray-500">
//           Welcome back. Review pending and active test orders from your queue.
//         </p>
//       </div>

//       <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//         <div className="rounded-md border border-gray-200 bg-white p-4 shadow-sm">
//           <p className="text-xs text-gray-500">Total Orders</p>
//           <p className="mt-1 text-2xl font-semibold text-[#1A2380]">
//             {loading ? "..." : stats.total}
//           </p>
//         </div>
//         <div className="rounded-md border border-gray-200 bg-white p-4 shadow-sm">
//           <p className="text-xs text-gray-500">Pending</p>
//           <p className="mt-1 text-2xl font-semibold text-[#1A2380]">
//             {loading ? "..." : stats.pending}
//           </p>
//         </div>
//         <div className="rounded-md border border-gray-200 bg-white p-4 shadow-sm">
//           <p className="text-xs text-gray-500">In Progress</p>
//           <p className="mt-1 text-2xl font-semibold text-[#1A2380]">
//             {loading ? "..." : stats.inProgress}
//           </p>
//         </div>
//       </section>

//       <section className="space-y-3">
//         <div className="flex items-center justify-between gap-3">
//           <h3 className="text-lg font-semibold text-[#1A2380]">Test Order Queue</h3>
//           <button
//             type="button"
//             onClick={() => router.push("/dashboard/lab-scientist/test-orders")}
//             className="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
//           >
//             View All Orders
//           </button>
//         </div>

//         {loading && <QueueSkeleton />}

//         {!loading && orders.length === 0 && (
//           <div className="rounded-md border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
//             No pending or in-progress lab orders right now.
//           </div>
//         )}

//         {!loading && orders.length > 0 && (
//           <div className="rounded-md border border-gray-200 bg-white shadow-sm">
//             <div className="hidden overflow-x-auto lg:block">
//               <table className="w-full min-w-[980px] border-collapse text-left text-sm">
//                 <thead className="border-b bg-gray-50 text-gray-600">
//                   <tr>
//                     <th className="px-4 py-3 font-medium">Patient</th>
//                     <th className="px-4 py-3 font-medium">Test Type</th>
//                     <th className="px-4 py-3 font-medium">Ordering Doctor</th>
//                     <th className="px-4 py-3 font-medium">Time Ordered</th>
//                     <th className="px-4 py-3 font-medium">Priority</th>
//                     <th className="px-4 py-3 font-medium">Status</th>
//                     <th className="px-4 py-3 text-right font-medium">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {orders.map((order) => (
//                     <tr
//                       key={order.id}
//                       className="cursor-pointer border-b hover:bg-gray-50"
//                       onClick={() => openOrder(order.id)}
//                     >
//                       <td className="px-4 py-3">
//                         <div className="font-medium text-[#1A2380]">
//                           {order.patientName}
//                         </div>
//                         <div className="break-all text-xs text-gray-500">
//                           {order.patientId}
//                         </div>
//                       </td>
//                       <td className="px-4 py-3">{order.test_type}</td>
//                       <td className="px-4 py-3">{order.orderingDoctor}</td>
//                       <td className="px-4 py-3 text-gray-500">
//                         {formatDateTime(order.orderedAt)}
//                       </td>
//                       <td className="px-4 py-3">{order.priority}</td>
//                       <td className="px-4 py-3">
//                         <StatusBadge status={toStatusBadgeType(order.status)} />
//                       </td>
//                       <td className="px-4 py-3 text-right">
//                         <div className="inline-flex items-center gap-2">
//                           <button
//                             type="button"
//                             onClick={(event) => handleStartProcessing(order, event)}
//                             disabled={order.status !== "pending" || processingIds.has(order.id)}
//                             className="rounded-md border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
//                           >
//                             Start Processing
//                           </button>
//                           <button
//                             type="button"
//                             onClick={(event) => {
//                               event.stopPropagation();
//                               openOrder(order.id);
//                             }}
//                             className="rounded-md border border-gray-200 px-3 py-1.5 hover:bg-gray-50"
//                           >
//                             View
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div className="space-y-3 p-3 lg:hidden">
//               {orders.map((order) => (
//                 <div
//                   key={order.id}
//                   role="button"
//                   tabIndex={0}
//                   onClick={() => openOrder(order.id)}
//                   onKeyDown={(event) => {
//                     if (event.key === "Enter" || event.key === " ") {
//                       event.preventDefault();
//                       openOrder(order.id);
//                     }
//                   }}
//                   className="w-full rounded-md border border-gray-200 p-4 text-left hover:bg-gray-50"
//                 >
//                   <div className="mb-3 flex items-start justify-between gap-3">
//                     <div className="min-w-0">
//                       <p className="break-words font-medium text-[#1A2380]">
//                         {order.patientName}
//                       </p>
//                       <p className="break-all text-xs text-gray-500">{order.patientId}</p>
//                     </div>
//                     <StatusBadge status={toStatusBadgeType(order.status)} />
//                   </div>
//                   <div className="grid grid-cols-1 gap-2 text-xs text-gray-600 sm:grid-cols-2">
//                     <p>
//                       Test:{" "}
//                       <span className="font-medium text-gray-800">
//                         {order.test_type}
//                       </span>
//                     </p>
//                     <p>
//                       Priority:{" "}
//                       <span className="font-medium text-gray-800">
//                         {order.priority}
//                       </span>
//                     </p>
//                     <p className="sm:col-span-2">
//                       Doctor:{" "}
//                       <span className="font-medium text-gray-800">
//                         {order.orderingDoctor}
//                       </span>
//                     </p>
//                     <p className="sm:col-span-2">
//                       Ordered:{" "}
//                       <span className="font-medium text-gray-800">
//                         {formatDateTime(order.orderedAt)}
//                       </span>
//                     </p>
//                   </div>
//                   <div className="mt-3 flex flex-wrap gap-2">
//                     <button
//                       type="button"
//                       onClick={(event) => handleStartProcessing(order, event)}
//                       disabled={order.status !== "pending" || processingIds.has(order.id)}
//                       className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
//                     >
//                       Start Processing
//                     </button>
//                     <button
//                       type="button"
//                       onClick={(event) => {
//                         event.stopPropagation();
//                         openOrder(order.id);
//                       }}
//                       className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
//                     >
//                       View
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {hasError && (
//           <p className="text-xs text-amber-700">
//             Some queue data could not be loaded. Please retry.
//           </p>
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

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@context/AuthContext";
import { getTimeGreeting } from "@utils/greeting";
import { buildDisplayName } from "@utils/helper";
import { LabOrderQueueSkeleton, LabOrderTable, useLabOrders } from "./LabOrderQueue";

// How many active orders the dashboard previews; the rest are on Test Orders.
const QUEUE_PREVIEW = 8;

export default function LabScientistDashboardClient() {
  const router = useRouter();
  const { user, activeWorkspace } = useAuth();
  const orgId = activeWorkspace?.id ?? null;
  const greeting = getTimeGreeting();

  const { orders, loading, hasError, reload } = useLabOrders(orgId);

  // The queue is the work still to do: pending + in progress, oldest first.
  const activeOrders = useMemo(
    () =>
      orders
        .filter((order) => order.status === "pending" || order.status === "in_progress")
        .sort(
          (a, b) =>
            new Date(a.orderedAt ?? 0).getTime() - new Date(b.orderedAt ?? 0).getTime(),
        ),
    [orders],
  );

  const stats = useMemo(
    () => ({
      total: activeOrders.length,
      pending: activeOrders.filter((order) => order.status === "pending").length,
      inProgress: activeOrders.filter((order) => order.status === "in_progress").length,
    }),
    [activeOrders],
  );

  const openOrder = (id: string) => router.push(`/dashboard/lab-scientist/lab-orders/${id}`);

  return (
    <div className="space-y-6 py-2 sm:py-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-[#1A2380] sm:text-2xl">
          {greeting}, Sci. {buildDisplayName(user)}!
        </h2>
        <p className="text-sm text-gray-500">
          Welcome back. Review pending and active test orders from your queue.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          ["Active orders", stats.total],
          ["Pending", stats.pending],
          ["In progress", stats.inProgress],
        ].map(([label, value]) => (
          <div key={label} className="rounded-md border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">{label}</p>
            {loading ? (
              <div className="mt-2 h-8 w-16 animate-pulse rounded-md bg-slate-200" />
            ) : (
              <p className="mt-1 text-2xl font-semibold text-[#1A2380]">{value}</p>
            )}
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-[#1A2380]">Test Order Queue</h3>
          <button
            type="button"
            onClick={() => router.push("/dashboard/lab-scientist/test-orders")}
            className="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            View all orders
          </button>
        </div>

        {loading ? (
          <LabOrderQueueSkeleton rows={4} />
        ) : hasError ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            The queue couldn&apos;t be loaded.
            <button type="button" onClick={() => void reload()} className="rounded-md px-2 py-1 font-medium hover:bg-amber-100">
              Try again
            </button>
          </div>
        ) : activeOrders.length === 0 ? (
          <div className="rounded-md border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
            No pending or in-progress lab orders right now.
          </div>
        ) : (
          <div className="rounded-md border border-gray-200 bg-white shadow-sm">
            <LabOrderTable
              orders={activeOrders.slice(0, QUEUE_PREVIEW)}
              onOpen={openOrder}
              label="Lab orders awaiting action"
            />
            {activeOrders.length > QUEUE_PREVIEW ? (
              <p className="border-t border-gray-100 px-4 py-3 text-sm text-gray-500">
                Showing the {QUEUE_PREVIEW} oldest of {activeOrders.length} active orders.
              </p>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
}
