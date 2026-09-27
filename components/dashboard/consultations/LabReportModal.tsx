"use client";

import { useEffect, useState } from "react";
import { ExternalLink, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import Modal from "@components/Modal";
import { labService } from "@services/api";

type ResultRow = {
  parameter?: string;
  value?: string;
  unit?: string;
  reference_range?: string;
  flag?: string;
};

type ReportAttachment = {
  id: string;
  file_name?: string | null;
  content_type?: string | null;
  file_url?: string;
  created_at?: string;
};

type LabReport = {
  performed_by_name?: string | null;
  interpretation?: string | null;
  results?: ResultRow[] | null;
  attachments?: ReportAttachment[] | null;
  created_at?: string;
  updated_at?: string;
};

type Props = {
  orgId: string | null | undefined;
  labTest: { id: string; test_name?: string } | null;
  onClose: () => void;
  headerClassName?: string;
};

const formatDate = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
};

const isAbnormal = (flag?: string) => Boolean(flag) && !/^normal$/i.test(flag ?? "");

// Read-only view of a completed lab test's report for the clinical team.
export default function LabReportModal({ orgId, labTest, onClose, headerClassName }: Props) {
  const [report, setReport] = useState<LabReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orgId || !labTest) return;
    let cancelled = false;
    setLoading(true);
    setError("");
    setReport(null);
    labService
      .getLabReport(orgId, labTest.id)
      .then((raw) => {
        if (cancelled) return;
        setReport(((raw as { data?: LabReport })?.data ?? raw) as LabReport);
      })
      .catch((err) => {
        if (cancelled) return;
        const status = (err as { response?: { status?: number } })?.response?.status;
        setError(
          status === 404
            ? "The lab hasn't submitted a report for this test yet."
            : status === 403
              ? "You don't have access to this report."
              : "Couldn't load the report. Please try again.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [orgId, labTest]);

  const results = report?.results ?? [];
  const attachments = report?.attachments ?? [];
  const reportedAt = formatDate(report?.updated_at || report?.created_at);

  return (
    <Modal
      title={labTest?.test_name ? `${labTest.test_name} report` : "Lab report"}
      isOpen={Boolean(labTest)}
      onClose={onClose}
      header={
        report
          ? [report.performed_by_name && `Reported by ${report.performed_by_name}`, reportedAt]
              .filter(Boolean)
              .join(" · ")
          : undefined
      }
      headerClassName={headerClassName}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-500">
          <Loader2 size={16} className="animate-spin" aria-hidden="true" /> Loading report…
        </div>
      ) : error ? (
        <p className="rounded-md bg-gray-50 px-4 py-6 text-center text-sm text-gray-600">{error}</p>
      ) : report ? (
        <div className="space-y-6">
          {results.length > 0 ? (
            <section>
              <h4 className="mb-2 text-sm font-semibold text-gray-900">Results</h4>
              <div className="overflow-x-auto rounded-md border border-gray-200">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr>
                      <th className="px-4 py-2 font-medium">Parameter</th>
                      <th className="px-4 py-2 font-medium">Result</th>
                      <th className="px-4 py-2 font-medium">Reference range</th>
                      <th className="px-4 py-2 font-medium">Flag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {results.map((row, index) => (
                      <tr key={index} className={isAbnormal(row.flag) ? "bg-red-50/40" : undefined}>
                        <td className="px-4 py-2 font-medium text-gray-900">{row.parameter || "—"}</td>
                        <td className={`px-4 py-2 ${isAbnormal(row.flag) ? "font-semibold text-red-700" : "text-gray-700"}`}>
                          {row.value || "—"} {row.unit}
                        </td>
                        <td className="px-4 py-2 text-gray-600">{row.reference_range || "—"}</td>
                        <td className="px-4 py-2">
                          {row.flag ? (
                            <span
                              className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${
                                isAbnormal(row.flag) ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                              }`}
                            >
                              {row.flag}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {report.interpretation ? (
            <section>
              <h4 className="mb-2 text-sm font-semibold text-gray-900">Interpretation</h4>
              <p className="whitespace-pre-wrap rounded-md border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-700">
                {report.interpretation}
              </p>
            </section>
          ) : null}

          <section>
            <h4 className="mb-2 text-sm font-semibold text-gray-900">
              Attachments{attachments.length ? ` (${attachments.length})` : ""}
            </h4>
            {attachments.length > 0 ? (
              <ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
                {attachments.map((attachment) => {
                  const isImage = attachment.content_type?.startsWith("image/");
                  const name = attachment.file_name || "Untitled file";
                  return (
                    <li key={attachment.id} className="flex items-center gap-3 px-3 py-2.5 text-sm">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
                          isImage ? "bg-sky-50 text-sky-600" : "bg-red-50 text-red-600"
                        }`}
                      >
                        {isImage ? <ImageIcon size={16} aria-hidden="true" /> : <FileText size={16} aria-hidden="true" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-gray-800" title={name}>{name}</p>
                        {attachment.created_at ? (
                          <p className="text-xs text-gray-500">Uploaded {formatDate(attachment.created_at)}</p>
                        ) : null}
                      </div>
                      {attachment.file_url ? (
                        <a
                          href={attachment.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-9 shrink-0 items-center gap-1 rounded-md px-2 text-xs font-medium text-[var(--dashboard-accent,#1A2380)] hover:bg-gray-100"
                        >
                          <ExternalLink size={14} aria-hidden="true" /> Open
                        </a>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No files attached.</p>
            )}
          </section>

          {results.length === 0 && !report.interpretation && attachments.length === 0 ? (
            <p className="text-sm text-gray-500">The report is empty.</p>
          ) : null}
        </div>
      ) : null}
    </Modal>
  );
}
