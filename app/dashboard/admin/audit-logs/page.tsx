import AuditLogsTable from "@components/dashboard/admin/audit-logs/AuditLogsTable";

export default function AdminAuditLogsPage() {
  return (
    <div className="min-h-full bg-gradient-to-br from-[#EFFBFA] via-[#F7F8F8] to-[#F7F8F8] px-4 py-6 md:px-8">
      <div className="w-full">
        <AuditLogsTable />
      </div>
    </div>
  );
}
