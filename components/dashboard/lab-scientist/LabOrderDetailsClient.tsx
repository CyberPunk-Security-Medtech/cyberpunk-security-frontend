// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { StatusBadge } from "@components/StatusBadge";
// import { useAuth } from "@context/AuthContext";
// import { consultationService, labService, patientService } from "@services/api";
// import {
//   LabOrder,
//   formatDateTime,
//   isNotFoundApiError,
//   mapLabOrder,
//   toStatusBadgeType,
//   RawConsultation,
//   Attachment,
//   getConsultationsArray,
//   normalizeLabOrders,
//   buildPatientName,
//   getPatientId,
//   buildDoctorName,
// } from "./labOrderUtils";
// import Modal from "@components/Modal";
// import { Textarea, FieldLabel } from "@components/Field";
// import Button from "@components/Button";
// import { toast } from "react-toastify";
// import {
//   ArrowLeft,
//   Plus,
//   File,
//   FileText,
//   Trash2,
//   Upload,
//   Download,
// } from "lucide-react";

// function LabReportSection({
//   order,
//   orgId,
//   id,
// }: {
//   order: LabOrder;
//   orgId: string | null;
//   id: string;
// }) {
//   const [report, setReport] = useState<string | null>(null);
//   const [reportLoading, setReportLoading] = useState(false);
//   const [reportModalOpen, setReportModalOpen] = useState(false);
//   const [reportDraft, setReportDraft] = useState("");
//   const [reportSubmitting, setReportSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState<string | null>(null);
//   const [attachments, setAttachments] = useState<Attachment[]>([]);
//   const [uploading, setUploading] = useState(false);

//  const loadAttachments = useCallback(
//   async (orgIdParam?: string, labTestId?: string) => {
//     if (!orgIdParam || !labTestId) return;

//     try {
//       const list = await labService.listLabReportAttachments(
//         orgIdParam,
//         labTestId,
//       );

//       const arr = Array.isArray(list)
//         ? list
//         : list?.attachments || list?.data || [];

//       setAttachments(arr);
//     } catch (err) {
//       console.warn("Failed to load attachments", err);
//     }
//   },
//   [],
// );
//   useEffect(() => {
//     let ignore = false;

//     const loadReport = async () => {
//       if (!orgId) return;
//       setReportLoading(true);
//       try {
//         const res = await labService.getLabReport(orgId, id);
//        const text =
//   res?.results ??
//   res?.data?.results ??
//   (typeof res === "string" ? res : null);
//         if (!ignore) setReport(text ?? null);
//         if (!ignore) void loadAttachments(orgId, id);
//       } catch (err) {
//         if (!isNotFoundApiError(err)) {
//           console.error("Failed to load lab report", err);
//         }
//       } finally {
//         if (!ignore) setReportLoading(false);
//       }
//     };

//     void loadReport();

//     return () => {
//       ignore = true;
//     };
//   }, [id, orgId, loadAttachments]);

//   const openReportModal = () => {
//     setReportDraft(report ?? "");
//     setSubmitError(null);
//     setReportModalOpen(true);
//   };

//   const closeReportModal = () => {
//     setReportModalOpen(false);
//     setReportDraft("");
//     setSubmitError(null);
//   };

//   const handleSubmitReport = async () => {
//     if (!orgId) return toast.error("No organization selected");
//     if (!order) return toast.error("No lab order available");
//     if (!reportDraft.trim()) return toast.error("Enter the report findings before submitting.");

//     const confirmed = window.confirm(
//       report
//         ? "Submit corrected report? This will overwrite existing report."
//         : "Submit report for this test?",
//     );
//     if (!confirmed) return;

//     setReportSubmitting(true);
//     setSubmitError(null);
//     try {
//       if (report) {
//         await labService.correctLabReport(orgId, order.id, {
//           results: reportDraft,
//         });
//         toast.success("Report updated");
//       } else {
//         await labService.submitLabReport(orgId, order.id, {
//           results: reportDraft,
//         });
//         toast.success("Report submitted");
//       }

//       const refreshed = await labService.getLabReport(orgId, order.id);
//      const text =
//   refreshed?.results ??
//   refreshed?.data?.results ??
//   (typeof refreshed === "string" ? refreshed : null);

// setReport(text);

//       try {
//         await labService.updateLabTestStatus(orgId, order.id, "Completed");
//       } catch (e) {
//         console.warn("Failed to update test status after report submit", e);
//       }

//       closeReportModal();
//       void loadAttachments(orgId, order.id);
//     } catch (err: any) {
//       console.error("Report submission failed", err);
//       setSubmitError(
//         err?.response?.data?.message || err?.message || "Submission failed",
//       );
//       toast.error("Failed to submit report");
//     } finally {
//       setReportSubmitting(false);
//     }
//   };

