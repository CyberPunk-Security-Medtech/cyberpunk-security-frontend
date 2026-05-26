export type ConsentStatus = "Granted" | "Declined";

export type Patient = {
  id: string;
  initials: string;
  name: string;
  gpid: string;
  status: ConsentStatus;
  lastVisit: string;
  condition: string;
  age: number;
  gender: string;
  bloodType: string;
};

export type PatientTab = "Overview" | "History" | "Labs" | "Medications";

export type FilterType = "All" | "Declined" | "Granted";

export type TransferMode = "specific" | "nearby" | null;

export type EMRType = "PrivaCure" | "Others" | null;