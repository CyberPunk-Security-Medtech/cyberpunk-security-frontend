"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@context/AuthContext";
import { patientService } from "@services/api";

type TabKey = "overview" | "history" | "prescriptions" | "labs";

const calculateAge = (dob?: string | null): number => {
  if (!dob) return 0;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age;
};

export default function NursePatientDetails() {
  const { id } = useParams<{ id: string }>();
  const { activeWorkspace } = useAuth();

  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<any>(null);
  const [diagnoses, setDiagnoses] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [labs, setLabs] = useState<any[]>([]);

  useEffect(() => {
    const orgId = activeWorkspace?.id;
    if (!orgId || !id) return;

    let ignore = false;
    const load = async () => {
      setLoading(true);
      try {
        const [p, d, pr, l] = await Promise.all([
          patientService.getPatient(orgId, id),
          patientService.getPatientDiagnoses(orgId, id),
          patientService.getPatientPrescriptions(orgId, id),
          patientService.getPatientLabTests(orgId, id),
        ]);

        if (ignore) return;
        setPatient(p);
        setDiagnoses(d ?? []);
        setPrescriptions(pr ?? []);
        setLabs(l ?? []);
      } catch (error) {
        console.error("Failed to load nurse patient details", error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [activeWorkspace?.id, id]);

  const fullName = useMemo(
    () => `${patient?.first_name ?? ""} ${patient?.last_name ?? ""}`.trim(),
    [patient]
  );

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
        {loading ? (
          <p className="text-sm text-gray-500">Loading patient details...</p>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-[#E0F2F1] text-[#00B8A8] flex items-center justify-center font-semibold text-sm">
                {`${patient?.first_name?.[0] ?? ""}${patient?.last_name?.[0] ?? ""}`.toUpperCase() || "NA"}
              </div>
              <div>
                <p className="text-base md:text-lg font-semibold text-gray-900">{fullName || "Unknown Patient"}</p>
                <p className="text-xs md:text-sm text-gray-500">
                  <span className="text-[#00B8A8] font-medium">PID:</span> {patient?.id}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs md:text-sm text-gray-600">
              <div><span className="text-gray-400">Gender:</span> <span className="font-semibold text-gray-900">{patient?.gender ?? "-"}</span></div>
              <div><span className="text-gray-400">Age:</span> <span className="font-semibold text-gray-900">{calculateAge(patient?.dob)}</span></div>
              <div><span className="text-gray-400">Blood Group:</span> <span className="font-semibold text-gray-900">{patient?.blood_group ?? "-"}</span></div>
              <div><span className="text-gray-400">Phone Number:</span> <span className="font-semibold text-gray-900">{patient?.phone_number ?? "-"}</span></div>
            </div>
          </>
        )}
      </section>

      <div className="border-b border-gray-200">
        <div className="flex flex-wrap gap-2 md:gap-6 text-xs md:text-sm">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 transition ${
              activeTab === "overview"
                ? "text-[#1A2380] border-b-2 border-[#1A2380] font-semibold"
                : "text-gray-400 border-b-2 border-transparent"
            }`}
          >
            Patient Overview
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`pb-3 transition ${
              activeTab === "history"
                ? "text-[#1A2380] border-b-2 border-[#1A2380] font-semibold"
                : "text-gray-400 border-b-2 border-transparent"
            }`}
          >
            Medical History
          </button>
          <button
            onClick={() => setActiveTab("prescriptions")}
            className={`pb-3 transition ${
              activeTab === "prescriptions"
                ? "text-[#1A2380] border-b-2 border-[#1A2380] font-semibold"
                : "text-gray-400 border-b-2 border-transparent"
            }`}
          >
            Prescription
          </button>
          <button
            onClick={() => setActiveTab("labs")}
            className={`pb-3 transition ${
              activeTab === "labs"
                ? "text-[#1A2380] border-b-2 border-[#1A2380] font-semibold"
                : "text-gray-400 border-b-2 border-transparent"
            }`}
          >
            Lab Test
          </button>
        </div>
      </div>

      {activeTab === "overview" && (
        <section className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm text-sm text-gray-600 space-y-2">
          <p><span className="font-semibold text-gray-900">Email:</span> {patient?.email ?? "-"}</p>
          <p><span className="font-semibold text-gray-900">Allergies:</span> {patient?.allergies || "None recorded"}</p>
          <p><span className="font-semibold text-gray-900">Past Medical History:</span> {patient?.past_medical_history || "None recorded"}</p>
          <p><span className="font-semibold text-gray-900">Family Medical History:</span> {patient?.family_medical_history || "None recorded"}</p>
        </section>
      )}

      {activeTab === "history" && (
        <section className="space-y-3">
          {diagnoses.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-500">
              No diagnosis records found.
            </div>
          )}
          {diagnoses.map((d) => (
            <div key={d.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="font-semibold text-gray-900">{d.primary_diagnosis}</p>
              <p className="text-sm text-gray-600 mt-1">{d.secondary_diagnosis || d.symptoms || "No additional details"}</p>
            </div>
          ))}
        </section>
      )}

      {activeTab === "prescriptions" && (
        <section className="space-y-3">
          {prescriptions.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-500">
              No prescriptions found.
            </div>
          )}
          {prescriptions.map((p) => (
            <div key={p.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="font-semibold text-gray-900">{p.medication_name}</p>
              <p className="text-sm text-gray-600 mt-1">
                {p.dosage} • {p.frequency} • {p.duration}
              </p>
            </div>
          ))}
        </section>
      )}

      {activeTab === "labs" && (
        <section className="space-y-3">
          {labs.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-500">
              No lab tests found.
            </div>
          )}
          {labs.map((l) => (
            <div key={l.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="font-semibold text-gray-900">{l.test_name}</p>
              <p className="text-sm text-gray-600 mt-1">
                {l.test_category || "General"} • {l.status}
              </p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