//   // const handleFileUpload = async (file?: File) => {
//   //   if (!orgId || !order || !file) return;
//   //   setUploading(true);
//   //   try {
//   //     await labService.uploadLabReportAttachment(orgId, order.id, file);
//   //     toast.success("Attachment uploaded");
//   //     await loadAttachments(orgId, order.id);
//   //   } catch (err) {
//   //     console.error("Attachment upload failed", err);
//   //     toast.error("Failed to upload attachment");
//   //   } finally {
//   //     setUploading(false);
//   //   }
//   // };

//   // const handleDeleteAttachment = async (attachmentId: string) => {
//   //   if (!orgId || !order) return;
//   //   const confirmed = window.confirm("Delete this attachment?");
//   //   if (!confirmed) return;
//   //   try {
//   //     await labService.deleteLabReportAttachment(
//   //       orgId,
//   //       order.id,
//   //       attachmentId,
//   //     );
//   //     toast.success("Attachment deleted");
//   //     await loadAttachments(orgId, order.id);
//   //   } catch (err) {
//   //     console.error("Failed to delete attachment", err);
//   //     toast.error("Failed to delete attachment");
//   //   }
//   // };

//   const handleDownloadReport = () => {
//     if (!report || !order) return;

//     const reportContent = `Laboratory Test Report\n\nOrder ID: ${order.id}\nPatient: ${order.patientName}\nPatient ID: ${order.patientId || "Not recorded"}\nGender: ${order.patientGender}\nAge: ${order.patientAge}\nOrdering Doctor: ${order.orderingDoctor}\nDepartment: ${order.departmentName}\nTest: ${order.test_name || order.test_type}\nPriority: ${order.priority}\nSample Type: ${order.sampleType}\nDate Ordered: ${formatDateTime(order.orderedAt)}\n\nClinical Notes\n${order.clinicalNotes}\n\nReport Findings\n${report}`;

//     const blob = new Blob([reportContent], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `lab-report-${order.id}-${new Date().toISOString().split("T")[0]}.txt`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//     toast.success("Report downloaded successfully");
//   };

//   const handleDownloadCsv = () => {
//     if (!report || !order) return;
//     const escapeCsv = (value: string) => `"${value.replace(/"/g, '""')}"`;
//     const rows = [
//       ["Order ID", order.id], ["Patient", order.patientName], ["Patient ID", order.patientId],
//       ["Ordering Doctor", order.orderingDoctor], ["Department", order.departmentName],
//       ["Test", order.test_name || order.test_type], ["Priority", order.priority],
//       ["Sample Type", order.sampleType], ["Ordered At", formatDateTime(order.orderedAt)],
//       ["Clinical Notes", order.clinicalNotes], ["Report Findings", report],
//     ];
//     const blob = new Blob([`Field,Value\n${rows.map(([field, value]) => `${escapeCsv(field)},${escapeCsv(value)}`).join("\n")}`], { type: "text/csv;charset=utf-8" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `lab-report-${order.id}-${new Date().toISOString().split("T")[0]}.csv`;
//     link.click();
//     URL.revokeObjectURL(url);
//     toast.success("CSV report downloaded.");
//   };

//   return (
//     <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
//       <h3 className="mb-3 text-base font-semibold text-[#1A2380]">
//         Test Report
//       </h3>
//       <p className="mb-4 text-sm text-gray-500">Ordering doctor: <span className="font-medium text-gray-700">{order.orderingDoctor}</span></p>

