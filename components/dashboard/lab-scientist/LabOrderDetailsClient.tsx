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

//   const handleFileUpload = async (file?: File) => {
//     if (!orgId || !order || !file) return;
//     setUploading(true);
//     try {
//       await labService.uploadLabReportAttachment(orgId, order.id, file);
//       toast.success("Attachment uploaded");
//       await loadAttachments(orgId, order.id);
//     } catch (err) {
//       console.error("Attachment upload failed", err);
//       toast.error("Failed to upload attachment");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleDeleteAttachment = async (attachmentId: string) => {
//     if (!orgId || !order) return;
//     const confirmed = window.confirm("Delete this attachment?");
//     if (!confirmed) return;
//     try {
//       await labService.deleteLabReportAttachment(
//         orgId,
//         order.id,
//         attachmentId,
//       );
//       toast.success("Attachment deleted");
//       await loadAttachments(orgId, order.id);
//     } catch (err) {
//       console.error("Failed to delete attachment", err);
//       toast.error("Failed to delete attachment");
//     }
//   };

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
//     <section className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
//       <h3 className="mb-3 text-base font-semibold text-[#1A2380]">
//         Test Report
//       </h3>
//       <p className="mb-4 text-sm text-gray-500">Ordering doctor: <span className="font-medium text-gray-700">{order.orderingDoctor}</span></p>

//       {reportLoading ? (
//         <div className="h-24 w-full animate-pulse rounded-md bg-gray-100" />
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

//       <div className="mt-6">
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
//                 className="ml-2 shrink-0 rounded-md p-1 text-gray-500 hover:bg-gray-200 hover:text-red-600"
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
//       </div>

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
//       <div className="space-y-4 rounded-md border border-gray-200 bg-white p-5 shadow-sm">
//         <div className="h-8 w-56 animate-pulse rounded-md bg-gray-100" />
//         <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
//           <div className="h-48 animate-pulse rounded-md bg-gray-100" />
//           <div className="h-48 animate-pulse rounded-md bg-gray-100" />
//         </div>
//         <div className="h-64 w-full animate-pulse rounded-md bg-gray-100" />
//       </div>
//     );
//   }

//   if (!order) {
//     return (
//       <section className="rounded-md border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
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
//           className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
//         >
//           <ArrowLeft size={14} />
//           Back to Test Orders
//         </button>
//       </div>

//       <section className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
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
//           <div className="space-y-4 rounded-md border border-gray-200 p-4">
//             <h3 className="text-sm font-semibold text-[#1A2380]">
//               Patient Information
//             </h3>
//             <div className="grid grid-cols-1 gap-2 text-sm text-gray-700 sm:grid-cols-2">
//               <p>
//                 Name: <span className="font-medium">{order.patientName}</span>
//               </p>
//               <p>
//                 Patient ID: <span className="font-medium">{order.patientCode || order.patientId}</span>
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

//           <div className="space-y-4 rounded-md border border-gray-200 p-4">
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
//           <div className="rounded-md border border-gray-200 p-4">
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

//           <div className="rounded-md border border-gray-200 p-4">
//             <h3 className="mb-3 text-sm font-semibold text-[#1A2380]">
//               Clinical Notes
//             </h3>
//             <p className="text-sm leading-relaxed text-gray-700">
//               {order.clinicalNotes}
//             </p>
//           </div>
//         </div>

//         <article className="mt-4 rounded-md border border-gray-200 p-4">
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


// "use client";

// import { useEffect, useState } from "react";
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
// import { ArrowLeft, Download, Plus, Trash2 } from "lucide-react";

// function LabReportSection({
//   order,
//   orgId,
//   id,
// }: {
//   order: LabOrder;
//   orgId: string | null;
//   id: string;
// }) {
//   // Store the full structured response from the API
//   const [reportData, setReportData] = useState<{
//     interpretation: string;
//     results: any[];
//   } | null>(null);

//   const [reportLoading, setReportLoading] = useState(false);
//   const [reportModalOpen, setReportModalOpen] = useState(false);
//   const [reportSubmitting, setReportSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState<string | null>(null);

//   // Form states matching the payload
//   const [interpretation, setInterpretation] = useState("");
//   const [results, setResults] = useState([
//     { parameter: "", value: "", unit: "", reference_range: "", flag: "Normal" },
//   ]);

//   useEffect(() => {
//     let ignore = false;

//     const loadReport = async () => {
//       if (!orgId) return;
//       setReportLoading(true);
//       try {
//         const res = await labService.getLabReport(orgId, id);
//         const data = res?.data || res;

//         if (!ignore && data && (data.interpretation || (data.results && data.results.length > 0))) {
//           setReportData({
//             interpretation: data.interpretation || "",
//             results: data.results || [],
//           });
//         }
//       } catch (err) {
//         if (!isNotFoundApiError(err)) {
//           console.error("Failed to load lab report", err);
//         }
//       } finally {
//         if (!ignore) setReportLoading(false);
//       }
//     };

