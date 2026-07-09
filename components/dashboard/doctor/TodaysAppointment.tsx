"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@components/StatusBadge";
import { useAuth } from "@context/AuthContext";
import { consultationService, organizationService } from "@services/api";

type ConsultationRow = {
  id: string;
  name: string;
  patient_id: string;
  condition: string;
  status: "Active" | "Discharged" | "Pending";
  date: string;
  priority: string;
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

const isSameLocalDay = (value: string | null | undefined, now: Date) => {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
};

const uniqueById = (items: any[]) =>
  Array.from(new Map(items.map((item) => [item.id, item])).values());

export default function TodayAppointments() {
  const router = useRouter();
  const { activeWorkspace } = useAuth();
  const [appointments, setAppointments] = useState<ConsultationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [emptyMessage, setEmptyMessage] = useState("No routed consultations for today.");

  useEffect(() => {
    const orgId = activeWorkspace?.id;
    if (!orgId) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    let ignore = false;
    const load = async () => {
      setLoading(true);
      try {
        const membership = await organizationService.getMyMembership(orgId);
        const departmentId = membership?.department?.id;

        if (!departmentId) {
          if (!ignore) {
            setAppointments([]);
            setEmptyMessage("No department assigned. Please contact admin.");
          }
          return;
        }

        const [pending, inProgress] = await Promise.all([
          consultationService.listConsultations(orgId, {
            status_filter: "Pending",
            department_id: departmentId,
          }),
          consultationService.listConsultations(orgId, {
            status_filter: "In Progress",
            department_id: departmentId,
          }),
        ]);
        if (ignore) return;

        const unique = uniqueById([...(pending ?? []), ...(inProgress ?? [])]);
        const now = new Date();
        const normalized: ConsultationRow[] = unique
          .filter((c: any) => isSameLocalDay(c.created_at ?? c.updated_at, now))
          .sort((first: any, second: any) => {
            const firstTime = new Date(first.created_at ?? first.updated_at ?? 0).getTime();
            const secondTime = new Date(second.created_at ?? second.updated_at ?? 0).getTime();
            return secondTime - firstTime;
          })
          .map((c: any) => ({
            id: c.id,
            name: `${c.patient?.first_name ?? ""} ${c.patient?.last_name ?? ""}`.trim() || "Unknown Patient",
            patient_id: c.patient_id ?? "",
            condition: c.reason_for_visit ?? "-",
            status: toStatus(c.status),
            date: formatDate(c.created_at ?? c.updated_at),
            priority: c.priority ?? "Routine",
          }));

        setEmptyMessage("No routed consultations for today.");
        setAppointments(normalized);
      } catch (error) {
        console.error("Failed to load consultations", error);
        if (!ignore) {
          setEmptyMessage("Unable to load routed consultations.");
          setAppointments([]);
        }
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
            <th className="pb-3 font-medium">Priority</th>
            <th className="pb-3 font-medium">Condition</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td className="py-4 text-gray-500" colSpan={6}>
                Loading appointments...
              </td>
            </tr>
          )}
          {!loading && todaysAppointments.length === 0 && (
            <tr>
              <td className="py-4 text-gray-500" colSpan={6}>
                {emptyMessage}
              </td>
            </tr>
          )}
          {todaysAppointments.map((a) => {
            const canOpenPatient = Boolean(a.patient_id);

            return (
            <tr
              key={a.id}
              onClick={() => {
                if (canOpenPatient) {
                  router.push(`/dashboard/doctor/patient/${a.patient_id}`);
                }
              }}
              className={`border-b hover:bg-gray-50 ${
                canOpenPatient ? "cursor-pointer" : "cursor-not-allowed opacity-70"
              }`}
            >
              <td className="py-3 font-medium text-[#1A2380]">{a.name}</td>
              <td>{a.patient_id}</td>
              <td>{a.priority}</td>
              <td>{a.condition}</td>
              <td><StatusBadge status={a.status} /></td>
              <td>{a.date}</td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
