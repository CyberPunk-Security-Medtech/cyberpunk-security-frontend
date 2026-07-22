"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@components/StatusBadge";
import { useAuth } from "@context/AuthContext";
import { consultationService, organizationService } from "@services/api";
import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";

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
    <div className="rounded-lg border bg-white p-4 shadow-sm sm:p-6">
      <h3 className="dashboard-section-title mb-4 text-[#1A2380] sm:mb-6">Today's Appointments</h3>
      <ResponsiveTableRegion label="Today's appointments">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead className="text-gray-600 border-b">
          <tr>
            <th scope="col" className="min-w-[160px] border-b bg-white px-4 py-3 font-medium">Patient Name</th>
            <th scope="col" className="min-w-[220px] px-4 py-3 font-medium">Patient ID</th>
            <th scope="col" className="min-w-[100px] px-4 py-3 font-medium">Priority</th>
            <th scope="col" className="min-w-[150px] px-4 py-3 font-medium">Condition</th>
            <th scope="col" className="min-w-[110px] px-4 py-3 font-medium">Status</th>
            <th scope="col" className="min-w-[100px] px-4 py-3 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td className="px-4 py-6 text-center text-gray-500" colSpan={6}>
                Loading appointments...
              </td>
            </tr>
          )}
          {!loading && todaysAppointments.length === 0 && (
            <tr>
              <td className="px-4 py-6 text-center text-gray-500" colSpan={6}>
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
              className={`group border-b hover:bg-gray-50 ${
                canOpenPatient ? "cursor-pointer" : "cursor-not-allowed opacity-70"
              }`}
            >
              <td className="bg-white px-4 py-3 font-medium text-[#1A2380] group-hover:bg-gray-50">{a.name}</td>
              <td className="whitespace-nowrap px-4 py-3">{a.patient_id}</td>
              <td className="whitespace-nowrap px-4 py-3">{a.priority}</td>
              <td className="px-4 py-3">{a.condition}</td>
              <td className="whitespace-nowrap px-4 py-3"><StatusBadge status={a.status} /></td>
              <td className="whitespace-nowrap px-4 py-3 tabular-nums">{a.date}</td>
            </tr>
            );
          })}
        </tbody>
      </table>
      </ResponsiveTableRegion>
    </div>
  );
}