//     void loadReport();
//     return () => { ignore = true; };
//   }, [id, orgId]);

//   const openReportModal = () => {
//     if (reportData) {
//       setInterpretation(reportData.interpretation || "");
//       setResults(
//         reportData.results && reportData.results.length > 0
//           ? [...reportData.results]
//           : [{ parameter: "", value: "", unit: "", reference_range: "", flag: "Normal" }]
//       );
//     } else {
//       setInterpretation("");
//       setResults([{ parameter: "", value: "", unit: "", reference_range: "", flag: "Normal" }]);
//     }
//     setSubmitError(null);
//     setReportModalOpen(true);
//   };

//   const closeReportModal = () => {
//     setReportModalOpen(false);
//     setSubmitError(null);
//   };

//   // Helper functions for dynamic rows
//   const addRow = () => {
//     setResults([...results, { parameter: "", value: "", unit: "", reference_range: "", flag: "Normal" }]);
//   };

//   const updateRow = (index: number, field: string, val: string) => {
//     const newResults = [...results];
//     newResults[index] = { ...newResults[index], [field]: val };
//     setResults(newResults);
//   };

//   const removeRow = (index: number) => {
//     const newResults = results.filter((_, i) => i !== index);
//     setResults(newResults.length > 0 ? newResults : [{ parameter: "", value: "", unit: "", reference_range: "", flag: "Normal" }]);
//   };

//   const handleSubmitReport = async () => {
//     if (!orgId) return toast.error("No organization selected");
//     if (!order) return toast.error("No lab order available");

//     // Filter out completely empty rows
//     const validResults = results.filter((r) => r.parameter.trim() !== "" || r.value.trim() !== "");
    
//     if (validResults.length === 0) {
//       return toast.error("Please add at least one valid test result row.");
//     }

//     const confirmed = window.confirm(
//       reportData
//         ? "Submit corrected report? This will overwrite the existing report."
//         : "Submit report for this test?"
//     );
//     if (!confirmed) return;

//     setReportSubmitting(true);
//     setSubmitError(null);

//     try {
//       const payload = {
//         interpretation,
//         results: validResults,
//       };

//       if (reportData) {
//         await labService.correctLabReport(orgId, order.id, payload);
//         toast.success("Report updated");
//       } else {
//         await labService.submitLabReport(orgId, order.id, payload);
//         toast.success("Report submitted");
//       }

//       // Refresh data
//       const refreshed = await labService.getLabReport(orgId, order.id);
//       const data = refreshed?.data || refreshed;
//       if (data) {
//         setReportData({
//           interpretation: data.interpretation || "",
//           results: data.results || [],
//         });
//       }

//       try {
//         await labService.updateLabTestStatus(orgId, order.id, "Completed");
//       } catch (e) {
//         console.warn("Failed to update test status after report submit", e);
//       }

//       closeReportModal();
//     } catch (err: any) {
//       console.error("Report submission failed", err);
//       setSubmitError(err?.response?.data?.message || err?.message || "Submission failed");
//       toast.error("Failed to submit report");
//     } finally {
//       setReportSubmitting(false);
//     }
//   };

//   const handleDownloadReport = () => {
//     if (!reportData || !order) return;

//     let resultsText = reportData.results.map(r => 
//       `${r.parameter}: ${r.value} ${r.unit} (Ref: ${r.reference_range}) [${r.flag}]`
//     ).join("\n");

//     const reportContent = `Laboratory Test Report\n\nOrder ID: ${order.id}\nPatient: ${order.patientName}\nPatient ID: ${order.patientId || "Not recorded"}\nGender: ${order.patientGender}\nAge: ${order.patientAge}\nOrdering Doctor: ${order.orderingDoctor}\nTest: ${order.test_name || order.test_type}\nDate Ordered: ${formatDateTime(order.orderedAt)}\n\nStructured Results:\n${resultsText}\n\nInterpretation:\n${reportData.interpretation}`;

//     const blob = new Blob([reportContent], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `lab-report-${order.id}.txt`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   };

//   const inputClass = "w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

//   return (
//     <section className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
//       <h3 className="mb-3 text-base font-semibold text-[#1A2380]">Test Report</h3>
//       <p className="mb-4 text-sm text-gray-500">
//         Ordering doctor: <span className="font-medium text-gray-700">{order.orderingDoctor}</span>
//       </p>

