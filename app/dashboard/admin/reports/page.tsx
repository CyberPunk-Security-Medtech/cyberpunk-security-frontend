"use client";

import Tabs from "@components/Tabs";
import HmoConsultationReport from "@components/dashboard/admin/report/HmoConsultationReport";
import DoctorPatientsReport from "@components/dashboard/admin/report/DoctorPatientsReport";
import StaffActivityReport, { STAFF_REPORTS } from "@components/dashboard/admin/report/StaffActivityReport";

export default function ReportsAnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <section>
        <h1 className="dashboard-page-title">Reports</h1>
        <p className="mt-1 text-sm text-slate-600">
          Monthly activity by HMO and by staff role. Choose a tab to see each report.
        </p>
      </section>

      <Tabs
        tabs={[
          { label: "HMO consultations", content: <HmoConsultationReport /> },
          { label: "Doctors", content: <DoctorPatientsReport /> },
          { label: "Nurses", content: <StaffActivityReport key="nurses" config={STAFF_REPORTS.nurses} /> },
          { label: "Lab", content: <StaffActivityReport key="lab" config={STAFF_REPORTS.lab} /> },
          { label: "Pharmacy", content: <StaffActivityReport key="pharmacy" config={STAFF_REPORTS.pharmacy} /> },
          { label: "Records", content: <StaffActivityReport key="records" config={STAFF_REPORTS.records} /> },
        ]}
      />
    </div>
  );
}
