// "use client";

// export type LabOrderStatus =
//   | "pending"
//   | "in_progress"
//   | "completed"
//   | "cancelled"
//   | "unknown";

// export type LabOrder = {
//   id: string;
//   consultation_id: string | null;
//   patientName: string;
//   patientId: string;
//   patientGender: string;
//   patientAge: string;
//   test_type: string;
//   test_name: string;
//   orderedTests: string[];
//   orderingDoctor: string;
//   orderedAt: string | null;
//   priority: string;
//   status: LabOrderStatus;
//   clinicalNotes: string;
//   departmentName: string;
//   sampleType: string;
// };

// export const isNotFoundApiError = (error: unknown): boolean => {
//   const status = (error as { response?: { status?: number } })?.response?.status;
//   return status === 404;
// };

// const asObject = (value: unknown): Record<string, unknown> =>
//   value && typeof value === "object" ? (value as Record<string, unknown>) : {};

// const asString = (value: unknown): string => {
//   if (typeof value === "string") return value.trim();
//   if (typeof value === "number") return String(value);
//   return "";
// };

// const firstNonEmpty = (
//   source: Record<string, unknown>,
//   keys: string[]
// ): string => {
//   for (const key of keys) {
//     const value = asString(source[key]);
//     if (value) return value;
//   }
//   return "";
// };

// const parseStatus = (value: unknown): LabOrderStatus => {
//   const normalized = asString(value).toLowerCase();

//   if (normalized.includes("pending")) return "pending";
//   if (normalized.includes("progress")) return "in_progress";
//   if (normalized.includes("complete")) return "completed";
//   if (normalized.includes("cancel")) return "cancelled";

//   return "unknown";
// };

// const normalizeTestList = (
//   raw: Record<string, unknown>,
//   fallbackTestType: string
// ): string[] => {
//   const candidates = [raw.ordered_tests, raw.tests, raw.test_items];

//   for (const candidate of candidates) {
//     if (!Array.isArray(candidate)) continue;

//     const testNames = candidate
//       .map((entry) => {
//         if (typeof entry === "string") return entry.trim();
//         const item = asObject(entry);
//         return firstNonEmpty(item, [
//           "test_name",
//           "name",
//           "test",
//           "test_type",
//           "label",
//         ]);
//       })
//       .filter(Boolean);

//     if (testNames.length > 0) return testNames;
//   }

//   return fallbackTestType ? [fallbackTestType] : [];
// };

// export const mapLabOrder = (value: unknown): LabOrder => {
//   const raw = asObject(value);

//   const patient = asObject(raw.patient || raw.patient_info || raw.patient_details);
//   const doctor = asObject(raw.doctor || raw.ordering_doctor || raw.requested_by);
//   const department = asObject(raw.department);

//   const patientFirstName = firstNonEmpty(patient, [
//     "first_name",
//     "firstname",
//     "given_name",
//   ]);
//   const patientLastName = firstNonEmpty(patient, [
//     "last_name",
//     "lastname",
//     "family_name",
//   ]);
//   const patientNameFromObject = `${patientFirstName} ${patientLastName}`.trim();

//   const patientName =
//     patientNameFromObject ||
//     firstNonEmpty(raw, ["patient_name"]) ||
//     "Unknown Patient";

//   const doctorFirstName = firstNonEmpty(doctor, [
//     "first_name",
//     "firstname",
//     "given_name",
//   ]);
//   const doctorLastName = firstNonEmpty(doctor, [
//     "last_name",
//     "lastname",
//     "family_name",
//   ]);
//   const doctorNameFromObject = `${doctorFirstName} ${doctorLastName}`.trim();

//   const orderingDoctor =
//     doctorNameFromObject ||
//     firstNonEmpty(raw, ["ordering_doctor_name", "doctor_name", "ordered_by"]) ||
//     "Unknown Doctor";

//   const testType =
//     firstNonEmpty(raw, [
//       "lab_test_type",
//       "test_type",
//       "test_name",
//       "name",
//     ]) || "Unknown Test";

