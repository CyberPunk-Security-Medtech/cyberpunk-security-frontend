"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ChevronLeft,
  Droplet,
  FlaskConical,
  HeartPulse,
  MoreHorizontal,
  MoreVertical,
  Plus,
  PencilLine,
  Scale,
  Thermometer,
} from "lucide-react";
import { StatusBadge } from "@components/StatusBadge";

type PatientStatus = "Active" | "Discharged" | "Pending";

type Patient = {
  initials: string;
  name: string;
  id: string;
  age: number;
  gender: string;
  condition: string;
  status: PatientStatus;
  date: string;
};

const patients: Patient[] = [
  {
    initials: "BH",
    name: "Brandon Herwitz",
    id: "SMC-04000B",
    age: 32,
    gender: "Male",
    condition: "Diabetes Type 2",
    status: "Active",
    date: "Oct-30-2025",
  },
  {
    initials: "BH",
    name: "Brandon Herwitz",
    id: "SMC-04000B",
    age: 56,
    gender: "Female",
    condition: "Hypertension",
    status: "Discharged",
    date: "Oct-30-2025",
  },
  {
    initials: "BH",
    name: "Brandon Herwitz",
    id: "SMC-04000B",
    age: 32,
    gender: "Female",
    condition: "Tuberculosis (TB)",
    status: "Pending",
    date: "Oct-30-2025",
  },
  {
    initials: "BH",
    name: "Brandon Herwitz",
    id: "SMC-04000B",
    age: 56,
    gender: "Female",
    condition: "Hepatitis",
    status: "Active",
    date: "Oct-30-2025",
  },
  {
    initials: "BH",
    name: "Brandon Herwitz",
    id: "SMC-04000B",
    age: 56,
    gender: "Male",
    condition: "Dehydration",
    status: "Active",
    date: "Oct-30-2025",
  },
  {
    initials: "BH",
    name: "Brandon Herwitz",
    id: "SMC-04000B",
    age: 56,
    gender: "Male",
    condition: "Dehydration",
    status: "Active",
    date: "Oct-30-2025",
  },
  {
    initials: "BH",
    name: "Brandon Herwitz",
    id: "SMC-04000B",
    age: 56,
    gender: "Male",
    condition: "Dehydration",
    status: "Active",
    date: "Oct-30-2025",
  },
  {
    initials: "BH",
    name: "Brandon Herwitz",
    id: "SMC-04000B",
    age: 56,
    gender: "Male",
    condition: "Dehydration",
    status: "Active",
    date: "Oct-30-2025",
  },
  {
    initials: "BH",
    name: "Brandon Herwitz",
    id: "SMC-04000B",
    age: 56,
    gender: "Male",
    condition: "Infertility",
    status: "Discharged",
    date: "Oct-30-2025",
  },
];

const statusClassMap: Record<PatientStatus, string> = {
  Active: "bg-[#E0F2F1] text-[#00B8A8]",
  Discharged: "bg-[#EDE7F6] text-[#673AB7]",
  Pending: "bg-[#FFF8E1] text-[#FFA000]",
};

const getStatusClass = (status: string) =>
  statusClassMap[status] ?? "bg-gray-100 text-gray-600";

type VitalStatus = "Normal" | "High" | "Low";

type Vital = {
  label: string;
  value: string;
  unit: string;
  status: VitalStatus;
  icon: typeof Activity;
  iconBg: string;
  iconColor: string;
};

