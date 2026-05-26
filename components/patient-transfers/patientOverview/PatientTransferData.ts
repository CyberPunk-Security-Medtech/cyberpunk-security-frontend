import { FlaskConical, Pill, Stethoscope } from "lucide-react";
import { Patient } from "./PatientTransferTypes";


export const patients: Patient[] = [
  {
    id: "1",
    initials: "BH",
    name: "Brandon Herwitz",
    gpid: "GP234567",
    status: "Granted",
    lastVisit: "Apr 4, 2026",
    condition: "Hypertension",
    age: 53,
    gender: "Male",
    bloodType: "O+",
  },
  {
    id: "2",
    initials: "BH",
    name: "Brandon Herwitz",
    gpid: "GP234567",
    status: "Granted",
    lastVisit: "Apr 4, 2026",
    condition: "Hypertension",
    age: 53,
    gender: "Male",
    bloodType: "O+",
  },
  {
    id: "3",
    initials: "BH",
    name: "Brandon Herwitz",
    gpid: "GP234567",
    status: "Declined",
    lastVisit: "Apr 4, 2026",
    condition: "Hypertension",
    age: 53,
    gender: "Male",
    bloodType: "O+",
  },
  {
    id: "4",
    initials: "BH",
    name: "Brandon Herwitz",
    gpid: "GP234567",
    status: "Granted",
    lastVisit: "Apr 4, 2026",
    condition: "Hypertension",
    age: 53,
    gender: "Male",
    bloodType: "O+",
  },
];

export const timelineItems = [
  {
    title: "Lab Result Uploaded",
    description: "Complete Blood Count (CBC) - All values within normal range",
    hospital: "Central Hospital",
    date: "Jan 20, 2026",
    icon: FlaskConical,
    color: "bg-[#008774]",
  },
  {
    title: "Diagnosis: Hypertension",
    description: "Stage 1 hypertension diagnosed. Started on medication",
    hospital: "UITH",
    date: "Jan 5, 2026",
    icon: Stethoscope,
    color: "bg-[#201488]",
  },
  {
    title: "Medication Prescribed",
    description: "Lisinopril 10mg - Once daily",
    hospital: "Family Health Clinic",
    date: "Dec 15, 2025",
    icon: Pill,
    color: "bg-orange-600",
  },
];

export const historyItems = [
  {
    title: "Hypertension, High Cholesterol",
    description: "Patient complains of headaches...",
    doctor: "Wilson Francis",
    role: "General Doctor",
    date: "10 Oct 2025",
    status: "Active",
  },
  {
    title: "Hypertension, High Cholesterol",
    description: "Patient complains of headaches...",
    doctor: "Wilson Francis",
    role: "General Doctor",
    date: "10 Oct 2025",
    status: "Resolved",
  },
  {
    title: "Hypertension, High Cholesterol",
    description: "Patient complains of headaches...",
    doctor: "Wilson Francis",
    role: "General Doctor",
    date: "10 Oct 2025",
    status: "Resolved",
  },
];

export const labResults = [
  { parameter: "Total Cholesterol", result: "210", unit: "Oct-30-2025", range: "< 200", status: "Good" },
  { parameter: "LDL Cholesterol", result: "210", unit: "Oct-30-2025", range: "< 100", status: "Bad" },
  { parameter: "HDL Cholesterol", result: "210", unit: "Oct-30-2025", range: "< 200", status: "Good" },
  { parameter: "Triglycerides", result: "210", unit: "Oct-30-2025", range: "< 200", status: "Good" },
  { parameter: "VLDL Cholesterol", result: "210", unit: "Oct-30-2025", range: "< 200", status: "Fair" },
  { parameter: "Reyan Verol", result: "210", unit: "Oct-30-2025", range: "5-40", status: "Fair" },
  { parameter: "Reyan Verol", result: "210", unit: "Oct-30-2025", range: "< 200", status: "Good" },
];

export const medications = [
  {
    medication: "Amoxicillin 500mg",
    dosage: "500mg, 3 times daily",
    qty: "21",
    prescribedBy: "Dr. Bimpe Olorunsogo",
    dateTime: "Mar 28, 2026, 08:30 AM",
    status: "Ongoing",
  },
  {
    medication: "Amoxicillin 500mg",
    dosage: "500mg, 3 times daily",
    qty: "21",
    prescribedBy: "Dr. Bimpe Olorunsogo",
    dateTime: "Mar 28, 2026, 08:30 AM",
    status: "Ongoing",
  },
  {
    medication: "Amoxicillin 500mg",
    dosage: "500mg, 3 times daily",
    qty: "21",
    prescribedBy: "Dr. Bimpe Olorunsogo",
    dateTime: "Mar 28, 2026, 08:30 AM",
    status: "Completed",
  },
];