//       {reportLoading ? (
//         <div className="h-24 w-full animate-pulse rounded bg-gray-100" />
//       ) : !report ? (
//         <div className="text-center">
//           <p className="text-sm text-gray-500">No report submitted yet.</p>
//           <Button
//             onClick={openReportModal}
//             className="mt-4"
//             variant="primary"
//             size="sm"
//           >
//             Submit Report
//           </Button>
//           <p className="mt-3 text-xs text-gray-400">Report exports become available immediately after submission.</p>
//         </div>
//       ) : (
//         <div>
//           <div className="prose prose-sm max-w-none rounded-md border border-gray-200 bg-gray-50 p-4">
//             <p>{report}</p>
//           </div>
//           <div className="mt-3 flex flex-wrap justify-end gap-2">
//             <Button
//               onClick={handleDownloadReport}
//               variant="outline"
//               size="sm"
//               className="inline-flex items-center gap-1 text-xs"
//             >
//               <Download size={14} /> Download .txt report
//             </Button>
//             <Button
//               onClick={handleDownloadCsv}
//               variant="outline"
//               size="sm"
//               className="inline-flex items-center gap-1 text-xs"
//             >
//               <Download size={14} /> Download CSV
//             </Button>
//             <Button
//               onClick={openReportModal}
//               variant="outline"
//               size="sm"
//               className="text-xs"
//             >
//               Correct Report
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* <div className="mt-6">
//         <h4 className="mb-2 text-sm font-semibold text-gray-700">
//           Attachments ({attachments.length})
//         </h4>
//         <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
//           {attachments.map((attachment) => (
//             <div
//               key={attachment.id}
//               className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 p-2 text-sm"
//             >
//               <a
//                 href={attachment.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex items-center gap-2 truncate text-gray-700 hover:text-blue-600"
//               >
//                 {attachment.mimetype?.includes("pdf") ? (
//                <FileText className="h-4 w-4 shrink-0 text-red-500" />
//                 ) : (
//                  <File className="h-4 w-4 shrink-0 text-gray-500" />
//                 )}
//                 <span className="truncate">{attachment.original_filename}</span>
//               </a>
//               <button
//                 type="button"
//                 onClick={() => handleDeleteAttachment(attachment.id)}
//                 aria-label={`Delete ${attachment.original_filename || "attachment"}`}
//                 className="ml-2 shrink-0 rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-red-600"
//               >
//              <Trash2 className="h-4 w-4" />
//               </button>
//             </div>
//           ))}
//           <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed border-gray-300 p-3 text-sm text-gray-500 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600">
//             <input
//               type="file"
//               className="sr-only"
//               onChange={(e) => handleFileUpload(e.target.files?.[0])}
//               disabled={uploading}
//             />
//             {uploading ? (
//               <>
//                <Upload className="h-4 w-4 animate-pulse" /> Uploading...
//               </>
//             ) : (
//               <>
//                 <Plus className="h-4 w-4" /> Add Attachment
//               </>
//             )}
//           </label>
//         </div>
//       </div> */}

//       <Modal
//         isOpen={reportModalOpen}
//         onClose={closeReportModal}
//         title="Test Report"
//         header={report ? "Correct Test Report" : "Submit Test Report"}
//       >
//         <div className="space-y-3 p-1">
//           <FieldLabel htmlFor="report-draft">
//             Findings for test {order.id}
//           </FieldLabel>
//           <p className="text-sm text-gray-500">This report will be available to {order.orderingDoctor}. Include the result, units, reference range, and any critical finding.</p>
//           <Textarea
//             id="report-draft"
//             value={reportDraft}
//             onChange={(e) => setReportDraft(e.target.value)}
//             rows={10}
//             className="w-full"
//             placeholder="Enter the test report details here..."
//           />
//           {submitError && (
//             <p className="mt-2 text-sm text-red-600">{submitError}</p>
//           )}
//           <div className="mt-6 flex justify-end gap-3">
//             <Button
//               variant="outline"
//               onClick={closeReportModal}
//               disabled={reportSubmitting}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="primary"
//               onClick={handleSubmitReport}
//               isLoading={reportSubmitting}
//             >
//               {report ? "Submit Correction" : "Submit Report"}
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     </section>
//   );
// }



// export default function LabOrderDetailsClient({ id }: { id: string }) {
//   const router = useRouter();
//   const { activeWorkspace } = useAuth();
//   const orgId = activeWorkspace?.id ?? null;

//   const [order, setOrder] = useState<LabOrder | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [hasError, setHasError] = useState(false);
//   const [patientRecord, setPatientRecord] = useState<Record<string, unknown> | null>(null);
//   const patientValue = (keys: string[], fallback = "Not recorded") => {
//     if (!patientRecord) return fallback;
//     for (const key of keys) {
//       const value = patientRecord[key];
//       if (typeof value === "string" && value.trim()) return value;
//       if (typeof value === "number") return String(value);
//     }
//     return fallback;
//   };

//   useEffect(() => {
//     if (!orgId) {
//       setLoading(false);
//       setOrder(null);
//       setPatientRecord(null);
//       return;
//     }

//     let ignore = false;

//     const loadDetails = async () => {
//       setLoading(true);
//       setHasError(false);

