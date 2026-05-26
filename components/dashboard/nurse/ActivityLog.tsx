"use client";

import { useMemo } from "react";
import { useConsultation } from "./ConsultationContext";

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

export default function ActivityLogTab() {
  const { selectedConsultation } = useConsultation();

  const logs = useMemo(() => {
    if (!selectedConsultation) return [];

    const items: Array<{ type: string; text: string; time: string }> = [];

    items.push({
      type: "Consultation Created",
      text: selectedConsultation.reason_for_visit || "Consultation opened",
      time: formatDate(selectedConsultation.created_at),
    });

    items.push({
      type: "Status",
      text: `Consultation is ${selectedConsultation.status || "-"}`,
      time: formatDate(selectedConsultation.updated_at || selectedConsultation.created_at),
    });

    if (selectedConsultation.clinical_notes) {
      items.push({
        type: "Doctor Note",
        text: selectedConsultation.clinical_notes,
        time: formatDate(selectedConsultation.updated_at || selectedConsultation.created_at),
      });
    }

    return items;
  }, [selectedConsultation]);

  return (
    <section className="rounded-lg border bg-white p-4 shadow-sm sm:p-6">
      <h3 className="text-lg font-semibold text-brand-navy mb-6">Activity Log</h3>

      {!selectedConsultation && (
        <div className="rounded-xl border p-4 text-sm text-gray-500">
          Select a consultation to view activity.
        </div>
      )}

      {selectedConsultation && logs.length === 0 && (
        <div className="rounded-xl border p-4 text-sm text-gray-500">
          No activity recorded yet.
        </div>
      )}

      {selectedConsultation && logs.length > 0 && (
        <ul className="space-y-4">
          {logs.map((log, index) => (
            <li key={`${log.type}-${index}`} className="flex gap-4">
              <div className="mt-1 h-2 w-2 rounded-full bg-brand-teal" />
              <div className="flex-1 pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-brand-navy">{log.type}</span>
                  <span className="break-words text-sm text-gray-600">{log.text}</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">{log.time}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
