export type RecordStaffPatientRow = {
  id: string;
  initials: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  ward: string;
  condition: string;
  status: string;
  createdAt: string;
};

type ApiPatient = {
  id?: string;
  first_name?: string;
  last_name?: string;
  dob?: string;
  date_of_birth?: string;
  age?: string | number;
  gender?: string;
  department?: string;
  ward?: string;
  symptoms?: string;
  status?: string;
  created_at?: string;
};

export const formatPatientDate = (dateValue?: string) => {
  if (!dateValue) return "Not recorded";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export const mapRecordStaffPatient = (
  patient: ApiPatient,
): RecordStaffPatientRow => {
  const firstName = patient.first_name ?? "";
  const lastName = patient.last_name ?? "";
  const name = `${firstName} ${lastName}`.trim() || "Unknown Patient";

  return {
    id: patient.id ?? "",
    initials: `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase(),
    name,
    dateOfBirth: formatPatientDate(patient.dob ?? patient.date_of_birth),
    gender: patient.gender || "-",
    ward: patient.department || patient.ward || "Awaiting nurse review",
    condition: patient.symptoms || "Not recorded",
    status: patient.status || "Newly Onboarded",
    createdAt: patient.created_at || "",
  };
};

export const statusClassName = (status: string) => {
  if (status === "Outpatient") return "bg-emerald-50 text-emerald-700";
  if (status === "Pending Discharge") return "bg-orange-50 text-orange-700";
  if (status === "Newly Onboarded") return "bg-teal-50 text-teal-700";
  return "bg-blue-50 text-blue-700";
};

export const wasCreatedToday = (dateValue: string) => {
  if (!dateValue) return false;

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return false;

  const today = new Date();
  return date.toDateString() === today.toDateString();
};