//       try {
//         const [labTestRaw, listedTestsResponse, consultationsResponse] = await Promise.all([
//           labService.getLabTestDetail(orgId, id),
//           labService.listOrganizationLabTests(orgId),
//           consultationService.listConsultations(orgId),
//         ]);
//         const detailOrder = mapLabOrder(labTestRaw);
//         const listedTests = Array.isArray(listedTestsResponse)
//           ? listedTestsResponse
//           : (listedTestsResponse as { data?: unknown[] })?.data ?? [];
//         const listedOrder = normalizeLabOrders(listedTests).find((candidate) => candidate.id === id);
//         let enrichedOrder: LabOrder = {
//           ...detailOrder,
//           consultation_id: detailOrder.consultation_id || listedOrder?.consultation_id || null,
//           // The detail response omits doctor_name. The list response carries the
//           // same field shown on the queue card, so retain it for the report view.
//           orderingDoctor: listedOrder?.orderingDoctor && listedOrder.orderingDoctor !== "Unknown Doctor"
//             ? listedOrder.orderingDoctor
//             : detailOrder.orderingDoctor,
//         };
//         const consultation = getConsultationsArray(consultationsResponse).find(
//           (item) => item.id === enrichedOrder.consultation_id,
//         );

//         if (consultation) {

//           enrichedOrder = {
//             ...enrichedOrder,
//             patientName: buildPatientName(consultation, enrichedOrder.patientName),
//             patientId: getPatientId(consultation, enrichedOrder.patientId),
//             orderingDoctor: buildDoctorName(consultation, enrichedOrder.orderingDoctor),
//           }
//         } else if (enrichedOrder.consultation_id) {
//           // Keep a fallback for a consultation not present in the active list.
//           const consultationRaw = await consultationService.getConsultation(orgId, enrichedOrder.consultation_id);
//           const consultationData = consultationRaw && typeof consultationRaw === "object" && "data" in consultationRaw
//             ? (consultationRaw as { data: unknown }).data
//             : consultationRaw;
//           const individualConsultation = getConsultationsArray([consultationData])[0];
//           enrichedOrder = {
//             ...enrichedOrder,
//             patientName: buildPatientName(individualConsultation, enrichedOrder.patientName),
//             patientId: getPatientId(individualConsultation, enrichedOrder.patientId),
//             orderingDoctor: buildDoctorName(individualConsultation, enrichedOrder.orderingDoctor),
//           };
//         }

//         let fullPatient: Record<string, unknown> | null = null;
//         if (enrichedOrder.patientId) {
//           try {
//             const patientResponse = await patientService.getPatient(orgId, enrichedOrder.patientId);
//             if (patientResponse && typeof patientResponse === "object") {
//               fullPatient = patientResponse as Record<string, unknown>;
//             }
//           } catch (patientError) {
//             console.warn("Unable to load complete patient information", patientError);
//           }
//         }

//         if (!ignore) {
//           setOrder(enrichedOrder);
//           setPatientRecord(fullPatient);
//         }
//       } catch (error) {
//         console.error("Failed to load lab order details", error);

//         if (!ignore) {
//           setHasError(true);
//           setOrder(null);
//         }
//       } finally {
//         if (!ignore) {
//           setLoading(false);
//         }
//       }
//     };

//     void loadDetails();

//     return () => {
//       ignore = true;
//     };
//   }, [id, orgId]);

//   if (loading) {
//     return (
//       <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
//         <div className="h-8 w-56 animate-pulse rounded bg-gray-100" />
//         <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
//           <div className="h-48 animate-pulse rounded bg-gray-100" />
//           <div className="h-48 animate-pulse rounded bg-gray-100" />
//         </div>
//         <div className="h-64 w-full animate-pulse rounded bg-gray-100" />
//       </div>
//     );
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
//             <p className="text-sm text-gray-500">
//               {order.test_type || order.test_name}
//             </p>
//           </div>
//           <div className="flex items-center gap-2">
//             <StatusBadge status={toStatusBadgeType(order.status)} />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
//           <div className="space-y-4 rounded-lg border border-gray-200 p-4">
//             <h3 className="text-sm font-semibold text-[#1A2380]">
//               Patient Information
//             </h3>
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
//               <p>
//                 Date of birth: <span className="font-medium">{patientValue(["dob", "date_of_birth"], "Not recorded")}</span>
//               </p>
//               <p>
//                 Phone: <span className="font-medium">{patientValue(["phone_number", "phone"], "Not recorded")}</span>
//               </p>
//               <p className="break-all">
//                 Email: <span className="font-medium">{patientValue(["email"], "Not recorded")}</span>
//               </p>
//               <p>
//                 Blood group: <span className="font-medium">{patientValue(["blood_group"], "Not recorded")}</span>
//               </p>
//               <p className="sm:col-span-2">
//                 Allergies: <span className="font-medium">{patientValue(["allergies"], "No allergies recorded")}</span>
//               </p>
//             </div>
//           </div>