//       {reportLoading ? (
//         <div className="h-24 w-full animate-pulse rounded-md bg-gray-100" />
//       ) : !reportData ? (
//         <div className="text-center">
//           <p className="text-sm text-gray-500">No report submitted yet.</p>
//           <Button onClick={openReportModal} className="mt-4" variant="primary" size="sm">
//             Submit Report
//           </Button>
//         </div>
//       ) : (
//         <div>
//           {/* Display Structured Data */}
//           <div className="mb-4 overflow-x-auto rounded-md border border-gray-200">
//             <table className="w-full text-left text-sm text-gray-600">
//               <thead className="bg-gray-50 text-gray-700">
//                 <tr>
//                   <th className="px-4 py-2 font-medium">Parameter</th>
//                   <th className="px-4 py-2 font-medium">Result</th>
//                   <th className="px-4 py-2 font-medium">Unit</th>
//                   <th className="px-4 py-2 font-medium">Ref Range</th>
//                   <th className="px-4 py-2 font-medium">Flag</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200 bg-white">
//                 {reportData.results.map((r, i) => (
//                   <tr key={i}>
//                     <td className="px-4 py-2 font-medium text-gray-900">{r.parameter}</td>
//                     <td className="px-4 py-2">{r.value}</td>
//                     <td className="px-4 py-2">{r.unit}</td>
//                     <td className="px-4 py-2">{r.reference_range}</td>
//                     <td className="px-4 py-2">
//                       <span className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ${
//                         r.flag === "Normal" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
//                       }`}>
//                         {r.flag}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {reportData.interpretation && (
//             <div className="prose prose-sm max-w-none rounded-md border border-gray-200 bg-gray-50 p-4 whitespace-pre-wrap">
//               <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2">Interpretation</h4>
//               <p>{reportData.interpretation}</p>
//             </div>
//           )}

//           <div className="mt-4 flex flex-wrap justify-end gap-2">
//             <Button onClick={handleDownloadReport} variant="outline" size="sm" className="inline-flex items-center gap-1 text-xs">
//               <Download size={14} /> Download .txt
//             </Button>
//             <Button onClick={openReportModal} variant="outline" size="sm" className="text-xs">
//               Correct Report
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* Structured Report Modal */}
//       <Modal isOpen={reportModalOpen} onClose={closeReportModal} title="Test Report" header={reportData ? "Correct Test Report" : "Submit Test Report"}>
//         <div className="space-y-6 p-1 max-h-[70vh] overflow-y-auto">
          
//           <div>
//             <div className="flex items-center justify-between mb-3">
//               <FieldLabel htmlFor="results-table">Structured Results</FieldLabel>
//               <Button type="button" onClick={addRow} variant="outline" size="sm" className="h-8 gap-1 py-1 text-xs">
//                 <Plus size={14} /> Add Row
//               </Button>
//             </div>

//             <div className="space-y-3">
//               {results.map((row, idx) => (
//                 <div key={idx} className="relative flex flex-wrap gap-2 rounded-md border border-gray-200 bg-gray-50 p-3 pt-6 sm:flex-nowrap sm:pt-3">
//                   {/* Delete button positioned absolute on mobile, static on desktop */}
//                   <button 
//                     type="button" 
//                     onClick={() => removeRow(idx)} 
//                     className="absolute right-2 top-2 text-gray-400 hover:text-red-500 sm:static sm:mt-2"
//                   >
//                     <Trash2 size={16} />
//                   </button>
                  
//                   <div className="w-full sm:w-[30%]">
//                     <input className={inputClass} placeholder="Parameter (e.g., WBC)" value={row.parameter} onChange={(e) => updateRow(idx, "parameter", e.target.value)} />
//                   </div>
//                   <div className="w-[48%] sm:w-[20%]">
//                     <input className={inputClass} placeholder="Value (e.g., 5.4)" value={row.value} onChange={(e) => updateRow(idx, "value", e.target.value)} />
//                   </div>
//                   <div className="w-[48%] sm:w-[15%]">
//                     <input className={inputClass} placeholder="Unit (10^9/L)" value={row.unit} onChange={(e) => updateRow(idx, "unit", e.target.value)} />
//                   </div>
//                   <div className="w-[48%] sm:w-[20%]">
//                     <input className={inputClass} placeholder="Range (4.0-10.0)" value={row.reference_range} onChange={(e) => updateRow(idx, "reference_range", e.target.value)} />
//                   </div>
//                   <div className="w-[48%] sm:w-[15%]">
//                     <select className={inputClass} value={row.flag} onChange={(e) => updateRow(idx, "flag", e.target.value)}>
//                       <option value="Normal">Normal</option>
//                       <option value="High">High</option>
//                       <option value="Low">Low</option>
//                       <option value="Critical">Critical</option>
//                     </select>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div>
//             <FieldLabel htmlFor="interpretation">Clinical Interpretation (Optional)</FieldLabel>
//             <p className="mb-2 text-xs text-gray-500">Add an overarching summary, notes on methodology, or interpretations for the doctor.</p>
//             <Textarea
//               id="interpretation"
//               value={interpretation}
//               onChange={(e) => setInterpretation(e.target.value)}
//               rows={4}
//               className="w-full"
//               placeholder="Enter narrative report details here..."
//             />
//           </div>

//           {submitError && <p className="text-sm text-red-600">{submitError}</p>}
          
