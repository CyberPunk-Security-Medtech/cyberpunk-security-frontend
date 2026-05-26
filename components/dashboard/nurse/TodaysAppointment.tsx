"use client";

import { useEffect, useMemo, useState } from "react";
import { StatusBadge } from "@components/StatusBadge";
import { useAuth } from "@context/AuthContext";
import { consultationService } from "@services/api";

type ConsultationRow = {
  id: string;
  name: string;
  patient_id: string;
  age: number;
  gender: string;
  condition: string;
  status: "Active" | "Discharged" | "Pending";
  date: string;
};

const formatDate = (value?: string | null): string => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString();
};

const toStatus = (value?: string): "Active" | "Discharged" | "Pending" => {
  if (!value) return "Pending";
  if (value.toLowerCase() === "completed") return "Discharged";
  if (value.toLowerCase() === "in progress") return "Active";
  return "Pending";
};

export default function TodayAppointments() {
  const { activeWorkspace } = useAuth();
  const [appointments, setAppointments] = useState<ConsultationRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orgId = activeWorkspace?.id;
    if (!orgId) return;

    let ignore = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await consultationService.listConsultations(orgId);
        if (ignore) return;

        const normalized: ConsultationRow[] = (res ?? []).map((c: any) => ({
          id: c.id,
          name: `${c.patient?.first_name ?? ""} ${c.patient?.last_name ?? ""}`.trim() || "Unknown Patient",
          patient_id: c.patient_id,
          age: 0,
          gender: "-",
          condition: c.reason_for_visit ?? "-",
          status: toStatus(c.status),
          date: formatDate(c.updated_at),
        }));

        setAppointments(normalized);
      } catch (error) {
        console.error("Failed to load consultations", error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [activeWorkspace?.id]);

  const todaysAppointments = useMemo(() => appointments.slice(0, 8), [appointments]);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="font-semibold text-[#1A2380] mb-6">Today's Appointments</h3>
      <table className="w-full text-sm text-left border-collapse">
        <thead className="text-gray-600 border-b">
          <tr>
            <th className="pb-3 font-medium">Patient Name</th>
            <th className="pb-3 font-medium">Patient ID</th>
            <th className="pb-3 font-medium">Age</th>
            <th className="pb-3 font-medium">Gender</th>
            <th className="pb-3 font-medium">Condition</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Last Visit</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td className="py-4 text-gray-500" colSpan={7}>
                Loading appointments...
              </td>
            </tr>
          )}
          {!loading && todaysAppointments.length === 0 && (
            <tr>
              <td className="py-4 text-gray-500" colSpan={7}>
                No consultations found.
              </td>
            </tr>
          )}
          {todaysAppointments.map((a) => (
            <tr key={a.id} className="border-b hover:bg-gray-50">
              <td className="py-3 font-medium text-[#1A2380]">{a.name}</td>
              <td>{a.patient_id}</td>
              <td>{a.age}</td>
              <td>{a.gender}</td>
              <td>{a.condition}</td>
              <td><StatusBadge status={a.status} /></td>
              <td>{a.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
