"use client";

export type LabOrderStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "unknown";

export type LabOrder = {
  id: string;
  patientName: string;
  patientId: string;
  patientGender: string;
  patientAge: string;
  testType: string;
  orderedTests: string[];
  orderingDoctor: string;
  orderedAt: string | null;
  priority: string;
  status: LabOrderStatus;
  clinicalNotes: string;
  departmentName: string;
  sampleType: string;
};

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
  const normalized = asString(value).toLowerCase().replace(/\s+/g, "_");
  if (normalized === "pending") return "pending";
  if (normalized === "in_progress") return "in_progress";
  if (normalized === "completed") return "completed";
  if (normalized === "cancelled") return "cancelled";
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

  const patientFirstName = firstNonEmpty(patient, ["first_name", "firstname", "given_name"]);
  const patientLastName = firstNonEmpty(patient, ["last_name", "lastname", "family_name"]);
  const patientNameFromObject = `${patientFirstName} ${patientLastName}`.trim();
  const patientName = patientNameFromObject || firstNonEmpty(raw, ["patient_name"]) || "Unknown Patient";

  const doctorFirstName = firstNonEmpty(doctor, ["first_name", "firstname", "given_name"]);
  const doctorLastName = firstNonEmpty(doctor, ["last_name", "lastname", "family_name"]);
  const doctorNameFromObject = `${doctorFirstName} ${doctorLastName}`.trim();
  const orderingDoctor =
    doctorNameFromObject ||
    firstNonEmpty(raw, ["ordering_doctor_name", "doctor_name", "ordered_by"]) ||
    "Unknown Doctor";

  const testType =
    firstNonEmpty(raw, ["test_type", "test_name", "order_type", "title"]) ||
    "Test";

  const orderedTests = normalizeTestList(raw, testType);
  const rawId = firstNonEmpty(raw, ["id", "order_id", "lab_order_id"]);
  const orderedAt =
    firstNonEmpty(raw, ["ordered_at", "created_at", "order_date", "requested_at"]) ||
    null;
  const generatedId = [patientName, testType, orderedAt].filter(Boolean).join("-");

  return {
    id: rawId || generatedId || "unknown-order",
    patientName,
    patientId:
      firstNonEmpty(patient, ["id", "patient_id"]) ||
      firstNonEmpty(raw, ["patient_id"]) ||
      "-",
    patientGender:
      firstNonEmpty(patient, ["gender", "sex"]) ||
      firstNonEmpty(raw, ["patient_gender"]) ||
      "-",
    patientAge:
      firstNonEmpty(patient, ["age"]) ||
      firstNonEmpty(raw, ["patient_age"]) ||
      "-",
    testType,
    orderedTests,
    orderingDoctor,
    orderedAt,
    priority: firstNonEmpty(raw, ["priority", "urgency"]) || "-",
    status: parseStatus(raw.status || raw.current_status),
    clinicalNotes:
      firstNonEmpty(raw, ["clinical_notes", "doctor_note", "notes"]) || "No clinical notes provided.",
    departmentName:
      firstNonEmpty(department, ["name"]) ||
      firstNonEmpty(raw, ["department_name"]) ||
      "-",
    sampleType: firstNonEmpty(raw, ["sample_type", "sample"]) || "-",
  };
};

export const normalizeLabOrders = (payload: unknown): LabOrder[] => {
  if (Array.isArray(payload)) {
    return payload.map(mapLabOrder);
  }

  const root = asObject(payload);
  const collections = [
    root.items,
    root.results,
    root.orders,
    root.lab_orders,
    root.data,
  ];

  for (const collection of collections) {
    if (Array.isArray(collection)) {
      return collection.map(mapLabOrder);
    }
  }

  if (Object.keys(root).length > 0) {
    return [mapLabOrder(root)];
  }

  return [];
};