//           <div className="flex justify-end gap-3 pt-4 border-t">
//             <Button variant="outline" onClick={closeReportModal} disabled={reportSubmitting}>
//               Cancel
//             </Button>
//             <Button variant="primary" onClick={handleSubmitReport} isLoading={reportSubmitting}>
//               {reportData ? "Submit Correction" : "Submit Report"}
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
//       <div className="space-y-4 rounded-md border border-gray-200 bg-white p-5 shadow-sm">
//         <div className="h-8 w-56 animate-pulse rounded-md bg-gray-100" />
//         <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
//           <div className="h-48 animate-pulse rounded-md bg-gray-100" />
//           <div className="h-48 animate-pulse rounded-md bg-gray-100" />
//         </div>
//         <div className="h-64 w-full animate-pulse rounded-md bg-gray-100" />
//       </div>
//     );
//   }

//   if (!order) {
//     return (
//       <section className="rounded-md border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
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
//           className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
//         >
//           <ArrowLeft size={14} />
//           Back to Test Orders
//         </button>
//       </div>

//       <section className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
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
//           <div className="space-y-4 rounded-md border border-gray-200 p-4">
//             <h3 className="text-sm font-semibold text-[#1A2380]">
//               Patient Information
//             </h3>
//             <div className="grid grid-cols-1 gap-2 text-sm text-gray-700 sm:grid-cols-2">
//               <p>
//                 Name: <span className="font-medium">{order.patientName}</span>
//               </p>
//               <p>
//                 Patient ID: <span className="font-medium">{order.patientCode || order.patientId}</span>
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

//           <div className="space-y-4 rounded-md border border-gray-200 p-4">
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
//           <div className="rounded-md border border-gray-200 p-4">
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

//           <div className="rounded-md border border-gray-200 p-4">
//             <h3 className="mb-3 text-sm font-semibold text-[#1A2380]">
//               Clinical Notes
//             </h3>
//             <p className="text-sm leading-relaxed text-gray-700">
//               {order.clinicalNotes}
//             </p>
//           </div>
//         </div>

//         <article className="mt-4 rounded-md border border-gray-200 p-4">
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

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@components/StatusBadge";
import { useAuth } from "@context/AuthContext";
import { consultationService, labService, organizationService, patientService } from "@services/api";
import {
  LabOrder,
  RawConsultation,
  formatDateTime,
  isNotFoundApiError,
  mapLabOrder,
  toStatusBadgeType,
  getConsultationsArray,
  buildPatientName,
  getPatientId,
  buildDoctorName,
  Attachment,
} from "./labOrderUtils";
import { PriorityBadge } from "./LabOrderQueue";
import Modal from "@components/Modal";
import { Textarea, FieldLabel } from "@components/Field";
import Button from "@components/Button";
import { toast } from "react-toastify";
import { ArrowLeft, Download, ExternalLink, FileText, Image as ImageIcon, Loader2, Plus, Trash2, UploadCloud } from "lucide-react";
import { useConfirm } from "@components/ConfirmDialog";
import { labRequestReferrer } from "./labRequest";

const ATTACHMENT_ACCEPT = "image/*,application/pdf";
const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

const isAcceptedAttachment = (file: File) =>
  file.type === "application/pdf" ||
  file.type.startsWith("image/") ||
  /\.(pdf|png|jpe?g|webp|gif|heic)$/i.test(file.name);

const apiErrorMessage = (err: unknown, fallback: string) => {
  const data = (err as { response?: { data?: Record<string, unknown> } })?.response?.data;
  const message = data?.detail || data?.message || data?.error;
  if (typeof message === "string") return message;
  if (Array.isArray(message)) return message.map(String).join(", ");
  return fallback;
};

type UploadProgress = {
  fileName: string;
  index: number;
  total: number;
  percent: number;
};

