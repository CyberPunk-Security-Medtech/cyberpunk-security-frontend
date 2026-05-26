"use client";

import { ArrowRight, Plus, SlidersHorizontal } from "lucide-react";
import { ConsentStatusBadge } from "./Badges";
import { FilterType, Patient } from "./PatientTransferTypes";


export default function PatientsList({
  filter,
  setFilter,
  patients,
  onOpenPatient,
}: {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  patients: Patient[];
  onOpenPatient: (patient: Patient) => void;
}) {
  return (
    <>
      <section className="bg-white px-6 pb-28 pt-10 md:px-16">
        <h1 className="text-4xl font-bold text-[#211783]">Dashboard</h1>
      </section>

      <section className="px-6 py-10 md:px-16">
        <div className="rounded-lg border border-gray-300 bg-white p-8 shadow-md">
          <h2 className="mb-8 text-2xl font-semibold text-black">Quick Actions</h2>

          <button className="inline-flex items-center gap-2 rounded bg-[#211783] px-5 py-3 text-white transition hover:bg-[#18105f]">
            <Plus size={20} />
            New Patient
          </button>
        </div>

        <div className="mt-10 overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md">
          <div className="flex flex-col gap-4 border-b border-gray-300 px-8 py-5 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-semibold text-black">Recent Patients</h2>

            <div className="flex items-center gap-3">
              <button className="rounded-lg bg-[#EEF0FF] p-3 text-[#211783]">
                <SlidersHorizontal size={18} />
              </button>

              {(["All", "Declined", "Granted"] as FilterType[]).map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`rounded-lg px-4 py-2 text-sm transition ${
                    filter === item
                      ? "bg-[#68D4CF] text-[#0F172A]"
                      : "bg-[#E8EAF8] text-gray-600 hover:bg-[#dfe2f3]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse">
              <thead>
                <tr className="bg-[#E6E6E6] text-left text-sm font-medium uppercase text-black">
                  <th className="px-12 py-4">Patient</th>
                  <th className="px-8 py-4">GPID</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Last Visit</th>
                  <th className="px-8 py-4">Condition</th>
                  <th className="px-8 py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} className="border-t border-gray-300">
                    <td className="px-12 py-8">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF0FF] font-medium text-[#211783]">
                          {patient.initials}
                        </div>
                        <span className="font-medium text-black">{patient.name}</span>
                      </div>
                    </td>

                    <td className="px-8 py-8 text-gray-500">{patient.gpid}</td>

                    <td className="px-8 py-8">
                      <ConsentStatusBadge status={patient.status} />
                    </td>

                    <td className="px-8 py-8 text-gray-500">{patient.lastVisit}</td>
                    <td className="px-8 py-8 text-gray-500">{patient.condition}</td>

                    <td className="px-8 py-8 text-center">
                      <button
                        onClick={() => onOpenPatient(patient)}
                        className="inline-flex text-[#211783] transition hover:translate-x-1"
                      >
                        <ArrowRight size={28} />
                      </button>
                    </td>
                  </tr>
                ))}

                {patients.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-8 py-12 text-center text-gray-500">
                      No patients found for this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}