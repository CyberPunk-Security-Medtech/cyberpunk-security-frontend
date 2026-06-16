import SharingPermissionsPage from "@components/patient-transfers/sharingPermissions/SharingPermissionsPage";
import AdminTransferShell from "../AdminTransferShell";

export default function AdminSharingPermissionsPage() {
  return (
    <AdminTransferShell>
      <SharingPermissionsPage embedded />
    </AdminTransferShell>
  );
}