//   const orderedTests = normalizeTestList(raw, testType);
//   const rawId = firstNonEmpty(raw, ["id", "order_id", "lab_order_id"]);
//   const orderedAt =
//     firstNonEmpty(raw, [
//       "ordered_at",
//       "created_at",
//       "order_date",
//       "requested_at",
//     ]) || null;

//   const generatedId = [patientName, testType, orderedAt].filter(Boolean).join("-");

//   return {
//     id: rawId || generatedId || "unknown-order",
//     consultation_id:
//       firstNonEmpty(raw, ["consultation_id"]) || null,
//     patientName,
//     patientId:
//       firstNonEmpty(patient, ["id", "patient_id"]) ||
//       firstNonEmpty(raw, ["patient_id"]) ||
//       "",
//     patientGender:
//       firstNonEmpty(patient, ["gender", "sex"]) ||
//       firstNonEmpty(raw, ["patient_gender"]) ||
//       "-",
//     patientAge:
//       firstNonEmpty(patient, ["age"]) ||
//       firstNonEmpty(raw, ["patient_age"]) ||
//       "-",
//     test_type:
//       firstNonEmpty(raw, ["test_type", "lab_test_type", "test_name", "name"]) ||
//       "Unknown Test",
//     test_name:
//       firstNonEmpty(raw, ["test_name", "name", "test_type", "lab_test_type"]) ||
//       "Unknown Test",
//     orderedTests,
//     orderingDoctor,
//     orderedAt,
//     priority: firstNonEmpty(raw, ["priority", "urgency"]) || "Routine",
//     status: parseStatus(raw.status || raw.current_status),
//     clinicalNotes:
//       firstNonEmpty(raw, ["clinical_notes", "doctor_note", "notes"]) ||
//       "No clinical notes provided.",
//     departmentName:
//       firstNonEmpty(department, ["name"]) ||
//       firstNonEmpty(raw, ["department_name"]) ||
//       "-",
//     sampleType: firstNonEmpty(raw, ["sample_type", "sample"]) || "-",
//   };
// };



// export const toReadableStatus = (status: LabOrderStatus): string => {
//   if (status === "in_progress") return "In Progress";
//   if (status === "completed") return "Completed";
//   if (status === "cancelled") return "Cancelled";
//   if (status === "pending") return "Pending";
//   return "Unknown";
// };

// export const toStatusBadgeType = (
//   status: LabOrderStatus
// ): "Pending" | "In Progress" | "Completed" => {
//   if (status === "in_progress") return "In Progress";
//   if (status === "completed") return "Completed";
//   return "Pending";
// };

// export const formatDateTime = (value: string | null): string => {
//   if (!value) return "-";
//   const date = new Date(value);
//   if (Number.isNaN(date.getTime())) return "-";
//   return date.toLocaleString();
// };



"use client";

export type LabOrderStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "unknown";

export type LabOrder = {
  id: string;
  consultation_id: string | null;
  patientName: string;
  patientId: string;
  patientGender: string;
  patientAge: string;
  test_type: string;
  test_name: string;
  orderedTests: string[];
  orderingDoctor: string;
  orderedAt: string | null;
  priority: string;
  status: LabOrderStatus;
  clinicalNotes: string;
  departmentName: string;
  sampleType: string;
};

export interface RawPatient {
  id: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  name?: string;
  patient_id?: string;
  age?: string | number;
  gender?: string;
  dob?: string;
}

export interface RawDoctor {
  first_name?: string;
  last_name?: string;
  full_name?: string;
  name?: string;
}

export interface RawConsultation {
  id: string;
  patient_id?: string;
  doctor_id?: string | null;
  patient?: RawPatient;
  patient_name?: string;
  patient_age?: string;
  patient_gender?: string;
  patient_first_name?: string;
  gender?: string;
  age?: string;
  patient_last_name?: string;
  doctor?: RawDoctor;
  assigned_doctor?: RawDoctor;
  doctor_name?: string;
  ordering_doctor_name?: string;
  doctor_first_name?: string;
  doctor_last_name?: string;
  assigned_doctor_name?: string;
  department_name?: string;
  department?: { name?: string };
  reason_for_visit?: string;
  clinical_notes?: string;
}

export interface Attachment {
  id: string;
  url: string;
  mimetype?: string;
  original_filename?: string;
}

