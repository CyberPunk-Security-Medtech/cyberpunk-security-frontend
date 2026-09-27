"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Check, Loader2, Plus, Search, Stethoscope, X } from "lucide-react";
import { toast } from "react-toastify";
import Modal from "@components/Modal";
import {
  consultationService,
  labService,
  organizationService,
  LAB_TEST_PRIORITIES,
  type ConsultationRecord,
  type ConsultationStatus,
  type Department,
  type LabTestPriority,
  type Membership,
} from "@services/api";
import { useAuth } from "@context/AuthContext";
import { LabOrder, mapLabOrder } from "./labOrderUtils";
import {
  buildLabRequestNote,
  buildLabRequestReason,
  isLabRequestReason,
  labRequestReferrer,
  type LabRequestSource,
} from "./labRequest";
import WalkInPatientPicker, { type WalkInPatient } from "./WalkInPatientPicker";

type Props = { open: boolean; onClose: () => void; onOrderCreated: (order: LabOrder) => void };

// Two ways a lab receives work:
//  - "consultation": a doctor in this facility asked for tests during a
//    consultation (hospital labs). The ordering doctor comes from it.
//  - "walk-in": the patient arrives with an outside referral or requests tests
//    themselves (standalone labs, external referrals). A lab-visit
//    consultation is created to hold the tests; see labRequest.ts.
type Mode = "consultation" | "walk-in";
const MODE_STORAGE_KEY = "privacure.labOrderMode";

const PAGE_SIZE = 20;
const STATUS_TABS: { status: ConsultationStatus; label: string }[] = [
  { status: "In Progress", label: "In progress" },
  { status: "Pending", label: "Waiting" },
];

const TEST_CATEGORIES = [
  "Hematology",
  "Clinical Chemistry",
  "Microbiology",
  "Serology / Immunology",
  "Parasitology",
  "Urinalysis",
  "Histopathology",
  "Other",
];

// Common tests, with the category they usually fall under, to speed up
// entry and keep naming consistent across orders.
const COMMON_TESTS: Record<string, string> = {
  "Full Blood Count": "Hematology",
  "Packed Cell Volume": "Hematology",
  "Erythrocyte Sedimentation Rate": "Hematology",
  "Blood Group & Genotype": "Hematology",
  "Malaria Parasite": "Parasitology",
  "Fasting Blood Sugar": "Clinical Chemistry",
  "Random Blood Sugar": "Clinical Chemistry",
  "HbA1c": "Clinical Chemistry",
  "Lipid Profile": "Clinical Chemistry",
  "Liver Function Test": "Clinical Chemistry",
  "Kidney Function Test": "Clinical Chemistry",
  "Electrolytes, Urea & Creatinine": "Clinical Chemistry",
  "Urinalysis": "Urinalysis",
  "Urine Microscopy, Culture & Sensitivity": "Microbiology",
  "Blood Culture": "Microbiology",
  "Widal Test": "Serology / Immunology",
  "HIV Screening": "Serology / Immunology",
  "Hepatitis B Surface Antigen": "Serology / Immunology",
  "Hepatitis C Antibody": "Serology / Immunology",
  "Pregnancy Test": "Serology / Immunology",
  "Stool Microscopy": "Parasitology",
};

const PRIORITY_HINTS: Record<LabTestPriority, string> = {
  Routine: "Standard turnaround",
  Urgent: "Process ahead of routine work",
  Emergency: "Process immediately",
};

type TestRow = { key: number; name: string; category: string };
type ExistingTest = { id: string; test_name: string; status: string };

const inputClass =
  "mt-1 h-10 w-full rounded-md border border-gray-300 px-3 text-sm font-normal text-gray-900 outline-none focus:border-[#007F73] focus:ring-2 focus:ring-[#007F73]/20";

const unwrapList = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) return value as T[];
  const data = (value as { data?: unknown })?.data;
  return Array.isArray(data) ? (data as T[]) : [];
};

const unwrapRecord = <T,>(value: unknown): T =>
  ((value as { data?: unknown })?.data ?? value) as T;

const patientName = (item: ConsultationRecord) =>
  `${item.patient?.first_name ?? ""} ${item.patient?.last_name ?? ""}`.trim() || "Unknown patient";