export const combineUniqueOrders = (orders: LabOrder[]): LabOrder[] => {
  const byId = new Map<string, LabOrder>();
  for (const order of orders) {
    byId.set(order.id, order);
  }

  return Array.from(byId.values()).sort((a, b) => {
    const aTime = a.orderedAt ? new Date(a.orderedAt).getTime() : 0;
    const bTime = b.orderedAt ? new Date(b.orderedAt).getTime() : 0;
    return bTime - aTime;
  });
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

const MOCK_LAB_ORDERS: LabOrder[] = [
  {
    id: "PT0025",
    patientName: "James Carter",
    patientId: "PT0025",
    patientGender: "Male",
    patientAge: "46",
    testType: "Lipid Profile",
    orderedTests: ["Lipid Profile", "HDL", "LDL", "Triglycerides"],
    orderingDoctor: "Dr. Wilson Francis",
    orderedAt: "2026-02-22T10:20:00.000Z",
    priority: "Routine",
    status: "completed",
    clinicalNotes:
      "Review lipid abnormalities and assess cardiovascular risk profile.",
    departmentName: "Cardiology",
    sampleType: "Blood Sample",
  },
  {
    id: "PT0024",
    patientName: "Emily Davis",
    patientId: "PT0024",
    patientGender: "Female",
    patientAge: "33",
    testType: "MP Widal Test",
    orderedTests: ["Malaria Parasite", "Widal Test"],
    orderingDoctor: "Dr. Adeyemi",
    orderedAt: "2026-02-24T14:35:00.000Z",
    priority: "Urgent",
    status: "in_progress",
    clinicalNotes:
      "Persistent fever and fatigue for 4 days. Rule out malaria and typhoid.",
    departmentName: "General Medicine",
    sampleType: "Blood Sample",
  },
  {
    id: "PT0023",
    patientName: "Michael Johnson",
    patientId: "PT0023",
    patientGender: "Male",
    patientAge: "54",
    testType: "Blood Culture",
    orderedTests: ["Blood Culture", "Sensitivity"],
    orderingDoctor: "Dr. Ifeoma",
    orderedAt: "2026-02-25T09:10:00.000Z",
    priority: "Routine",
    status: "completed",
    clinicalNotes: "Recurring chills and suspected bloodstream infection.",
    departmentName: "Internal Medicine",
    sampleType: "Blood Sample",
  },
  {
    id: "PT0022",
    patientName: "Olivia Miller",
    patientId: "PT0022",
    patientGender: "Female",
    patientAge: "28",
    testType: "Semen Culture",
    orderedTests: ["Semen Culture", "Microscopy"],
    orderingDoctor: "Dr. Nnadi",
    orderedAt: "2026-02-12T11:40:00.000Z",
    priority: "Urgent",
    status: "in_progress",
    clinicalNotes: "Assess infection markers before fertility treatment cycle.",
    departmentName: "Fertility Unit",
    sampleType: "Semen Sample",
  },
  {
    id: "PT0021",
    patientName: "David Smith",
    patientId: "PT0021",
    patientGender: "Male",
    patientAge: "41",
    testType: "Urine Analysis",
    orderedTests: ["Urinalysis", "Urine Microscopy"],
    orderingDoctor: "Dr. Tolu",
    orderedAt: "2026-02-15T08:55:00.000Z",
    priority: "Routine",
    status: "pending",
    clinicalNotes: "Frequent urination and burning sensation reported.",
    departmentName: "Urology",
    sampleType: "Urine Sample",
  },
  {
    id: "PT0020",
    patientName: "Sophia Wilson",
    patientId: "PT0020",
    patientGender: "Female",
    patientAge: "37",
    testType: "Genotype Blood Group",
    orderedTests: ["Genotype", "Blood Group"],
    orderingDoctor: "Dr. Uche",
    orderedAt: "2026-02-18T10:25:00.000Z",
    priority: "Pending",
    status: "in_progress",
    clinicalNotes: "Pre-op lab request for genotype and blood group confirmation.",
    departmentName: "Surgery",
    sampleType: "Blood Sample",
  },
  {
    id: "PT0019",
    patientName: "Daniel Williams",
    patientId: "PT0019",
    patientGender: "Male",
    patientAge: "50",
    testType: "FBC",
    orderedTests: ["Full Blood Count"],
    orderingDoctor: "Dr. Mary Johnson",
    orderedAt: "2026-02-25T16:15:00.000Z",
    priority: "Emergency",
    status: "pending",
    clinicalNotes: "Critical fatigue and dizziness; urgent hematology profile needed.",
    departmentName: "Emergency",
    sampleType: "Blood Sample",
  },
  {
    id: "PT0018",
    patientName: "Isabella Anderson",
    patientId: "PT0018",
    patientGender: "Female",
    patientAge: "29",
    testType: "Hormonal Profile",
    orderedTests: ["FSH", "LH", "Prolactin", "TSH"],
    orderingDoctor: "Dr. Amina",
    orderedAt: "2026-02-28T12:05:00.000Z",
    priority: "Routine",
    status: "completed",
    clinicalNotes: "Cycle irregularities and fertility evaluation request.",
    departmentName: "Endocrinology",
    sampleType: "Blood Sample",
  },
];

export const getMockLabOrders = (): LabOrder[] =>
  combineUniqueOrders(MOCK_LAB_ORDERS);

export const getMockLabOrdersByStatus = (
  statuses: LabOrderStatus[]
): LabOrder[] => getMockLabOrders().filter((order) => statuses.includes(order.status));

export const getMockLabOrderById = (id: string): LabOrder | null =>
  getMockLabOrders().find((order) => order.id === id) ?? null;