export const statusFilters: LabOrderStatus[] = ["pending", "in_progress"];

export const isNotFoundApiError = (error: unknown): boolean => {
  const status = (error as { response?: { status?: number } })?.response?.status;
  return status === 404;
};

const asObject = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};

const asString = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
};

const firstNonEmpty = (
  source: Record<string, unknown>,
  keys: string[]
): string => {
  for (const key of keys) {
    const value = asString(source[key]);
    if (value) return value;
  }
  return "";
};

const parseStatus = (value: unknown): LabOrderStatus => {
  const normalized = asString(value).toLowerCase();

  if (normalized.includes("pending")) return "pending";
  if (normalized.includes("progress")) return "in_progress";
  if (normalized.includes("complete")) return "completed";
  if (normalized.includes("cancel")) return "cancelled";

  return "unknown";
};

const normalizeTestList = (
  raw: Record<string, unknown>,
  fallbackTestType: string
): string[] => {
  const candidates = [raw.ordered_tests, raw.tests, raw.test_items];

  for (const candidate of candidates) {
    if (!Array.isArray(candidate)) continue;

    const testNames = candidate
      .map((entry) => {
        if (typeof entry === "string") return entry.trim();
        const item = asObject(entry);
        return firstNonEmpty(item, [
          "test_name",
          "name",
          "test",
          "test_type",
          "label",
        ]);
      })
      .filter(Boolean);

    if (testNames.length > 0) return testNames;
  }

  return fallbackTestType ? [fallbackTestType] : [];
};

export const mapLabOrder = (value: unknown): LabOrder => {
  const raw = asObject(value);

  const patient = asObject(raw.patient || raw.patient_info || raw.patient_details);
  const doctor = asObject(raw.doctor || raw.ordering_doctor || raw.requested_by);
  const department = asObject(raw.department);

  const patientFirstName = firstNonEmpty(patient, [
    "first_name",
    "firstname",
    "given_name",
  ]);
  const patientLastName = firstNonEmpty(patient, [
    "last_name",
    "lastname",
    "family_name",
  ]);
  const patientNameFromObject = `${patientFirstName} ${patientLastName}`.trim();

  const patientName =
    patientNameFromObject ||
    firstNonEmpty(raw, ["patient_name"]) ||
    "Unknown Patient";

  const doctorFirstName = firstNonEmpty(doctor, [
    "first_name",
    "firstname",
    "given_name",
  ]);
  const doctorLastName = firstNonEmpty(doctor, [
    "last_name",
    "lastname",
    "family_name",
  ]);
  const doctorNameFromObject = `${doctorFirstName} ${doctorLastName}`.trim();

  const orderingDoctor =
    doctorNameFromObject ||
    firstNonEmpty(raw, ["ordering_doctor_name", "doctor_name", "ordered_by"]) ||
    "Unknown Doctor";

  const testType =
    firstNonEmpty(raw, [
      "lab_test_type",
      "test_type",
      "test_name",
      "name",
    ]) || "Unknown Test";

  const orderedTests = normalizeTestList(raw, testType);
  const rawId = firstNonEmpty(raw, ["id", "order_id", "lab_order_id"]);
  const orderedAt =
    firstNonEmpty(raw, [
      "ordered_at",
      "created_at",
      "order_date",
      "requested_at",
    ]) || null;

  const generatedId = [patientName, testType, orderedAt].filter(Boolean).join("-");

  return {
    id: rawId || generatedId || "unknown-order",
    consultation_id:
      firstNonEmpty(raw, ["consultation_id"]) || null,
    patientName,
    patientId:
      firstNonEmpty(patient, ["id", "patient_id"]) ||
      firstNonEmpty(raw, ["patient_id"]) ||
      "",
    patientGender:
      firstNonEmpty(patient, ["gender", "sex"]) ||
      firstNonEmpty(raw, ["patient_gender"]) ||
      "-",
    patientAge:
      firstNonEmpty(patient, ["age"]) ||
      firstNonEmpty(raw, ["patient_age"]) ||
      "-",
    test_type:
      firstNonEmpty(raw, ["test_type", "lab_test_type", "test_name", "name"]) ||
      "Unknown Test",
    test_name:
      firstNonEmpty(raw, ["test_name", "name", "test_type", "lab_test_type"]) ||
      "Unknown Test",
    orderedTests,
    orderingDoctor,
    orderedAt,
    priority: firstNonEmpty(raw, ["priority", "urgency"]) || "Routine",
    status: parseStatus(raw.status || raw.current_status),
    clinicalNotes:
      firstNonEmpty(raw, ["clinical_notes", "doctor_note", "notes"]) ||
      "No clinical notes provided.",
    departmentName:
      firstNonEmpty(department, ["name"]) ||
      firstNonEmpty(raw, ["department_name"]) ||
      "-",
    sampleType: firstNonEmpty(raw, ["sample_type", "sample"]) || "-",
  };
};