function LabReportSection({
  order,
  orgId,
  id,
  onReportCompleted,
}: {
  order: LabOrder;
  orgId: string | null;
  id: string;
  onReportCompleted?: () => void;
}) {
  // Store the full structured response from the API
  const [reportData, setReportData] = useState<{
    interpretation: string;
    results: any[];
  } | null>(null);

  // A report can exist with only attachments (a scanned result sheet), so
  // track existence separately from whether it has structured content.
  const [reportExists, setReportExists] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [upload, setUpload] = useState<UploadProgress | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { confirm, confirmDialog } = useConfirm();
  const uploading = upload !== null;

  // Form states matching the payload
  const [interpretation, setInterpretation] = useState("");
  const [results, setResults] = useState([
    { parameter: "", value: "", unit: "", reference_range: "", flag: "Normal" },
  ]);

  // Applies a LabReportResponse (from GET /report or an upload response).
  const applyReport = useCallback((raw: unknown) => {
    const data = ((raw as { data?: unknown })?.data ?? raw) as {
      interpretation?: string | null;
      results?: any[] | null;
      attachments?: Attachment[] | null;
    } | null;
    if (!data || typeof data !== "object") return;
    setReportExists(true);
    setAttachments(Array.isArray(data.attachments) ? data.attachments : []);
    const hasContent = Boolean(data.interpretation) || (data.results?.length ?? 0) > 0;
    setReportData(
      hasContent
        ? { interpretation: data.interpretation || "", results: data.results || [] }
        : null,
    );
  }, []);

  useEffect(() => {
    let ignore = false;

    const loadReport = async () => {
      if (!orgId) return;
      setReportLoading(true);
      try {
        const res = await labService.getLabReport(orgId, id);
        if (!ignore) applyReport(res);
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
  }, [applyReport, id, orgId]);

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

    const confirmed = await confirm(
      reportExists
        ? {
            title: "Update this report?",
            message: "The structured results and interpretation will be replaced. Attachments are kept.",
            confirmLabel: "Update report",
          }
        : {
            title: "Submit this report?",
            message: "The test will be marked as completed and the ordering doctor will see the results.",
            confirmLabel: "Submit report",
          },
    );
    if (!confirmed) return;

    setReportSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        interpretation,
        results: validResults,
      };

      // Both calls return the saved report, and submitting marks the test
      // Completed in the same transaction — nothing else to fetch or update.
      if (reportExists) {
        applyReport(await labService.correctLabReport(orgId, order.id, payload));
        toast.success("Report updated");
      } else {
        applyReport(await labService.submitLabReport(orgId, order.id, payload));
        toast.success("Report submitted");
      }
      onReportCompleted?.();

      closeReportModal();
    } catch (err: any) {
      console.error("Report submission failed", err);
      setSubmitError(err?.response?.data?.message || err?.message || "Submission failed");
      toast.error("Failed to submit report");
    } finally {
      setReportSubmitting(false);
    }
  };

  const handleFileUpload = async (fileList: FileList | null) => {
    if (!orgId || !order || !fileList?.length || uploading) return;

    const files = Array.from(fileList).filter((file) => {
      if (!isAcceptedAttachment(file)) {
        toast.error(`"${file.name}" is not an image or PDF.`);
        return false;
      }
      if (file.size > MAX_ATTACHMENT_BYTES) {
        toast.error(`"${file.name}" is larger than 10 MB.`);
        return false;
      }
      return true;
    });
    if (files.length === 0) return;

    const hadReport = reportExists;
    let uploaded = 0;
    // Upload one at a time so progress is meaningful and a failure on one
    // file doesn't hide which ones made it.
    for (const [index, file] of files.entries()) {
      setUpload({ fileName: file.name, index, total: files.length, percent: 0 });
      try {
        const report = await labService.uploadLabReportAttachment(
          orgId,
          order.id,
          file,
          (percent) =>
            setUpload((current) => (current ? { ...current, percent } : current)),
        );
        applyReport(report);
        uploaded += 1;
      } catch (err) {
        console.error("Attachment upload failed", err);
        toast.error(`"${file.name}": ${apiErrorMessage(err, "upload failed")}`);
      }
    }
    setUpload(null);

    if (uploaded > 0) {
      toast.success(uploaded === 1 ? "Attachment uploaded" : `${uploaded} attachments uploaded`);
      // The first upload creates the report and completes the test server-side.
      if (!hadReport) onReportCompleted?.();
    }
  };

  const handleDeleteAttachment = async (attachment: Attachment) => {
    if (!orgId || !order) return;
    const confirmed = await confirm({
      title: "Delete attachment?",
      message: `"${attachment.file_name || "This file"}" will be permanently removed from the report.`,
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!confirmed) return;
    setDeletingId(attachment.id);
    try {
      await labService.deleteLabReportAttachment(orgId, order.id, attachment.id);
      setAttachments((current) => current.filter((item) => item.id !== attachment.id));
      toast.success("Attachment deleted");
    } catch (err) {
      console.error("Failed to delete attachment", err);
      // 409: it's the report's only content — the backend explains why.
      toast.error(apiErrorMessage(err, "Failed to delete attachment"));
    } finally {
      setDeletingId(null);
    }
  };


  const handleDownloadReport = () => {
    if (!reportData || !order) return;

    let resultsText = reportData.results.map(r => 
      `${r.parameter}: ${r.value} ${r.unit} (Ref: ${r.reference_range}) [${r.flag}]`
    ).join("\n");

    const reportContent = `Laboratory Test Report\n\nPatient: ${order.patientName}\nPatient ID: ${order.patientCode || "Not recorded"}\nGender: ${order.patientGender || "Not recorded"}\nAge: ${order.patientAge || "Not recorded"}\nRequested By: ${order.orderingDoctor}\nTest: ${order.test_name || order.test_type}\nDate Ordered: ${formatDateTime(order.orderedAt)}\n\nStructured Results:\n${resultsText}\n\nInterpretation:\n${reportData.interpretation}`;

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lab-report-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const inputClass = "w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

  return (
    <section className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-gray-900">Report</h2>

      {reportLoading ? (
        <div className="h-24 w-full animate-pulse rounded-md bg-gray-100" />
      ) : !reportData ? (
        <div className="text-center">
          <p className="text-sm text-gray-500">
            {reportExists
              ? "This report is an uploaded file. You can also add structured results."
              : "No report submitted yet. Enter structured results, or upload a scanned result sheet below."}
          </p>
          <Button onClick={openReportModal} className="mt-4" variant="primary" size="sm">
            {reportExists ? "Add Structured Results" : "Submit Report"}
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
                      <span className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ${
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


      <div className="mt-6 border-t border-gray-100 pt-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h4 className="text-sm font-semibold text-gray-700">
            Attachments{attachments.length > 0 ? ` (${attachments.length})` : ""}
          </h4>
          <p className="text-xs text-gray-400">Images or PDF, up to 10 MB each</p>
        </div>

        {reportLoading ? (
          <div className="h-14 w-full animate-pulse rounded-md bg-gray-100" />
        ) : attachments.length > 0 ? (
          <ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
            {attachments.map((attachment) => {
              const isImage = attachment.content_type?.startsWith("image/");
              const name = attachment.file_name || "Untitled file";
              const deleting = deletingId === attachment.id;
              return (
                <li
                  key={attachment.id}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm ${deleting ? "opacity-50" : ""}`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
                      isImage ? "bg-sky-50 text-sky-600" : "bg-red-50 text-red-600"
                    }`}
                  >
                    {isImage ? (
                      <ImageIcon className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <FileText className="h-4 w-4" aria-hidden="true" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-800" title={name}>
                      {name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {isImage ? "Image" : attachment.content_type?.includes("pdf") ? "PDF" : "File"}
                      {attachment.created_at ? ` · Uploaded ${formatDateTime(attachment.created_at)}` : ""}
                    </p>
                  </div>
                  {attachment.file_url ? (
                    <a
                      href={attachment.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-9 shrink-0 items-center gap-1 rounded-md px-2 text-xs font-medium text-[#007F73] hover:bg-teal-50"
                    >
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /> Open
                    </a>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => void handleDeleteAttachment(attachment)}
                    disabled={deleting || uploading}
                    aria-label={`Delete ${name}`}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed"
                  >
                    {deleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="rounded-md bg-gray-50 px-3 py-3 text-sm text-gray-500">
            No files uploaded yet. A scanned result sheet, analyzer printout or
            external lab PDF can serve as the report on its own.
          </p>
        )}

        {upload ? (
          <div
            role="status"
            aria-live="polite"
            className="mt-3 rounded-md border border-teal-200 bg-teal-50 p-3"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-teal-900">
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate">
                Uploading {upload.fileName}
                {upload.total > 1 ? ` (${upload.index + 1} of ${upload.total})` : ""}
              </span>
              <span className="shrink-0 tabular-nums">{upload.percent}%</span>
            </div>
            <div
              className="mt-2 h-2 w-full overflow-hidden rounded-full bg-teal-100"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={upload.percent}
              aria-label="Upload progress"
            >
              <div
                className="h-full rounded-full bg-[#007F73] transition-[width] duration-200"
                style={{ width: `${Math.max(upload.percent, 3)}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-teal-800">
              {upload.percent >= 100 ? "Processing on the server…" : "Keep this page open until the upload finishes."}
            </p>
          </div>
        ) : null}

        <label
          className={`mt-3 flex items-center justify-center gap-2 rounded-md border-2 border-dashed p-4 text-sm font-medium ${
            uploading
              ? "cursor-not-allowed border-gray-200 text-gray-400"
              : "cursor-pointer border-gray-300 text-gray-600 hover:border-[#007F73] hover:bg-teal-50 hover:text-[#007F73]"
          }`}
        >
          <input
            type="file"
            multiple
            accept={ATTACHMENT_ACCEPT}
            className="sr-only"
            onChange={(e) => {
              void handleFileUpload(e.target.files);
              e.target.value = "";
            }}
            disabled={uploading}
          />
          <UploadCloud className="h-5 w-5" aria-hidden="true" />
          {uploading ? "Upload in progress…" : "Upload files"}
        </label>
      </div>

      {confirmDialog}

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
                <div key={idx} className="relative flex flex-wrap gap-2 rounded-md border border-gray-200 bg-gray-50 p-3 pt-6 sm:flex-nowrap sm:pt-3">
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

type ConsultationNoteItem = { id: string; content: string; created_at?: string };

const EMPTY_VALUES = /^(-|none|nil|n\/a|not recorded|no allergies recorded)$/i;
const hasValue = (value?: string | null): value is string =>
  typeof value === "string" && value.trim().length > 0 && !EMPTY_VALUES.test(value.trim());

const ageFromDob = (dob?: string | null) => {
  if (!dob) return "";
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return "";
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const beforeBirthday =
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());
  if (beforeBirthday) age -= 1;
  return age >= 0 ? `${age} yrs` : "";
};

const formatDate = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { dateStyle: "medium" });
};

/** Label above value, so each fact reads at a glance. */
function Fact({ label, value, className }: { label: string; value?: string | null; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className={`mt-1 text-sm font-semibold ${hasValue(value) ? "text-gray-900" : "font-normal text-gray-400"}`}>
        {hasValue(value) ? value : "Not recorded"}
      </dd>
    </div>
  );
}

// Lab test status transitions the lab performs: Pending → In Progress → Completed.
const NEXT_STATUS: Partial<Record<LabOrder["status"], { api: "In Progress" | "Completed"; local: LabOrder["status"]; label: string }>> = {
  pending: { api: "In Progress", local: "in_progress", label: "Start processing" },
  in_progress: { api: "Completed", local: "completed", label: "Mark as completed" },
};

export default function LabOrderDetailsClient({ id }: { id: string }) {
  const router = useRouter();
  const { activeWorkspace } = useAuth();
  const orgId = activeWorkspace?.id ?? null;
  const { confirm, confirmDialog } = useConfirm();

  const [order, setOrder] = useState<LabOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [patientRecord, setPatientRecord] = useState<Record<string, unknown> | null>(null);
  const [notes, setNotes] = useState<ConsultationNoteItem[]>([]);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const patientValue = (...keys: string[]) => {
    for (const key of keys) {
      const value = patientRecord?.[key];
      if (typeof value === "string" && value.trim()) return value;
      if (typeof value === "number") return String(value);
    }
    return "";
  };

  useEffect(() => {
    if (!orgId) {
      setLoading(false);
      setOrder(null);
      setPatientRecord(null);
      return;
    }

    let ignore = false;

    // Only what this page shows: the test, its consultation, the patient, and
    // (for in-house orders) the staff list to name the doctor. No org-wide lists.
    const loadDetails = async () => {
      setLoading(true);
      setHasError(false);

      try {
        let nextOrder: LabOrder = mapLabOrder(await labService.getLabTestDetail(orgId, id));
        let consultation: (RawConsultation & { notes?: ConsultationNoteItem[] }) | undefined;

        if (nextOrder.consultation_id) {
          const consultationRaw = await consultationService.getConsultation(orgId, nextOrder.consultation_id);
          const consultationData =
            consultationRaw && typeof consultationRaw === "object" && "data" in consultationRaw
              ? (consultationRaw as { data: unknown }).data
              : consultationRaw;
          consultation = getConsultationsArray([consultationData])[0] as typeof consultation;
        }

        // Walk-in / referral visits have no in-house doctor; show who asked.
        const referrer = labRequestReferrer(consultation?.reason_for_visit);
        const patientId = getPatientId(consultation as RawConsultation, nextOrder.patientId);

        const [patientResult, membersResult] = await Promise.allSettled([
          patientId ? patientService.getPatient(orgId, patientId) : Promise.resolve(null),
          consultation?.doctor_id && !referrer ? organizationService.getMembers(orgId) : Promise.resolve([]),
        ]);

        const fullPatient =
          patientResult.status === "fulfilled" && patientResult.value && typeof patientResult.value === "object"
            ? ((("data" in patientResult.value ? (patientResult.value as { data: unknown }).data : patientResult.value) ??
                null) as Record<string, unknown> | null)
            : null;

        const doctor =
          membersResult.status === "fulfilled" && Array.isArray(membersResult.value)
            ? membersResult.value.find((member) => member.user?.id === consultation?.doctor_id)
            : undefined;
        const doctorName = doctor ? `Dr. ${doctor.user.first_name ?? ""} ${doctor.user.last_name ?? ""}`.trim() : "";

        nextOrder = {
          ...nextOrder,
          patientId,
          patientName: buildPatientName(consultation as RawConsultation, nextOrder.patientName),
          patientCode: (fullPatient?.patient_code as string) || nextOrder.patientCode,
          patientGender: (fullPatient?.gender as string) || nextOrder.patientGender,
          patientAge:
            ageFromDob((fullPatient?.dob as string) || (fullPatient?.date_of_birth as string)) || nextOrder.patientAge,
          orderingDoctor: referrer || doctorName || buildDoctorName(consultation as RawConsultation, ""),
          departmentName: consultation?.department?.name || consultation?.department_name || nextOrder.departmentName,
        };

        if (!ignore) {
          setOrder(nextOrder);
          setPatientRecord(fullPatient);
          setNotes(
            [...(consultation?.notes ?? [])].sort(
              (a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime(),
            ),
          );
        }
      } catch (error) {
        console.error("Failed to load lab order details", error);
        if (!ignore) {
          setHasError(true);
          setOrder(null);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    void loadDetails();

    return () => {
      ignore = true;
    };
  }, [id, orgId]);

  const advanceStatus = async () => {
    if (!orgId || !order || updatingStatus) return;
    const next = NEXT_STATUS[order.status];
    if (!next) return;

    if (next.api === "Completed") {
      const confirmed = await confirm({
        title: "Mark this test as completed?",
        message:
          "The requesting doctor will see the test as completed. Make sure the results are submitted or a report file is uploaded.",
        confirmLabel: "Mark as completed",
      });
      if (!confirmed) return;
    }

    setUpdatingStatus(true);
    try {
      await labService.updateLabTestStatus(orgId, order.id, next.api);
      setOrder((current) => (current ? { ...current, status: next.local } : current));
      toast.success(next.api === "Completed" ? "Test marked as completed." : "Processing started.");
    } catch (error) {
      console.error("Failed to update lab test status", error);
      toast.error("Couldn't update the test status. Please try again.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 py-2 sm:py-4">
        <div className="h-4 w-32 animate-pulse rounded-md bg-gray-100" />
        <div className="h-40 animate-pulse rounded-md bg-gray-100" />
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="h-64 animate-pulse rounded-md bg-gray-100" />
          <div className="h-64 animate-pulse rounded-md bg-gray-100" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <section className="rounded-md border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
        {hasError ? "Unable to load this test order right now." : "Lab order details are unavailable."}
      </section>
    );
  }

  const next = NEXT_STATUS[order.status];
  const allergies = patientValue("allergies");
  const clinicalContext = (
    [
      ["Symptoms", patientValue("symptoms")],
      ["Current medications", patientValue("current_medications")],
      ["Past medical history", patientValue("past_medical_history")],
    ] as const
  ).filter(([, value]) => hasValue(value));

  return (
    <div className="space-y-5 py-2 sm:py-4">
      <button
        type="button"
        onClick={() => router.push("/dashboard/lab-scientist/test-orders")}
        className="inline-flex items-center gap-1.5 rounded-md py-1 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Test orders
      </button>

      {/* Header: what the test is, where it stands, and the next action. */}
      <section className="rounded-md border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#007F73]">
              {order.testCategory || "Lab test"}
            </p>
            <h1 className="mt-1 break-words text-2xl font-bold text-gray-900 sm:text-3xl">
              {order.test_name || order.test_type}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusBadge status={toStatusBadgeType(order.status)} />
              <PriorityBadge priority={order.priority} />
            </div>
          </div>
          {next ? (
            <button
              type="button"
              onClick={() => void advanceStatus()}
              disabled={updatingStatus}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-[#007F73] px-5 text-sm font-semibold text-white hover:bg-[#006E64] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updatingStatus ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
              {updatingStatus ? "Updating…" : next.label}
            </button>
          ) : null}
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-gray-100 pt-5 md:grid-cols-4">
          <Fact label="Ordered" value={formatDateTime(order.orderedAt)} />
          <Fact label="Requested by" value={order.orderingDoctor} />
          <Fact label="Department" value={order.departmentName} />
          <Fact label="Patient" value={order.patientName} />
        </dl>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="min-w-0 space-y-5">
          {notes.length > 0 ? (
            <section className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900">Clinical notes</h2>
              <ul className="mt-3 space-y-3">
                {notes.map((note) => (
                  <li key={note.id} className="rounded-md bg-gray-50 p-3">
                    <p className="whitespace-pre-wrap text-sm leading-6 text-gray-800">{note.content}</p>
                    {note.created_at ? (
                      <p className="mt-1.5 text-xs text-gray-500">{formatDateTime(note.created_at)}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <LabReportSection
            order={order}
            orgId={orgId}
            id={id}
            onReportCompleted={() =>
              setOrder((current) => (current ? { ...current, status: "completed" } : current))
            }
          />
        </div>

        {/* Patient: identity first, then what matters for testing. */}
        <aside className="space-y-4 rounded-md border border-gray-200 bg-white p-5 shadow-sm lg:sticky lg:top-4">
          <div>
            <h2 className="text-xs font-medium uppercase tracking-wide text-gray-500">Patient</h2>
            <p className="mt-1 text-lg font-semibold text-gray-900">{order.patientName || "Unknown patient"}</p>
            {order.patientCode ? <p className="text-sm text-gray-500">{order.patientCode}</p> : null}
          </div>

          {hasValue(allergies) ? (
            <div role="note" className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Allergies</p>
              <p className="mt-0.5 text-sm font-medium text-amber-900">{allergies}</p>
            </div>
          ) : null}

          <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
            <Fact label="Age" value={order.patientAge} />
            <Fact label="Sex" value={order.patientGender} />
            <Fact label="Date of birth" value={formatDate(patientValue("dob", "date_of_birth"))} />
            <Fact label="Blood group" value={patientValue("blood_group")} />
            <Fact label="Phone" value={patientValue("phone_number", "phone")} className="col-span-2" />
          </dl>

          {clinicalContext.length > 0 ? (
            <dl className="space-y-3 border-t border-gray-100 pt-4">
              {clinicalContext.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
                  <dd className="mt-1 text-sm text-gray-800">{value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </aside>
      </div>

      {confirmDialog}
    </div>
  );
}
