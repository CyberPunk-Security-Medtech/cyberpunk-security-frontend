import Topbar from "@components/dashboard/admin-dashboard/adminTopBar";
import ReportsAnalytics from "@components/dashboard/admin-dashboard/report/ReportAnalytics";
import Sidebar from "@components/dashboard/admin-dashboard/Sidebar";
import Header from "@components/Header";


export default function ReportsAnalyticsPage() {
  <div className="min-h-screen flex text-slate-900">
        <Sidebar />
        <main className="flex-1 flex flex-col">
          <Header />
          <Topbar/>
          <div className="px-8 py-6 space-y-6">
            <ReportsAnalytics />
          </div>
        </main>
      </div>
}