const isOpenStatus = (status: string) => !/complete|cancel/i.test(status);

let rowKey = 0;
const newRow = (name = "", category = ""): TestRow => ({ key: ++rowKey, name, category });

const readStoredMode = (orgId?: string): Mode => {
  if (!orgId) return "consultation";
  try {
    return window.localStorage.getItem(`${MODE_STORAGE_KEY}.${orgId}`) === "walk-in"
      ? "walk-in"
      : "consultation";
  } catch {
    return "consultation";
  }
};

export default function CreateTestOrderModal({ open, onClose, onOrderCreated }: Props) {
  const { activeWorkspace } = useAuth();
  const orgId = activeWorkspace?.id;

  const [mode, setModeState] = useState<Mode>("consultation");

  // Consultation picker
  const [statusTab, setStatusTab] = useState<ConsultationStatus>("In Progress");
  const [consultations, setConsultations] = useState<ConsultationRecord[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingPage, setLoadingPage] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ConsultationRecord | null>(null);
  const [members, setMembers] = useState<Membership[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const membersLoadedFor = useRef<string | null>(null);
  const departmentsLoadedFor = useRef<string | null>(null);

  // Walk-in request
  const [walkInPatient, setWalkInPatient] = useState<WalkInPatient | null>(null);
  const [sourceKind, setSourceKind] = useState<LabRequestSource["kind"]>("referral");
  const [referringDoctor, setReferringDoctor] = useState("");
  const [referringFacility, setReferringFacility] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentId, setDepartmentId] = useState("");

  // Tests (both modes)
  const [tests, setTests] = useState<TestRow[]>(() => [newRow()]);
  const [priority, setPriority] = useState<LabTestPriority>("Routine");
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [existingTests, setExistingTests] = useState<ExistingTest[]>([]);
  const [saving, setSaving] = useState(false);

  // Each organization tends to use one mode; remember its last choice.
  useEffect(() => {
    if (open) setModeState(readStoredMode(orgId));
  }, [open, orgId]);

  const setMode = (next: Mode) => {
    setModeState(next);
    try {
      if (orgId) window.localStorage.setItem(`${MODE_STORAGE_KEY}.${orgId}`, next);
    } catch {
      // Storage unavailable (private mode) — the choice just isn't remembered.
    }
  };

  const doctorName = useCallback(
    (doctorId: string | null) => {
      if (!doctorId) return "";
      const member = members.find((entry) => entry.user?.id === doctorId);
      if (!member) return "Assigned doctor";
      const name = `${member.user.first_name ?? ""} ${member.user.last_name ?? ""}`.trim();
      return name ? `Dr. ${name}` : "Assigned doctor";
    },
    [members],
  );

  // Who asked for the tests: the in-house doctor, or the outside referrer
  // recorded on a lab-request consultation.
  const requesterFor = useCallback(
    (item: ConsultationRecord) =>
      item.doctor_id ? doctorName(item.doctor_id) : labRequestReferrer(item.reason_for_visit) ?? "",
    [doctorName],
  );

  const canOrderOn = (item: ConsultationRecord) =>
    Boolean(item.doctor_id) || isLabRequestReason(item.reason_for_visit);

  const loadPage = useCallback(
    async (status: ConsultationStatus, nextPage: number) => {
      if (!orgId) return;
      requestRef.current?.abort();
      const controller = new AbortController();
      requestRef.current = controller;
      setLoadingPage(true);
      setLoadError(false);
      try {
        const response = await consultationService.listConsultationsPage(
          orgId,
          { status_filter: status, page: nextPage, page_size: PAGE_SIZE },
          controller.signal,
        );
        setConsultations((current) =>
          nextPage === 1 ? response.data : [...current, ...response.data],
        );
        setPage(response.page);
        setTotalPages(response.total_pages);
        setTotal(response.total);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Failed to load consultations", error);
        setLoadError(true);
      } finally {
        if (!controller.signal.aborted) setLoadingPage(false);
      }
    },
    [orgId],
  );

  // (Re)load the first page whenever the consultation picker becomes visible.
  useEffect(() => {
    if (!open || !orgId || mode !== "consultation") return;
    setConsultations([]);
    setPage(0);
    setTotalPages(1);
    listRef.current?.scrollTo({ top: 0 });
    void loadPage(statusTab, 1);
    return () => requestRef.current?.abort();
  }, [open, orgId, mode, statusTab, loadPage]);

  // Staff list, only to put a name to each consultation's doctor. Fetched once
  // per organization while the page is open.
  useEffect(() => {
    if (!open || !orgId || mode !== "consultation" || membersLoadedFor.current === orgId) return;
    membersLoadedFor.current = orgId;
    organizationService
      .getMembers(orgId)
      .then((list) => setMembers(Array.isArray(list) ? list : []))
      .catch(() => {
        membersLoadedFor.current = null;
        setMembers([]);
      });
  }, [open, orgId, mode]);

  // Departments for the walk-in visit; pre-pick the lab if there is one.
  useEffect(() => {
    if (!open || !orgId || mode !== "walk-in" || departmentsLoadedFor.current === orgId) return;
    departmentsLoadedFor.current = orgId;
    organizationService
      .getDepartments(orgId)
      .then((list) => {
        const items = Array.isArray(list) ? list : [];
        setDepartments(items);
        setDepartmentId((current) => {
          if (current && items.some((item) => item.id === current)) return current;
          const lab = items.find((item) => /lab|patholog|diagnos/i.test(item.name));
          return lab?.id ?? (items.length === 1 ? items[0].id : "");
        });
      })
      .catch(() => {
        departmentsLoadedFor.current = null;
        setDepartments([]);
      });
  }, [open, orgId, mode]);

  const hasMore = page > 0 && page < totalPages && consultations.length < total;

  // Load the next page when the bottom of the list scrolls into view.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    const root = listRef.current;
    if (!open || mode !== "consultation" || !sentinel || !root || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !loadingPage) void loadPage(statusTab, page + 1);
      },
      { root, rootMargin: "80px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [open, mode, hasMore, loadingPage, loadPage, page, statusTab]);

  // Tests already on the chosen consultation, to catch duplicate orders.
  useEffect(() => {
    if (!orgId || !selected || mode !== "consultation") {
      setExistingTests([]);
      return;
    }
    let cancelled = false;
    labService
      .listLabTests(orgId, selected.id)
      .then((result) => {
        if (!cancelled) setExistingTests(unwrapList<ExistingTest>(result));
      })
      .catch(() => {
        if (!cancelled) setExistingTests([]);
      });
    return () => {
      cancelled = true;
    };
  }, [orgId, selected, mode]);

  const visibleConsultations = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return consultations;
    return consultations.filter((item) =>
      [
        item.patient?.first_name,
        item.patient?.last_name,
        item.patient?.patient_code,
        item.reason_for_visit,
        item.department?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [consultations, search]);

  const openDuplicates = useMemo(() => {
    const open = new Map(
      existingTests
        .filter((test) => isOpenStatus(test.status ?? ""))
        .map((test) => [test.test_name?.trim().toLowerCase(), test.test_name]),
    );
    return tests
      .map((row) => open.get(row.name.trim().toLowerCase()))
      .filter((name): name is string => Boolean(name));
  }, [existingTests, tests]);

  const filledTests = tests.filter((row) => row.name.trim());
  const repeatedInForm = useMemo(() => {
    const seen = new Set<string>();
    return filledTests.some((row) => {
      const key = row.name.trim().toLowerCase();
      if (seen.has(key)) return true;
      seen.add(key);
      return false;
    });
  }, [filledTests]);

  const updateRow = (key: number, patch: Partial<TestRow>) =>
    setTests((current) =>
      current.map((row) => {
        if (row.key !== key) return row;
        const next = { ...row, ...patch };
        // Suggest the usual category for a common test, without overriding a choice.
        if (patch.name !== undefined && !row.category && COMMON_TESTS[patch.name]) {
          next.category = COMMON_TESTS[patch.name];
        }
        return next;
      }),
    );

  const reset = () => {
    setSearch("");
    setSelected(null);
    setWalkInPatient(null);
    setSourceKind("referral");
    setReferringDoctor("");
    setReferringFacility("");
    setTests([newRow()]);
    setPriority("Routine");
    setClinicalNotes("");
    setExistingTests([]);
  };

  const close = () => {
    if (saving) return;
    reset();
    onClose();
  };

  const walkInSource: LabRequestSource =
    sourceKind === "self"
      ? { kind: "self" }
      : { kind: "referral", doctorName: referringDoctor, facility: referringFacility };

  const readyToOrder =
    filledTests.length > 0 &&
    !repeatedInForm &&
    (mode === "consultation"
      ? Boolean(selected && canOrderOn(selected))
      : Boolean(walkInPatient && departmentId && (sourceKind === "self" || referringDoctor.trim())));

  const create = async () => {
    if (!orgId || !readyToOrder || saving) return;
    setSaving(true);

    let consultation: ConsultationRecord | null = mode === "consultation" ? selected : null;
    let requester = consultation ? requesterFor(consultation) : "";

    try {
      if (mode === "walk-in") {
        consultation = unwrapRecord<ConsultationRecord>(
          await consultationService.createConsultation(orgId, {
            patient_id: walkInPatient!.id,
            department_id: departmentId,
            reason_for_visit: buildLabRequestReason(walkInSource),
            priority,
          }),
        );
        if (!consultation?.id) throw new Error("The visit could not be created.");
        requester = labRequestReferrer(consultation.reason_for_visit) ?? "External request";
      }
    } catch (error) {
      console.error("Failed to create lab visit", error);
      const status = (error as { response?: { status?: number } })?.response?.status;
      toast.error(
        status === 403
          ? "Your role can't open a lab visit. Ask an administrator for consultation access."
          : "Couldn't open the lab visit. Please try again.",
      );
      setSaving(false);
      return;
    }

    const target = consultation!;

    // Referral details and clinical notes live on the consultation as a note
    // — lab tests themselves have no notes field.
    const note =
      mode === "walk-in"
        ? buildLabRequestNote(walkInSource, filledTests.map((row) => row.name.trim()), clinicalNotes)
        : clinicalNotes.trim()
          ? `Lab order (${filledTests.map((row) => row.name.trim()).join(", ")}): ${clinicalNotes.trim()}`
          : "";
    if (note) {
      try {
        await consultationService.addConsultationNote(orgId, target.id, note);
      } catch (error) {
        console.warn("Failed to save lab request note", error);
        toast.warn("The tests will be ordered, but the notes couldn't be saved.");
      }
    }

    const failed: TestRow[] = [];
    let created = 0;
    for (const row of filledTests) {
      try {
        const raw = await labService.createLabTest(orgId, target.id, {
          test_name: row.name.trim(),
          test_category: row.category || null,
          priority,
        });
        const mapped = mapLabOrder(raw);
        onOrderCreated({
          ...mapped,
          consultation_id: target.id,
          patientName: mode === "walk-in" ? walkInPatient!.name : patientName(target),
          patientId: target.patient_id || mapped.patientId,
          patientCode:
            (mode === "walk-in" ? walkInPatient!.code : target.patient?.patient_code) || mapped.patientCode,
          orderingDoctor: requester || mapped.orderingDoctor,
          priority,
        });
        created += 1;
      } catch (error) {
        console.error("Failed to create lab test", row.name, error);
        failed.push(row);
      }
    }

    setSaving(false);

    if (failed.length === 0) {
      toast.success(created === 1 ? `${filledTests[0].name.trim()} ordered.` : `${created} tests ordered.`);
      reset();
      onClose();
      return;
    }

    // Keep the form open on the same consultation so only the failures are retried.
    toast.error(
      `${failed.length === filledTests.length ? "No tests were" : `${failed.length} test(s) were not`} ordered: ${failed
        .map((row) => row.name.trim())
        .join(", ")}. Try again.`,
    );
    setTests(failed.map((row) => newRow(row.name, row.category)));
    setClinicalNotes("");
    if (mode === "walk-in") {
      setModeState("consultation");
      setSelected({
        ...target,
        patient: target.patient ?? {
          id: walkInPatient!.id,
          first_name: walkInPatient!.name,
          last_name: "",
          patient_code: walkInPatient!.code,
        },
      });
    }
  };

  const submitLabel = saving
    ? "Ordering…"
    : filledTests.length > 1
      ? `Order ${filledTests.length} tests`
      : openDuplicates.length
        ? "Order anyway"
        : "Order test";

  return (
    <Modal
      title="Order lab test"
      isOpen={open}
      onClose={close}
      header={
        mode === "consultation"
          ? "Tests requested by a doctor in this facility."
          : "A walk-in patient, or a referral from outside this facility."
      }
      headerClassName="bg-[#007F73]"
    >
      <div className="space-y-6">
        <div role="tablist" aria-label="Request type" className="grid grid-cols-2 gap-1 rounded-md bg-gray-100 p-1 text-sm">
          {(
            [
              ["consultation", "From a consultation"],
              ["walk-in", "Walk-in / referral"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={mode === value}
              disabled={saving}
              onClick={() => setMode(value)}
              className={`min-h-9 rounded-md px-3 font-medium ${
                mode === value ? "bg-white text-[#007F73] shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {mode === "consultation" ? (
          <section aria-labelledby="order-consultation-heading">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 id="order-consultation-heading" className="text-sm font-semibold text-gray-900">
                1. Consultation
              </h4>
              {!selected ? (
                <div role="tablist" aria-label="Consultation status" className="inline-flex rounded-md border border-gray-200 p-0.5 text-xs">
                  {STATUS_TABS.map((tab) => (
                    <button
                      key={tab.status}
                      type="button"
                      role="tab"
                      aria-selected={statusTab === tab.status}
                      onClick={() => setStatusTab(tab.status)}
                      className={`rounded-md px-3 py-1.5 font-medium ${
                        statusTab === tab.status ? "bg-[#007F73] text-white" : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {selected ? (
              <div className="mt-2 flex items-start justify-between gap-3 rounded-md border border-teal-200 bg-teal-50 p-3">
                <div className="min-w-0 text-sm">
                  <p className="font-semibold text-gray-900">
                    {patientName(selected)}
                    {selected.patient?.patient_code ? (
                      <span className="ml-2 font-normal text-gray-500">{selected.patient.patient_code}</span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 truncate text-gray-600">
                    {selected.reason_for_visit || "Consultation"}
                    {selected.department?.name ? ` · ${selected.department.name}` : ""}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-teal-800">
                    <Stethoscope size={13} aria-hidden="true" /> Requested by: {requesterFor(selected)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-teal-800 hover:bg-teal-100"
                >
                  Change
                </button>
              </div>
            ) : (
              <>
                <label className="relative mt-2 block">
                  <span className="sr-only">Search consultations</span>
                  <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by patient name, code or reason"
                    className={`${inputClass} mt-0 pl-9`}
                  />
                </label>

                <div
                  ref={listRef}
                  className="mt-2 max-h-64 overflow-y-auto rounded-md border border-gray-200"
                  aria-busy={loadingPage}
                >
                  {visibleConsultations.length > 0 ? (
                    <ul className="divide-y divide-gray-100">
                      {visibleConsultations.map((item) => {
                        const allowed = canOrderOn(item);
                        return (
                          <li key={item.id}>
                            <button
                              type="button"
                              disabled={!allowed}
                              onClick={() => setSelected(item)}
                              className="flex w-full items-start justify-between gap-3 px-3 py-2.5 text-left text-sm hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-transparent"
                            >
                              <span className="min-w-0">
                                <span className="block font-medium text-gray-900">
                                  {patientName(item)}
                                  {item.patient?.patient_code ? (
                                    <span className="ml-2 font-normal text-gray-500">{item.patient.patient_code}</span>
                                  ) : null}
                                </span>
                                <span className="block truncate text-xs text-gray-500">
                                  {item.reason_for_visit || "Consultation"}
                                  {item.department?.name ? ` · ${item.department.name}` : ""}
                                </span>
                              </span>
                              <span className={`shrink-0 text-xs ${allowed ? "text-gray-600" : "text-amber-700"}`}>
                                {allowed ? requesterFor(item) : "No doctor assigned"}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : !loadingPage ? (
                    <p className="px-3 py-6 text-center text-sm text-gray-500">
                      {loadError
                        ? "Couldn't load consultations."
                        : search
                          ? "No loaded consultations match your search."
                          : `No ${statusTab === "Pending" ? "waiting" : "in-progress"} consultations.`}
                    </p>
                  ) : null}

                  <div ref={sentinelRef} className="flex justify-center py-2 text-xs text-gray-500">
                    {loadingPage ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin" aria-hidden="true" /> Loading consultations…
                      </span>
                    ) : loadError ? (
                      <button type="button" onClick={() => void loadPage(statusTab, page + 1)} className="font-medium text-[#007F73] hover:underline">
                        Try again
                      </button>
                    ) : hasMore ? (
                      <button type="button" onClick={() => void loadPage(statusTab, page + 1)} className="font-medium text-[#007F73] hover:underline">
                        Load more
                      </button>
                    ) : null}
                  </div>
                </div>
                <p className="mt-1.5 text-xs text-gray-500">
                  {total > 0 ? `Showing ${consultations.length} of ${total}. ` : ""}
                  {search && hasMore ? "Search covers loaded consultations — scroll to load more. " : ""}
                  No doctor on the consultation? Use <button type="button" onClick={() => setMode("walk-in")} className="font-medium text-[#007F73] hover:underline">Walk-in / referral</button> instead.
                </p>
              </>
            )}
          </section>
        ) : orgId ? (
          <>
            <section aria-labelledby="walk-in-patient-heading">
              <h4 id="walk-in-patient-heading" className="text-sm font-semibold text-gray-900">
                1. Patient
              </h4>
              <WalkInPatientPicker orgId={orgId} value={walkInPatient} onChange={setWalkInPatient} />
            </section>

            <fieldset disabled={!walkInPatient} className="space-y-3 disabled:opacity-50">
              <legend className="text-sm font-semibold text-gray-900">2. Who requested the tests?</legend>
              <div role="radiogroup" aria-label="Request source" className="grid gap-2 sm:grid-cols-2">
                {(
                  [
                    ["referral", "Referred by a doctor", "Outside clinic or hospital"],
                    ["self", "Self-requested", "No referring doctor"],
                  ] as const
                ).map(([value, label, hint]) => (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={sourceKind === value}
                    onClick={() => setSourceKind(value)}
                    className={`rounded-md border px-3 py-2 text-left text-sm ${
                      sourceKind === value ? "border-[#007F73] bg-teal-50 text-teal-900" : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="flex items-center justify-between font-medium">
                      {label}
                      {sourceKind === value ? <Check size={14} aria-hidden="true" /> : null}
                    </span>
                    <span className="block text-xs opacity-80">{hint}</span>
                  </button>
                ))}
              </div>
              {sourceKind === "referral" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Referring doctor
                    <input
                      value={referringDoctor}
                      onChange={(event) => setReferringDoctor(event.target.value)}
                      placeholder="e.g. Dr. Ada Obi"
                      className={inputClass}
                    />
                  </label>
                  <label className="block text-sm font-medium text-gray-700">
                    Clinic / hospital <span className="font-normal text-gray-400">(optional)</span>
                    <input
                      value={referringFacility}
                      onChange={(event) => setReferringFacility(event.target.value)}
                      placeholder="e.g. Hope Clinic, Yaba"
                      className={inputClass}
                    />
                  </label>
                </div>
              ) : null}
              <label className="block text-sm font-medium text-gray-700">
                Department
                <select value={departmentId} onChange={(event) => setDepartmentId(event.target.value)} className={inputClass}>
                  <option value="">Select department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
                {departments.length === 0 ? (
                  <span className="mt-1 block text-xs font-normal text-amber-700">
                    No departments yet — an administrator needs to add one (e.g. &quot;Laboratory&quot;).
                  </span>
                ) : null}
              </label>
            </fieldset>
          </>
        ) : (
          <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Select a workspace before ordering tests.
          </p>
        )}

        {/* Tests */}
        <fieldset
          disabled={mode === "consultation" ? !selected : !walkInPatient}
          className="space-y-4 disabled:opacity-50"
        >
          <legend className="text-sm font-semibold text-gray-900">{mode === "consultation" ? "2." : "3."} Tests</legend>

          <div className="space-y-2">
            {tests.map((row, index) => (
              <div key={row.key} className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_13rem_2.5rem] sm:items-end">
                <label className="block text-sm font-medium text-gray-700">
                  <span className={index > 0 ? "sr-only" : undefined}>Test name</span>
                  <input
                    list="common-lab-tests"
                    value={row.name}
                    onChange={(event) => updateRow(row.key, { name: event.target.value })}
                    placeholder="e.g. Full Blood Count"
                    aria-label={index > 0 ? `Test ${index + 1} name` : undefined}
                    className={inputClass}
                  />
                </label>
                <label className="block text-sm font-medium text-gray-700">
                  <span className={index > 0 ? "sr-only" : undefined}>
                    Category <span className="font-normal text-gray-400">(optional)</span>
                  </span>
                  <select
                    value={row.category}
                    onChange={(event) => updateRow(row.key, { category: event.target.value })}
                    aria-label={index > 0 ? `Test ${index + 1} category` : undefined}
                    className={inputClass}
                  >
                    <option value="">Select category</option>
                    {TEST_CATEGORIES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  onClick={() => setTests((current) => (current.length > 1 ? current.filter((item) => item.key !== row.key) : [newRow()]))}
                  aria-label={`Remove test ${index + 1}`}
                  className="flex h-10 w-10 items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-600"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>
            ))}
            <datalist id="common-lab-tests">
              {Object.keys(COMMON_TESTS).map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
            <button
              type="button"
              onClick={() => setTests((current) => [...current, newRow()])}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-[#007F73] hover:bg-teal-50"
            >
              <Plus size={15} aria-hidden="true" /> Add another test
            </button>
          </div>

          {repeatedInForm ? (
            <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              The same test is listed twice.
            </p>
          ) : openDuplicates.length ? (
            <p role="alert" className="flex items-start gap-2 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
              Already ordered on this consultation and not yet completed: {openDuplicates.join(", ")}.
            </p>
          ) : existingTests.length > 0 ? (
            <p className="text-xs text-gray-500">
              Already on this consultation: {existingTests.map((test) => test.test_name).join(", ")}
            </p>
          ) : null}

          <div role="radiogroup" aria-label="Priority">
            <p className="text-sm font-medium text-gray-700">Priority</p>
            <div className="mt-1 grid gap-2 sm:grid-cols-3">
              {LAB_TEST_PRIORITIES.map((option) => {
                const active = priority === option;
                const tone =
                  option === "Emergency"
                    ? "border-red-500 bg-red-50 text-red-800"
                    : option === "Urgent"
                      ? "border-amber-500 bg-amber-50 text-amber-800"
                      : "border-[#007F73] bg-teal-50 text-teal-900";
                return (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setPriority(option)}
                    className={`rounded-md border px-3 py-2 text-left text-sm ${
                      active ? tone : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="flex items-center justify-between font-medium">
                      {option}
                      {active ? <Check size={14} aria-hidden="true" /> : null}
                    </span>
                    <span className="block text-xs opacity-80">{PRIORITY_HINTS[option]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <label className="block text-sm font-medium text-gray-700">
            Clinical notes <span className="font-normal text-gray-400">(optional)</span>
            <textarea
              value={clinicalNotes}
              onChange={(event) => setClinicalNotes(event.target.value)}
              placeholder="Symptoms, fasting status, relevant history…"
              className="mt-1 min-h-20 w-full rounded-md border border-gray-300 p-3 text-sm font-normal outline-none focus:border-[#007F73] focus:ring-2 focus:ring-[#007F73]/20"
            />
            <span className="mt-1 block text-xs font-normal text-gray-500">
              Saved as a note on the consultation, visible to the care team.
            </span>
          </label>
        </fieldset>

        <div className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
          <button type="button" onClick={close} className="min-h-10 rounded-md border border-gray-300 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button
            type="button"
            disabled={!readyToOrder || saving}
            onClick={() => void create()}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[#007F73] px-4 text-sm font-semibold text-white hover:bg-[#006E64] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
            {submitLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
