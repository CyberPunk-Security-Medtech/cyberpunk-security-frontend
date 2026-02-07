// import OverviewCards from "@components/dashboard/doctor-dashboard/OverviewCards";
// import TodayAppointments from "@components/dashboard/doctor-dashboard/TodaysAppointment";
// import LabTest from "@components/dashboard/doctor-dashboard/LabTest";




// export default function Dashboard() {
//   return (
//     // <DashboardLayout>
//       <>
//       {/* // <DashboardLayout> */}
//       <h2 className="text-xl font-semibold text-[#1A2380] mb-1">Good morning, Dr. Alex!</h2><p className="text-gray-500 mb-8">Welcome back to PrivaCure dashboard</p><OverviewCards /><TodayAppointments /><LabTest/>
//       </>
//     // </DashboardLayout>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import OverviewCards from "@components/dashboard/doctor-dashboard/OverviewCards";
import TodayAppointments from "@components/dashboard/doctor-dashboard/TodaysAppointment";
import LabTest from "@components/dashboard/doctor-dashboard/LabTest";
import { authService } from "@services/api";

export default function Dashboard() {
  const [doctorName, setDoctorName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const me = await authService.getMe();

        // adjust depending on API structure
        setDoctorName(`${me.first_name} ${me.last_name}`);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <h2 className="text-xl font-semibold text-[#1A2380] mb-1">
        Good morning, Dr. {doctorName || "Loading..."}!
      </h2>
      <p className="text-gray-500 mb-8">
        Welcome back to PrivaCure dashboard
      </p>

      <OverviewCards />
      <TodayAppointments />
      <LabTest />
    </>
  );
}