const vitals: Vital[] = [
  {
    label: "Blood Pressure",
    value: "120/80",
    unit: "mmHg",
    status: "Normal",
    icon: Activity,
    iconBg: "bg-[#EEF2FF]",
    iconColor: "text-[#4F46E5]",
  },
  {
    label: "Temperature",
    value: "36.8",
    unit: "\u00B0C",
    status: "High",
    icon: Thermometer,
    iconBg: "bg-[#EEF2FF]",
    iconColor: "text-[#4F46E5]",
  },
  {
    label: "Heart Rate",
    value: "72",
    unit: "bpm",
    status: "Low",
    icon: HeartPulse,
    iconBg: "bg-[#EEF2FF]",
    iconColor: "text-[#4F46E5]",
  },
  {
    label: "Weight",
    value: "70",
    unit: "kg",
    status: "High",
    icon: Scale,
    iconBg: "bg-[#EEF2FF]",
    iconColor: "text-[#4F46E5]",
  },
  {
    label: "Sugar Level",
    value: "96",
    unit: "mmol/L",
    status: "High",
    icon: Droplet,
    iconBg: "bg-[#EEF2FF]",
    iconColor: "text-[#4F46E5]",
  },
];

const tabs = [
  "Patient Overview",
  "Medical History",
  "Prescription",
  "Lab Test",
  "Activity Log",
] as const;

type MedicalHistoryItem = {
  title: string;
  note: string;
  doctor: string;
  role: string;
  date: string;
  status: "Active" | "Resolved";
  statusClass: string;
};

const medicalHistory: MedicalHistoryItem[] = [
  {
    title: "Hypertension, High Cholesterol",
    note: "Patient complains of headaches...",
    doctor: "Wilson Francis",
    role: "General Doctor",
    date: "10 Oct 2025",
    status: "Active",
    statusClass: "bg-[#E0F2F1] text-[#00B8A8]",
  },
  {
    title: "Hypertension, High Cholesterol",
    note: "Patient complains of headaches...",
    doctor: "Wilson Francis",
    role: "General Doctor",
    date: "10 Oct 2025",
    status: "Resolved",
    statusClass: "bg-[#F3F4F6] text-gray-500",
  },
  {
    title: "Hypertension, High Cholesterol",
    note: "Patient complains of headaches...",
    doctor: "Wilson Francis",
    role: "General Doctor",
    date: "10 Oct 2025",
    status: "Resolved",
    statusClass: "bg-[#F3F4F6] text-gray-500",
  },
];

type DoctorNote = {
  name: string;
  role: string;
  date: string;
  body: string;
};

const doctorNotes: DoctorNote[] = [
  {
    name: "Wilson Francis",
    role: "General Doctor",
    date: "May 27, 2025, 10:04 PM",
    body:
      "Lorem ipsum dolor sit amet consectetur. Arcu donec massa consequat interdum magna mattis amet non malesuada. Eu quis ipsum vestibulum adipiscing fringilla lectus eget. Enim libero magna ultrices rhoncus lorem. Duis placerat urna ultrices mattis morbi tincidunt. Ornare sit scelerisque feugiat sit orci risus nisi ullamcorper. Condimentum tincidunt et aenean iaculis aliquet. Tincidunt turpis senectus a consectetur.",
  },
];

type Prescription = {
  name: string;
  dose: string;
  frequency: string;
  duration: string;
  route: string;
  status: "Pending";
  statusClass: string;
};

const prescriptions: Prescription[] = [
  {
    name: "Metformin",
    dose: "500 mg",
    frequency: "Twice daily",
    duration: "6 months",
    route: "Oral",
    status: "Pending",
    statusClass: "bg-[#FFF6E1] text-[#D68B00]",
  },
];

type LabStatus = "Abnormal" | "Normal" | "Pending";
type LabResult = "Completed";

type LabTest = {
  title: string;
  category: string;
  tag: "Urgent" | null;
  doctor: string;
  role: string;
  date: string;
  status: LabStatus | null;
  statusClass: string;
  result: LabResult | null;
  resultClass: string;
};