/**
 * Maps an array of raw API lab-test records into normalized LabOrder objects.
 * Was previously imported by several pages but never defined here, which
 * broke the build for every consumer.
 */
export const normalizeLabOrders = (rawOrders: unknown[]): LabOrder[] => {
  if (!Array.isArray(rawOrders)) return [];
  return rawOrders.map((raw) => mapLabOrder(raw));
};

/**
 * Merges one or more arrays of LabOrder into a single list with unique ids.
 * The first occurrence of a given id wins, so callers that want a freshly
 * created/updated order to take priority should place it first in the input.
 */
export const combineUniqueOrders = (orders: LabOrder[]): LabOrder[] => {
  const seen = new Map<string, LabOrder>();

  for (const order of orders) {
    if (!seen.has(order.id)) {
      seen.set(order.id, order);
    }
  }

  return Array.from(seen.values());
};

export const toReadableStatus = (status: LabOrderStatus): string => {
  if (status === "in_progress") return "In Progress";
  if (status === "completed") return "Completed";
  if (status === "cancelled") return "Cancelled";
  if (status === "pending") return "Pending";
  return "Unknown";
};

export const toStatusBadgeType = (
  status: LabOrderStatus
): "Pending" | "In Progress" | "Completed" => {
  if (status === "in_progress") return "In Progress";
  if (status === "completed") return "Completed";
  return "Pending";
};

export const formatDateTime = (value: string | null): string => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

export const mapStatusToApi = (
  status: LabOrderStatus
): "Pending" | "In Progress" | "Completed" => {
  switch (status) {
    case "pending":
      return "Pending";
    case "in_progress":
      return "In Progress";
    case "completed":
      return "Completed";
    default:
      return "Pending";
  }
};

export function getConsultationsArray(response: any): RawConsultation[] {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.consultations)) return response.consultations;
  if (Array.isArray(response?.results)) return response.results;
  return [];
}

export function buildPatientName(consultation: RawConsultation, fallback = "") {
  return (
    consultation?.patient_name ||
    consultation?.patient?.full_name ||
    consultation?.patient?.name ||
    `${consultation?.patient?.first_name ?? ""} ${
      consultation?.patient?.last_name ?? ""
    }`.trim() ||
    `${consultation?.patient_first_name ?? ""} ${
      consultation?.patient_last_name ?? ""
    }`.trim() ||
    fallback ||
    "Unknown Patient"
  );
}

export function getPatientId(consultation: RawConsultation, fallback = "") {
  return (
    consultation?.patient_id ||
    consultation?.patient?.id ||
    consultation?.patient?.patient_id ||
    fallback ||
    ""
  );
}

export function buildDoctorName(consultation: RawConsultation, fallback = "") {
  return (
    consultation?.ordering_doctor_name ||
    consultation?.doctor_name ||
    consultation?.doctor?.full_name ||
    consultation?.doctor?.name ||
    `${consultation?.doctor?.first_name ?? ""} ${
      consultation?.doctor?.last_name ?? ""
    }`.trim() ||
    `${consultation?.doctor_first_name ?? ""} ${
      consultation?.doctor_last_name ?? ""
    }`.trim() ||
    `${consultation?.assigned_doctor?.first_name ?? ""} ${
      consultation?.assigned_doctor?.last_name ?? ""
    }`.trim() ||
    consultation?.assigned_doctor_name ||
    fallback ||
    "Unknown"
  );
}
