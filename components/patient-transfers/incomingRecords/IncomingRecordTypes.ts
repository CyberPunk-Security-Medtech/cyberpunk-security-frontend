export type IncomingRecordStatus = "Pending" | "Accepted" | "Rejected";

export type IncomingRecordVitals = {
  bloodPressure?: string;
  temperature?: string;
  heartRate?: string;
  weight?: string;
  sugarLevel?: string;
  raw?: string;
};

export type IncomingRecordSharedContent = {
  biodata?: Record<string, unknown> | null;
  medicalHistory?: Record<string, unknown> | null;
  diagnoses?: Record<string, unknown>[];
  consultation?: Record<string, unknown> | null;
  labResults?: Record<string, unknown>[];
  prescriptions?: Record<string, unknown>[];
};

export type IncomingRecord = {
  id: string;
  initials: string;
  patientName: string;
  gpid: string;
  priority: "Urgent" | "Normal";
  condition: string;
  fromHospital: string;
  requestedAt: string;
  records: string[];
  fileSize: string;
  status: IncomingRecordStatus;
  age: number | string;
  gender: string;
  bloodGroup: string;
  genotype: string;
  patientEmail?: string;
  patientPhone?: string;
  sourceHospitalName?: string;
  clinicalSummary?: string | null;
  vitals?: IncomingRecordVitals;
  sharedContent?: IncomingRecordSharedContent;
};
