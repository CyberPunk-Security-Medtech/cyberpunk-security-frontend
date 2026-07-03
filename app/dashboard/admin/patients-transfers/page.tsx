import PatientTransferDashboard from "@components/patient-transfers/transferDashboard/PatientTransferDashboard";
import AdminTransferShell from "./AdminTransferShell";

export default function AdminPatientTransfersPage() {
  return (
    <AdminTransferShell>
      <PatientTransferDashboard embedded />
    </AdminTransferShell>
  );
}