const labTests: LabTest[] = [
  {
    title: "Complete Blood Count",
    category: "Hematology",
    tag: "Urgent",
    doctor: "Wilson Francis",
    role: "General Doctor",
    date: "10 Oct 2025",
    status: "Abnormal",
    statusClass: "border border-[#FCA5A5] text-[#DC2626] bg-[#FEF2F2]",
    result: "Completed",
    resultClass: "bg-[#E8FFF6] text-[#00B885]",
  },
  {
    title: "Urinalysis",
    category: "Microbiology",
    tag: null,
    doctor: "Wilson Francis",
    role: "General Doctor",
    date: "10 Oct 2025",
    status: "Pending",
    statusClass: "bg-[#FFF6E1] text-[#D68B00]",
    result: null,
    resultClass: "",
  },
  {
    title: "Complete Blood Count",
    category: "Hematology",
    tag: "Urgent",
    doctor: "Wilson Francis",
    role: "General Doctor",
    date: "10 Oct 2025",
    status: null,
    statusClass: "",
    result: "Completed",
    resultClass: "bg-[#E8FFF6] text-[#00B885]",
  },
  {
    title: "Complete Blood Count",
    category: "Hematology",
    tag: null,
    doctor: "Wilson Francis",
    role: "General Doctor",
    date: "10 Oct 2025",
    status: "Normal",
    statusClass: "border border-[#A7F3D0] text-[#10B981] bg-[#ECFDF5]",
    result: "Completed",
    resultClass: "bg-[#E8FFF6] text-[#00B885]",
  },
  {
    title: "Complete Blood Count",
    category: "Hematology",
    tag: "Urgent",
    doctor: "Wilson Francis",
    role: "General Doctor",
    date: "10 Oct 2025",
    status: "Pending",
    statusClass: "bg-[#FFF6E1] text-[#D68B00]",
    result: null,
    resultClass: "",
  },
];

type ActivityItem = {
  name: string;
  date: string;
  tag: "Medical Update" | "Lab Test" | "Vitals";
  detail: string;
};

const activityLog: ActivityItem[] = [
  {
    name: "Dr. Adeyemi",
    date: "10 Oct 2025, 4:20 PM",
    tag: "Medical Update",
    detail: "Added new condition \"Hypertension\"",
  },
  {
    name: "Dr. Adeyemi",
    date: "10 Oct 2025, 4:10 PM",
    tag: "Lab Test",
    detail: "Lab test order \"Complete Blood Count\"",
  },
  {
    name: "Dr. Adeyemi",
    date: "10 Oct 2025, 4:05 PM",
    tag: "Lab Test",
    detail: "Lab test order \"Complete Blood Count\"",
  },
  {
    name: "Dr. Adeyemi",
    date: "10 Oct 2025, 4:00 PM",
    tag: "Medical Update",
    detail: "Added new condition \"Hypertension\"",
  },
  {
    name: "Nurse Aminu",
    date: "10 Oct 2025, 3:20 PM",
    tag: "Vitals",
    detail: "Nurse created \"Vital\"",
  },
  {
    name: "Nurse Aminu",
    date: "10 Oct 2025, 3:10 PM",
    tag: "Vitals",
    detail: "Nurse created \"Vital\"",
  },
  {
    name: "Dr. Adeyemi",
    date: "10 Oct 2025, 3:00 PM",
    tag: "Medical Update",
    detail: "Added new condition \"Hypertension\"",
  },
];

