import IncomingRecordsPage from "../../../doctor/patient-transfers/incoming-records/page";
import AdminTransferShell from "../AdminTransferShell";

export default function AdminIncomingRecordsPage() {
  return (
    <AdminTransferShell>
      <IncomingRecordsPage embedded />
    </AdminTransferShell>
  );
}