//           <div className="space-y-4 rounded-lg border border-gray-200 p-4">
//             <h3 className="text-sm font-semibold text-[#1A2380]">
//               Order Summary
//             </h3>
//             <div className="grid grid-cols-1 gap-2 text-sm text-gray-700 sm:grid-cols-2">
//               <p>
//                 Order Timestamp:{" "}
//                 <span className="font-medium">
//                   {formatDateTime(order.orderedAt)}
//                 </span>
//               </p>
//               <p>
//                 Priority: <span className="font-medium">{order.priority}</span>
//               </p>
//               <p>
//                 Ordering Doctor:{" "}
//                 <span className="font-medium">{order.orderingDoctor}</span>
//               </p>
//               <p>
//                 Test status: <span className="font-medium">{order.status.replace("_", " ")}</span>
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
//             <h3 className="mb-3 text-sm font-semibold text-[#1A2380]">
//               Ordered Tests
//             </h3>
//             <ul className="space-y-2 text-sm text-gray-700">
//               {order.orderedTests.length === 0 && (
//                 <li className="text-gray-500">No ordered tests listed.</li>
//               )}
//               {order.orderedTests.map((testName, index) => (
//                 <li
//                   key={`${testName}-${index}`}
//                   className="rounded-md bg-gray-50 px-3 py-2"
//                 >
//                   {testName}
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div className="rounded-lg border border-gray-200 p-4">
//             <h3 className="mb-3 text-sm font-semibold text-[#1A2380]">
//               Clinical Notes
//             </h3>
//             <p className="text-sm leading-relaxed text-gray-700">
//               {order.clinicalNotes}
//             </p>
//           </div>
//         </div>

//         <article className="mt-4 rounded-lg border border-gray-200 p-4">
//           <h3 className="mb-3 text-sm font-semibold text-[#1A2380]">Patient clinical context</h3>
//           <div className="grid grid-cols-1 gap-3 text-sm text-gray-700 md:grid-cols-2">
//             <p><span className="text-gray-500">Past medical history:</span> <span className="font-medium">{patientValue(["past_medical_history"], "Not recorded")}</span></p>
//             <p><span className="text-gray-500">Current medications:</span> <span className="font-medium">{patientValue(["current_medications"], "Not recorded")}</span></p>
//             <p><span className="text-gray-500">Symptoms:</span> <span className="font-medium">{patientValue(["symptoms"], "Not recorded")}</span></p>
//             <p><span className="text-gray-500">Immunizations:</span> <span className="font-medium">{patientValue(["immunizations"], "Not recorded")}</span></p>
//           </div>
//         </article>
//       </section>

//       <LabReportSection order={order} orgId={orgId} id={id} />


//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@components/StatusBadge";
import { useAuth } from "@context/AuthContext";
import { consultationService, labService, patientService } from "@services/api";
import {
  LabOrder,
  formatDateTime,
  isNotFoundApiError,
  mapLabOrder,
  toStatusBadgeType,
  getConsultationsArray,
  normalizeLabOrders,
  buildPatientName,
  getPatientId,
  buildDoctorName,
} from "./labOrderUtils";
import Modal from "@components/Modal";
import { Textarea, FieldLabel } from "@components/Field";
import Button from "@components/Button";
import { toast } from "react-toastify";
import { ArrowLeft, Download, Plus, Trash2 } from "lucide-react";

