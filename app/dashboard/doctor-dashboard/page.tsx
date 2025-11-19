import OverviewCards from "@components/dashboard/doctor-dashboard/OverviewCards";
import TodayAppointments from "@components/dashboard/doctor-dashboard/TodaysAppointment";
import DashboardLayout from "../layout";
import LabTest from "@components/dashboard/doctor-dashboard/LabTest";




export default function Dashboard() {
  return (
    // <DashboardLayout>
      <>
      {/* // <DashboardLayout> */}
      <h2 className="text-xl font-semibold text-[#1A2380] mb-1">Good morning, Dr. Alex!</h2><p className="text-gray-500 mb-8">Welcome back to PrivaCure dashboard</p><OverviewCards /><TodayAppointments /><LabTest/>
      </>
    // </DashboardLayout>
  );
}
