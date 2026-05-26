"use client";

import Image from "next/image";

interface LabTest {
  title: string;
  category: string;
  patient: { initials: string; name: string };
  abnormal?: boolean;
  status: "Completed" | "Pending" | "Normal";
}

interface Activity {
  patient: { initials: string; name: string };
  doctor: string;
  time: string;
  details: string;
}

const labTests: LabTest[] = [
  {
    title: "Complete Blood Count",
    category: "Hematology",
    patient: { initials: "BH", name: "Brandon Herwitz" },
    abnormal: true,
    status: "Completed",
  },
  {
    title: "Urine Test",
    category: "Urology",
    patient: { initials: "BH", name: "Brandon Herwitz" },
    status: "Pending",
  },
  {
    title: "Blood Sugar",
    category: "Biochemistry",
    patient: { initials: "BH", name: "Brandon Herwitz" },
    status: "Pending",
  },
];

const activities: Activity[] = [
  {
    patient: { initials: "BH", name: "Brandon Herwitz" },
    doctor: "Dr. Adeyemi",
    time: "10 Oct 2025, 4:20 PM",
    details: 'Added new condition "Hypertension"',
  },
  {
    patient: { initials: "BH", name: "Brandon Herwitz" },
    doctor: "Dr. Adeyemi",
    time: "10 Oct 2025, 4:10 PM",
    details: 'Updated patient notes',
  },
];

export default function LabTest() {
  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ──────────────── Lab Test Updates ──────────────── */}
      <div className="bg-white shadow rounded-xl p-6 min-h-[400px]">
        <h4 className="font-semibold text-gray-900 mb-4">Lab Test Updates</h4>

        {labTests.map((test, idx) => (
          <div key={idx} className="flex items-start gap-4 py-4 border-b last:border-none">
            {/* Icon */}
            <div className="bg-blue-50 p-2 rounded-lg">
              <Image src="/lab-icon.svg" alt="Lab icon" width={32} height={32} />
            </div>

            {/* Test Info */}
            <div className="flex-1">
              <p className="font-medium text-gray-800 text-sm">{test.title}</p>
              <p className="text-xs text-gray-500">{test.category}</p>
            </div>

            {/* Patient & Status */}
            <div className="text-right">
              <div className="flex items-center justify-end gap-2">
                <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-md font-semibold">
                  {test.patient.initials}
                </span>
                <span className="text-xs text-gray-600">{test.patient.name}</span>
              </div>

              <div className="flex justify-end gap-2 mt-1">
                {test.abnormal && (
                  <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-md">
                    Abnormal
                  </span>
                )}
                <span
                  className={`text-xs px-2 py-1 rounded-md ${
                    test.status === "Completed"
                      ? "bg-green-50 text-green-600"
                      : test.status === "Pending"
                      ? "bg-yellow-50 text-yellow-600"
                      : "bg-gray-50 text-gray-600"
                  }`}
                >
                  {test.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ──────────────── Recent Activities ──────────────── */}
      <div className="bg-white shadow rounded-xl p-6 min-h-[400px]">
        <h4 className="font-semibold text-gray-900 mb-4">Recent Activities</h4>

        {activities.map((activity, idx) => (
          <div key={idx} className="py-4 border-b last:border-none">
            <div className="flex gap-3 items-center">
              <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-md font-semibold">
                {activity.patient.initials}
              </span>
              <span className="text-sm font-medium text-gray-800">
                {activity.patient.name}
              </span>
            </div>

            <p className="text-xs text-gray-500 mt-1">
              {activity.doctor} · {activity.time}
            </p>

            <p className="text-xs text-gray-600">
              <span className="font-semibold">Medical Update:</span> {activity.details}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