function LabReportSection({
  order,
  orgId,
  id,
}: {
  order: LabOrder;
  orgId: string | null;
  id: string;
}) {
  // Store the full structured response from the API
  const [reportData, setReportData] = useState<{
    interpretation: string;
    results: any[];
  } | null>(null);

  const [reportLoading, setReportLoading] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form states matching the payload
  const [interpretation, setInterpretation] = useState("");
  const [results, setResults] = useState([
    { parameter: "", value: "", unit: "", reference_range: "", flag: "Normal" },
  ]);

  useEffect(() => {
    let ignore = false;

    const loadReport = async () => {
      if (!orgId) return;
      setReportLoading(true);
      try {
        const res = await labService.getLabReport(orgId, id);
        const data = res?.data || res;

        if (!ignore && data && (data.interpretation || (data.results && data.results.length > 0))) {
          setReportData({
            interpretation: data.interpretation || "",
            results: data.results || [],
          });
        }
      } catch (err) {
        if (!isNotFoundApiError(err)) {
          console.error("Failed to load lab report", err);
        }
      } finally {
        if (!ignore) setReportLoading(false);
      }
    };

    void loadReport();
    return () => { ignore = true; };
  }, [id, orgId]);

  const openReportModal = () => {
    if (reportData) {
      setInterpretation(reportData.interpretation || "");
      setResults(
        reportData.results && reportData.results.length > 0
          ? [...reportData.results]
          : [{ parameter: "", value: "", unit: "", reference_range: "", flag: "Normal" }]
      );
    } else {
      setInterpretation("");
      setResults([{ parameter: "", value: "", unit: "", reference_range: "", flag: "Normal" }]);
    }
    setSubmitError(null);
    setReportModalOpen(true);
  };

  const closeReportModal = () => {
    setReportModalOpen(false);
    setSubmitError(null);
  };

  // Helper functions for dynamic rows
  const addRow = () => {
    setResults([...results, { parameter: "", value: "", unit: "", reference_range: "", flag: "Normal" }]);
  };

  const updateRow = (index: number, field: string, val: string) => {
    const newResults = [...results];
    newResults[index] = { ...newResults[index], [field]: val };
    setResults(newResults);
  };

  const removeRow = (index: number) => {
    const newResults = results.filter((_, i) => i !== index);
    setResults(newResults.length > 0 ? newResults : [{ parameter: "", value: "", unit: "", reference_range: "", flag: "Normal" }]);
  };

  const handleSubmitReport = async () => {
    if (!orgId) return toast.error("No organization selected");
    if (!order) return toast.error("No lab order available");

    // Filter out completely empty rows
    const validResults = results.filter((r) => r.parameter.trim() !== "" || r.value.trim() !== "");
    
    if (validResults.length === 0) {
      return toast.error("Please add at least one valid test result row.");
    }

    const confirmed = window.confirm(
      reportData
        ? "Submit corrected report? This will overwrite the existing report."
        : "Submit report for this test?"
    );
    if (!confirmed) return;

    setReportSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        interpretation,
        results: validResults,
      };

      if (reportData) {
        await labService.correctLabReport(orgId, order.id, payload);
        toast.success("Report updated");
      } else {
        await labService.submitLabReport(orgId, order.id, payload);
        toast.success("Report submitted");
      }

      // Refresh data
      const refreshed = await labService.getLabReport(orgId, order.id);
      const data = refreshed?.data || refreshed;
      if (data) {
        setReportData({
          interpretation: data.interpretation || "",
          results: data.results || [],
        });
      }

      try {
        await labService.updateLabTestStatus(orgId, order.id, "Completed");
      } catch (e) {
        console.warn("Failed to update test status after report submit", e);
      }

      closeReportModal();
    } catch (err: any) {
      console.error("Report submission failed", err);
      setSubmitError(err?.response?.data?.message || err?.message || "Submission failed");
      toast.error("Failed to submit report");
    } finally {
      setReportSubmitting(false);
    }
  };

  const handleDownloadReport = () => {
    if (!reportData || !order) return;

    let resultsText = reportData.results.map(r => 
      `${r.parameter}: ${r.value} ${r.unit} (Ref: ${r.reference_range}) [${r.flag}]`
    ).join("\n");

    const reportContent = `Laboratory Test Report\n\nOrder ID: ${order.id}\nPatient: ${order.patientName}\nPatient ID: ${order.patientId || "Not recorded"}\nGender: ${order.patientGender}\nAge: ${order.patientAge}\nOrdering Doctor: ${order.orderingDoctor}\nTest: ${order.test_name || order.test_type}\nDate Ordered: ${formatDateTime(order.orderedAt)}\n\nStructured Results:\n${resultsText}\n\nInterpretation:\n${reportData.interpretation}`;

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lab-report-${order.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const inputClass = "w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-3 text-base font-semibold text-[#1A2380]">Test Report</h3>
      <p className="mb-4 text-sm text-gray-500">
        Ordering doctor: <span className="font-medium text-gray-700">{order.orderingDoctor}</span>
      </p>

      {reportLoading ? (
        <div className="h-24 w-full animate-pulse rounded bg-gray-100" />
      ) : !reportData ? (
        <div className="text-center">
          <p className="text-sm text-gray-500">No report submitted yet.</p>
          <Button onClick={openReportModal} className="mt-4" variant="primary" size="sm">
            Submit Report
          </Button>
        </div>
      ) : (
        <div>
          {/* Display Structured Data */}
          <div className="mb-4 overflow-x-auto rounded-md border border-gray-200">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-4 py-2 font-medium">Parameter</th>
                  <th className="px-4 py-2 font-medium">Result</th>
                  <th className="px-4 py-2 font-medium">Unit</th>
                  <th className="px-4 py-2 font-medium">Ref Range</th>
                  <th className="px-4 py-2 font-medium">Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {reportData.results.map((r, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2 font-medium text-gray-900">{r.parameter}</td>
                    <td className="px-4 py-2">{r.value}</td>
                    <td className="px-4 py-2">{r.unit}</td>
                    <td className="px-4 py-2">{r.reference_range}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        r.flag === "Normal" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {r.flag}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {reportData.interpretation && (
            <div className="prose prose-sm max-w-none rounded-md border border-gray-200 bg-gray-50 p-4 whitespace-pre-wrap">
              <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2">Interpretation</h4>
              <p>{reportData.interpretation}</p>
            </div>
          )}

          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <Button onClick={handleDownloadReport} variant="outline" size="sm" className="inline-flex items-center gap-1 text-xs">
              <Download size={14} /> Download .txt
            </Button>
            <Button onClick={openReportModal} variant="outline" size="sm" className="text-xs">
              Correct Report
            </Button>
          </div>
        </div>
      )}

      {/* Structured Report Modal */}
      <Modal isOpen={reportModalOpen} onClose={closeReportModal} title="Test Report" header={reportData ? "Correct Test Report" : "Submit Test Report"}>
        <div className="space-y-6 p-1 max-h-[70vh] overflow-y-auto">
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <FieldLabel htmlFor="results-table">Structured Results</FieldLabel>
              <Button type="button" onClick={addRow} variant="outline" size="sm" className="h-8 gap-1 py-1 text-xs">
                <Plus size={14} /> Add Row
              </Button>
            </div>

            <div className="space-y-3">
              {results.map((row, idx) => (
                <div key={idx} className="relative flex flex-wrap gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 pt-6 sm:flex-nowrap sm:pt-3">
                  {/* Delete button positioned absolute on mobile, static on desktop */}
                  <button 
                    type="button" 
                    onClick={() => removeRow(idx)} 
                    className="absolute right-2 top-2 text-gray-400 hover:text-red-500 sm:static sm:mt-2"
                  >
                    <Trash2 size={16} />
                  </button>
                  
                  <div className="w-full sm:w-[30%]">
                    <input className={inputClass} placeholder="Parameter (e.g., WBC)" value={row.parameter} onChange={(e) => updateRow(idx, "parameter", e.target.value)} />
                  </div>
                  <div className="w-[48%] sm:w-[20%]">
                    <input className={inputClass} placeholder="Value (e.g., 5.4)" value={row.value} onChange={(e) => updateRow(idx, "value", e.target.value)} />
                  </div>
                  <div className="w-[48%] sm:w-[15%]">
                    <input className={inputClass} placeholder="Unit (10^9/L)" value={row.unit} onChange={(e) => updateRow(idx, "unit", e.target.value)} />
                  </div>
                  <div className="w-[48%] sm:w-[20%]">
                    <input className={inputClass} placeholder="Range (4.0-10.0)" value={row.reference_range} onChange={(e) => updateRow(idx, "reference_range", e.target.value)} />
                  </div>
                  <div className="w-[48%] sm:w-[15%]">
                    <select className={inputClass} value={row.flag} onChange={(e) => updateRow(idx, "flag", e.target.value)}>
                      <option value="Normal">Normal</option>
                      <option value="High">High</option>
                      <option value="Low">Low</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="interpretation">Clinical Interpretation (Optional)</FieldLabel>
            <p className="mb-2 text-xs text-gray-500">Add an overarching summary, notes on methodology, or interpretations for the doctor.</p>
            <Textarea
              id="interpretation"
              value={interpretation}
              onChange={(e) => setInterpretation(e.target.value)}
              rows={4}
              className="w-full"
              placeholder="Enter narrative report details here..."
            />
          </div>

          {submitError && <p className="text-sm text-red-600">{submitError}</p>}
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={closeReportModal} disabled={reportSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmitReport} isLoading={reportSubmitting}>
              {reportData ? "Submit Correction" : "Submit Report"}
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
}

export default function LabOrderDetailsClient({ id }: { id: string }) {
  const router = useRouter();
  const { activeWorkspace } = useAuth();
  const orgId = activeWorkspace?.id ?? null;

  const [order, setOrder] = useState<LabOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [patientRecord, setPatientRecord] = useState<Record<string, unknown> | null>(null);
  
  const patientValue = (keys: string[], fallback = "Not recorded") => {
    if (!patientRecord) return fallback;
    for (const key of keys) {
      const value = patientRecord[key];
      if (typeof value === "string" && value.trim()) return value;
      if (typeof value === "number") return String(value);
    }
    return fallback;
  };

  useEffect(() => {
    if (!orgId) {
      setLoading(false);
      setOrder(null);
      setPatientRecord(null);
      return;
    }

    let ignore = false;

    const loadDetails = async () => {
      setLoading(true);
      setHasError(false);

      try {
        const [labTestRaw, listedTestsResponse, consultationsResponse] = await Promise.all([
          labService.getLabTestDetail(orgId, id),
          labService.listOrganizationLabTests(orgId),
          consultationService.listConsultations(orgId),
        ]);
        
        const detailOrder = mapLabOrder(labTestRaw);
        const listedTests = Array.isArray(listedTestsResponse)
          ? listedTestsResponse
          : (listedTestsResponse as { data?: unknown[] })?.data ?? [];
        const listedOrder = normalizeLabOrders(listedTests).find((candidate) => candidate.id === id);
        
        let enrichedOrder: LabOrder = {
          ...detailOrder,
          consultation_id: detailOrder.consultation_id || listedOrder?.consultation_id || null,
          orderingDoctor: listedOrder?.orderingDoctor && listedOrder.orderingDoctor !== "Unknown Doctor"
            ? listedOrder.orderingDoctor
            : detailOrder.orderingDoctor,
        };
        
        const consultation = getConsultationsArray(consultationsResponse).find(
          (item) => item.id === enrichedOrder.consultation_id,
        );

        if (consultation) {
          enrichedOrder = {
            ...enrichedOrder,
            patientName: buildPatientName(consultation, enrichedOrder.patientName),
            patientId: getPatientId(consultation, enrichedOrder.patientId),
            orderingDoctor: buildDoctorName(consultation, enrichedOrder.orderingDoctor),
          }
        } else if (enrichedOrder.consultation_id) {
          const consultationRaw = await consultationService.getConsultation(orgId, enrichedOrder.consultation_id);
          const consultationData = consultationRaw && typeof consultationRaw === "object" && "data" in consultationRaw
            ? (consultationRaw as { data: unknown }).data
            : consultationRaw;
          const individualConsultation = getConsultationsArray([consultationData])[0];
          
          enrichedOrder = {
            ...enrichedOrder,
            patientName: buildPatientName(individualConsultation, enrichedOrder.patientName),
            patientId: getPatientId(individualConsultation, enrichedOrder.patientId),
            orderingDoctor: buildDoctorName(individualConsultation, enrichedOrder.orderingDoctor),
          };
        }

        let fullPatient: Record<string, unknown> | null = null;
        if (enrichedOrder.patientId) {
          try {
            const patientResponse = await patientService.getPatient(orgId, enrichedOrder.patientId);
            if (patientResponse && typeof patientResponse === "object") {
              fullPatient = patientResponse as Record<string, unknown>;
            }
          } catch (patientError) {
            console.warn("Unable to load complete patient information", patientError);
          }
        }

        if (!ignore) {
          setOrder(enrichedOrder);
          setPatientRecord(fullPatient);
        }
      } catch (error) {
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
    return (
      <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="h-8 w-56 animate-pulse rounded bg-gray-100" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="h-48 animate-pulse rounded bg-gray-100" />
          <div className="h-48 animate-pulse rounded bg-gray-100" />
        </div>
        <div className="h-64 w-full animate-pulse rounded bg-gray-100" />
      </div>
    );
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
          <div className="flex items-center gap-2">
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
              <p>
                Date of birth: <span className="font-medium">{patientValue(["dob", "date_of_birth"], "Not recorded")}</span>
              </p>
              <p>
                Phone: <span className="font-medium">{patientValue(["phone_number", "phone"], "Not recorded")}</span>
              </p>
              <p className="break-all">
                Email: <span className="font-medium">{patientValue(["email"], "Not recorded")}</span>
              </p>
              <p>
                Blood group: <span className="font-medium">{patientValue(["blood_group"], "Not recorded")}</span>
              </p>
              <p className="sm:col-span-2">
                Allergies: <span className="font-medium">{patientValue(["allergies"], "No allergies recorded")}</span>
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
                Test status: <span className="font-medium">{order.status.replace("_", " ")}</span>
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

        <article className="mt-4 rounded-lg border border-gray-200 p-4">
          <h3 className="mb-3 text-sm font-semibold text-[#1A2380]">Patient clinical context</h3>
          <div className="grid grid-cols-1 gap-3 text-sm text-gray-700 md:grid-cols-2">
            <p><span className="text-gray-500">Past medical history:</span> <span className="font-medium">{patientValue(["past_medical_history"], "Not recorded")}</span></p>
            <p><span className="text-gray-500">Current medications:</span> <span className="font-medium">{patientValue(["current_medications"], "Not recorded")}</span></p>
            <p><span className="text-gray-500">Symptoms:</span> <span className="font-medium">{patientValue(["symptoms"], "Not recorded")}</span></p>
            <p><span className="text-gray-500">Immunizations:</span> <span className="font-medium">{patientValue(["immunizations"], "Not recorded")}</span></p>
          </div>
        </article>
      </section>

      <LabReportSection order={order} orgId={orgId} id={id} />

    </div>
  );
}