export default function NursePatientDetails() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full space-y-5 md:space-y-6 font-sans py-2 md:py-4">
      <div className="flex items-center">
        <Link
          href="/dashboard/nurse-dashboard/patient-records"
          className="inline-flex items-center gap-2 rounded-full bg-[#ECEEFD] text-[#1A2380] text-xs md:text-sm font-medium px-4 py-2 hover:bg-[#E0E4FA] transition"
        >
          <ChevronLeft size={16} />
          Back to Patients List
        </Link>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-[#E0F2F1] text-[#00B8A8] flex items-center justify-center font-semibold text-sm">
                BH
              </div>
              <div>
                <p className="text-base md:text-lg font-semibold text-gray-900">
                  Brandon Herwitz
                </p>
                <p className="text-xs md:text-sm text-gray-500">
                  <span className="text-[#00B8A8] font-medium">PID:</span>{" "}
                  <span className="font-semibold text-gray-900">SMC0400</span>
                </p>
              </div>
            </div>
            {activeTab === 2 || activeTab === 3 ? (
              <button className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-2 text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                <PencilLine size={14} className="text-gray-500" />
                Edit Vitals
              </button>
            ) : (
              <button className="h-9 w-9 rounded-full border border-gray-100 hover:bg-gray-50 flex items-center justify-center text-gray-400">
                <MoreVertical size={18} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs md:text-sm text-gray-600">
            <div>
              <span className="text-gray-400">Gender:</span>{" "}
              <span className="font-semibold text-gray-900">Male</span>
            </div>
            <div>
              <span className="text-gray-400">Age:</span>{" "}
              <span className="font-semibold text-gray-900">34</span>
            </div>
            <div>
              <span className="text-gray-400">Blood Group:</span>{" "}
              <span className="font-semibold text-gray-900">O+</span>
            </div>
            <div>
              <span className="text-gray-400">Genotype:</span>{" "}
              <span className="font-semibold text-gray-900">AA</span>
            </div>
            <div>
              <span className="text-gray-400">Phone Number:</span>{" "}
              <span className="font-semibold text-gray-900">07018254000</span>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-5 md:overflow-visible">
            {vitals.map((vital) => {
              const Icon = vital.icon;
              return (
                <div
                  key={vital.label}
                  className="min-w-[160px] md:min-w-0 rounded-lg border border-gray-200 p-3 md:p-4 bg-white"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-gray-900">
                      {vital.value}{" "}
                      <span className="text-xs font-medium text-gray-400">
                        {vital.unit}
                      </span>
                    </div>
                    <div
                      className={`h-7 w-7 rounded-full ${vital.iconBg} flex items-center justify-center`}
                    >
                      <Icon size={14} className={vital.iconColor} />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-xs text-gray-500">{vital.label}</p>
                    <StatusBadge status={vital.status} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="border-b border-gray-200">
        <div className="flex flex-wrap gap-2 md:gap-6 text-xs md:text-sm">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(index)}
              className={`pb-3 transition ${
                activeTab === index
                  ? "text-[#1A2380] border-b-2 border-[#1A2380] font-semibold"
                  : "text-gray-400 hover:text-[#1A2380] border-b-2 border-transparent font-medium"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 4 ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm md:text-base font-semibold text-gray-900">
              Activity Log
            </h3>
          </div>

          <div className="relative">
            <div className="absolute left-3 top-1 bottom-1 w-px bg-[#E5E7EB]" />
            <div className="space-y-4">
              {activityLog.map((item, index) => (
                <div
                  key={`${item.tag}-${index}`}
                  className="grid grid-cols-[24px_1fr] gap-3"
                >
                  <div className="flex items-start justify-center">
                    <div className="relative z-10 h-7 w-7 rounded-full border border-[#DADDFE] bg-white flex items-center justify-center text-[#1A2380] text-[10px] font-semibold">
                      i
                    </div>
                  </div>
                  <div className="min-w-0 pb-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span className="font-semibold text-gray-900">
                        {item.name}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span>{item.date}</span>
                    </div>
                    <p className="text-xs text-[#1A2380] font-semibold mt-1">
                      {item.tag}
                      <span className="text-gray-400 font-normal"> - </span>
                      <span className="text-gray-500 font-normal">
                        {item.detail}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : activeTab === 3 ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm md:text-base font-semibold text-gray-900">
              Lab Test
            </h3>
            <button className="inline-flex items-center gap-2 rounded-full bg-[#1A2380] text-white text-xs md:text-sm font-semibold px-4 py-2 hover:bg-[#111B66] transition">
              <span className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center">
                <Plus size={14} />
              </span>
              Order Lab Test
            </button>
          </div>

          <div className="space-y-3">
            {labTests.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="flex flex-col gap-3 xl:grid xl:grid-cols-[320px_200px_120px_auto] xl:items-center">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-lg border border-[#DADDFE] bg-[#EEF2FF] flex items-center justify-center">
                      <FlaskConical size={18} className="text-[#1A2380]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">
                          {item.title}
                        </p>
                        {item.tag && (
                          <span className="rounded-full bg-[#FEE2E2] text-[#DC2626] text-[10px] font-semibold px-2 py-0.5">
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 min-w-0">
                    <div className="h-6 w-6 rounded-full bg-[#E0F2F1] text-[#00B8A8] flex items-center justify-center text-[9px] font-semibold">
                      WF
                    </div>
                    <div className="leading-tight">
                      <p className="text-xs font-semibold text-gray-900">
                        {item.doctor}
                      </p>
                      <p className="text-[10px] text-[#1A2380]">
                        {item.role}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-gray-400 whitespace-nowrap lg:justify-self-start">
                    {item.date}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap lg:justify-end">
                    {item.status && (
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-semibold ${item.statusClass}`}
                      >
                        {item.status}
                      </span>
                    )}
                    {item.result && (
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-semibold ${item.resultClass}`}
                      >
                        {item.result}
                      </span>
                    )}
                    <button className="rounded-full border border-[#E8EAF6] bg-[#F5F7FF] text-[#1A2380] text-xs font-semibold px-3 py-1.5 hover:bg-[#ECEEFD] transition">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : activeTab === 2 ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm md:text-base font-semibold text-gray-900">
              Prescription
            </h3>
            <button className="inline-flex items-center gap-2 rounded-full bg-[#1A2380] text-white text-xs md:text-sm font-medium px-4 py-2 hover:bg-[#111B66] transition">
              <span className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center">
                <Plus size={14} />
              </span>
              New Prescription
            </button>
          </div>

          <div className="space-y-3">
            {prescriptions.map((item) => (
              <div
                key={item.name}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg border border-[#DADDFE] bg-[#EEF2FF] flex items-center justify-center">
                      <div className="h-5 w-5 rounded-full border border-[#4F46E5] relative">
                        <div className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#4F46E5]" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">{item.dose}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <span>{item.frequency}</span>
                    <span>{item.duration}</span>
                    <span>{item.route}</span>
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-semibold ${item.statusClass}`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : activeTab === 1 ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm md:text-base font-semibold text-gray-900">
                Medical History
              </h3>
              <button className="inline-flex items-center gap-2 rounded-full bg-[#1A2380] text-white text-xs md:text-sm font-medium px-4 py-2 hover:bg-[#111B66] transition">
                <span className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center">
                  <Plus size={14} />
                </span>
                Add Diagnosis
              </button>
            </div>

            <div className="space-y-3">
              {medicalHistory.map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className="rounded-lg border border-gray-200 bg-white p-4"
                >
                  <div className="flex flex-wrap items-center gap-3 justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500">{item.note}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-[#E0F2F1] text-[#00B8A8] flex items-center justify-center text-[10px] font-semibold">
                          WF
                        </div>
                        <div className="text-xs">
                          <p className="font-semibold text-gray-900">
                            {item.doctor}
                          </p>
                          <p className="text-[10px] text-[#1A2380]">
                            {item.role}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {item.date}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-semibold ${item.statusClass}`}
                      >
                        {item.status}
                      </span>
                      <button className="h-8 w-8 rounded-full border border-gray-100 hover:bg-gray-50 flex items-center justify-center text-gray-400">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-lg border border-gray-200 bg-white p-4 h-fit">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Doctor's Note
            </h4>
            <div className="text-xs text-gray-500 leading-relaxed mb-4">
              Lorem ipsum dolor sit amet consectetur. Arcu donec massa consequat
              interdum magna mattis amet non malesuada. Eu quis ipsum vestibulum
              adipiscing fringilla lectus eget. Enim libero magna ultrices
              rhoncus lorem.
            </div>

            {doctorNotes.map((note) => (
              <div key={note.date} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-[#E0F2F1] text-[#00B8A8] flex items-center justify-center text-[10px] font-semibold">
                    WF
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-gray-900">{note.name}</p>
                    <p className="text-[10px] text-[#1A2380]">{note.role}</p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400">{note.date}</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {note.body}
                </p>
              </div>
            ))}
          </aside>
        </div>
      ) : activeTab !== 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500">
          No data yet for {tabs[activeTab]}.
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-sm md:text-base font-semibold text-gray-900">
            Patient Overview
          </h3>
          <div className="w-full overflow-hidden">
            <div className="w-full lg:max-w-none lg:mx-0 xl:max-w-[95%] xl:mx-auto overflow-x-auto border border-gray-200 rounded-lg md:rounded-xl bg-white">
              <table className="min-w-[900px] w-full text-left text-sm md:text-base">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-gray-100 bg-gray-50/50">
                    <th className="py-3 md:py-4 px-3 md:px-4 font-medium whitespace-nowrap">
                      Patient Name
                    </th>
                    <th className="py-3 md:py-4 px-3 md:px-4 font-medium whitespace-nowrap">
                      Patient ID
                    </th>
                    <th className="py-3 md:py-4 px-3 md:px-4 font-medium whitespace-nowrap">
                      Age
                    </th>
                    <th className="py-3 md:py-4 px-3 md:px-4 font-medium whitespace-nowrap">
                      Gender
                    </th>
                    <th className="py-3 md:py-4 px-3 md:px-4 font-medium whitespace-nowrap">
                      Condition
                    </th>
                    <th className="py-3 md:py-4 px-3 md:px-4 font-medium whitespace-nowrap">
                      Status
                    </th>
                    <th className="py-3 md:py-4 px-3 md:px-4 font-medium whitespace-nowrap">
                      Last Visit
                    </th>
                    <th className="py-3 md:py-4 px-3 md:px-4 font-medium whitespace-nowrap">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p, index) => (
                    <tr
                      key={`${p.id}-${index}`}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors h-16 md:h-20"
                    >
                      <td className="px-3 md:px-4 py-3 md:py-4">
                        <div className="flex items-center gap-2 md:gap-3 min-w-0">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#E0F2F1] text-[#00B8A8] flex items-center justify-center font-semibold text-xs md:text-sm flex-shrink-0">
                            {p.initials}
                          </div>
                          <span className="font-semibold text-gray-900 text-sm truncate">
                            {p.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 md:px-4 py-3 md:py-4 text-gray-900 font-medium text-sm whitespace-nowrap">
                        {p.id}
                      </td>
                      <td className="px-3 md:px-4 py-3 md:py-4 text-gray-900 font-medium text-sm whitespace-nowrap">
                        {p.age}
                      </td>
                      <td className="px-3 md:px-4 py-3 md:py-4 text-gray-900 font-medium text-sm whitespace-nowrap">
                        {p.gender}
                      </td>
                      <td className="px-3 md:px-4 py-3 md:py-4 text-gray-900 font-medium text-sm whitespace-nowrap">
                        {p.condition}
                      </td>
                      <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap">
                        <span
                          className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-semibold inline-block ${getStatusClass(
                            p.status
                          )}`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-3 md:px-4 py-3 md:py-4 text-gray-900 font-medium text-sm whitespace-nowrap">
                        {p.date}
                      </td>
                      <td className="px-3 md:px-4 py-3 md:py-4 text-gray-400 sticky right-0 bg-white hover:bg-gray-50 whitespace-nowrap">
                        <button className="p-2 hover:bg-gray-100 rounded-full transition inline-flex items-center justify-center h-10 w-10 flex-shrink-0">
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

