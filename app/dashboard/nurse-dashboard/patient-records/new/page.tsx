"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AddNewPatientRecord() {
  return (
    <div className="w-full space-y-6 md:space-y-8 font-sans py-2 md:py-4">
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:relative">
        <Link
          href="/dashboard/nurse-dashboard/patient-records"
          className="inline-flex items-center gap-2 rounded-full bg-[#ECEEFD] text-[#1A2380] text-xs md:text-sm font-medium px-4 py-2 hover:bg-[#E0E4FA] transition"
        >
          <ChevronLeft size={16} />
          Back to Patients List
        </Link>
        <h2 className="text-sm md:text-base font-semibold text-gray-900 sm:absolute sm:left-1/2 sm:-translate-x-1/2">
          Add New Patient Record
        </h2>
        <div className="hidden sm:block w-[170px]" />
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm space-y-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wide text-[#1A2380] font-semibold">
              Step 1 of 3
            </p>
            <h3 className="text-sm md:text-base font-semibold text-gray-900">
              Personal Information
            </h3>
            <p className="text-xs text-gray-500">
              Basic demographic and contact data for patient creation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Patient ID</label>
              <input
                className="w-full h-10 rounded-full border border-gray-200 px-4 text-xs md:text-sm outline-none"
                defaultValue="SMC-04000B"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">First Name</label>
              <input
                className="w-full h-10 rounded-full border border-gray-200 px-4 text-xs md:text-sm outline-none"
                placeholder="Enter First Name"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Last Name</label>
              <input
                className="w-full h-10 rounded-full border border-gray-200 px-4 text-xs md:text-sm outline-none"
                placeholder="Enter Last Name"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-500">Date of Birth</label>
              <input
                className="w-full h-10 rounded-full border border-gray-200 px-4 text-xs md:text-sm outline-none"
                placeholder="dd/mm/yy"
              />
            </div>
            <div className="space-y-1 relative">
              <label className="text-xs text-gray-500">Gender</label>
              <select className="w-full h-10 rounded-full border border-gray-200 px-4 pr-10 text-xs md:text-sm text-gray-400 outline-none appearance-none">
                <option>Select Gender</option>
              </select>
              <ChevronRight className="w-4 h-4 absolute right-4 top-9 -translate-y-1/2 rotate-[-90deg] text-gray-400 pointer-events-none" />
            </div>
            <div className="space-y-1 relative">
              <label className="text-xs text-gray-500">Marital Status</label>
              <select className="w-full h-10 rounded-full border border-gray-200 px-4 pr-10 text-xs md:text-sm text-gray-400 outline-none appearance-none">
                <option>Select Marital Status</option>
              </select>
              <ChevronRight className="w-4 h-4 absolute right-4 top-9 -translate-y-1/2 rotate-[-90deg] text-gray-400 pointer-events-none" />
            </div>

            <div className="space-y-1 relative">
              <label className="text-xs text-gray-500">Blood Group</label>
              <select className="w-full h-10 rounded-full border border-gray-200 px-4 pr-10 text-xs md:text-sm text-gray-400 outline-none appearance-none">
                <option>Select Blood Group</option>
              </select>
              <ChevronRight className="w-4 h-4 absolute right-4 top-9 -translate-y-1/2 rotate-[-90deg] text-gray-400 pointer-events-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Email Address</label>
              <input
                className="w-full h-10 rounded-full border border-gray-200 px-4 text-xs md:text-sm outline-none"
                placeholder="Enter Email Address"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Phone Number</label>
              <input
                className="w-full h-10 rounded-full border border-gray-200 px-4 text-xs md:text-sm outline-none"
                placeholder="+234 -"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wide text-[#1A2380] font-semibold">
              Step 2 of 3
            </p>
            <h3 className="text-sm md:text-base font-semibold text-gray-900">
              Medical Information
            </h3>
            <p className="text-xs text-gray-500">
              Basic demographic and contact data for patient creation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Allergies</label>
              <textarea
                className="w-full min-h-[80px] rounded-xl border border-gray-200 px-4 py-3 text-xs md:text-sm outline-none resize-none"
                placeholder="Enter Allergies"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Past Medical History</label>
              <textarea
                className="w-full min-h-[80px] rounded-xl border border-gray-200 px-4 py-3 text-xs md:text-sm outline-none resize-none"
                placeholder="Enter Past Medical History"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Family Medical History</label>
              <textarea
                className="w-full min-h-[80px] rounded-xl border border-gray-200 px-4 py-3 text-xs md:text-sm outline-none resize-none"
                placeholder="Enter Family Medical History"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">
                Symptoms / Observations
              </label>
              <textarea
                className="w-full min-h-[80px] rounded-xl border border-gray-200 px-4 py-3 text-xs md:text-sm outline-none resize-none"
                placeholder="Enter Symptoms / Observations"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Current Medications</label>
              <textarea
                className="w-full min-h-[80px] rounded-xl border border-gray-200 px-4 py-3 text-xs md:text-sm outline-none resize-none"
                placeholder="Enter Current Medications"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Immunizations</label>
              <textarea
                className="w-full min-h-[80px] rounded-xl border border-gray-200 px-4 py-3 text-xs md:text-sm outline-none resize-none"
                placeholder="Enter Immunizations"
              />
            </div>
            <div className="space-y-1 lg:col-span-2">
              <label className="text-xs text-gray-500">Lifestyle Info</label>
              <textarea
                className="w-full min-h-[80px] rounded-xl border border-gray-200 px-4 py-3 text-xs md:text-sm outline-none resize-none"
                placeholder="Non-smoker, occasional alcohol..."
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wide text-[#1A2380] font-semibold">
              Step 3 of 3
            </p>
            <h3 className="text-sm md:text-base font-semibold text-gray-900">
              HMO & Emergency Information
            </h3>
            <p className="text-xs text-gray-500">
              This new section collects insurance details and emergency contact
              together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1 relative">
              <label className="text-xs text-gray-500">Enrollee Type</label>
              <select className="w-full h-10 rounded-full border border-gray-200 px-4 pr-10 text-xs md:text-sm text-gray-400 outline-none appearance-none">
                <option>Select Enrollee Type</option>
              </select>
              <ChevronRight className="w-4 h-4 absolute right-4 top-9 -translate-y-1/2 rotate-[-90deg] text-gray-400 pointer-events-none" />
            </div>
            <div className="space-y-1 relative">
              <label className="text-xs text-gray-500">HMO Provider</label>
              <select className="w-full h-10 rounded-full border border-gray-200 px-4 pr-10 text-xs md:text-sm text-gray-400 outline-none appearance-none">
                <option>Select HMO Provider</option>
              </select>
              <ChevronRight className="w-4 h-4 absolute right-4 top-9 -translate-y-1/2 rotate-[-90deg] text-gray-400 pointer-events-none" />
            </div>
            <div className="space-y-1 relative">
              <label className="text-xs text-gray-500">HMO Plan / Coverage</label>
              <select className="w-full h-10 rounded-full border border-gray-200 px-4 pr-10 text-xs md:text-sm text-gray-400 outline-none appearance-none">
                <option>Select Plan</option>
              </select>
              <ChevronRight className="w-4 h-4 absolute right-4 top-9 -translate-y-1/2 rotate-[-90deg] text-gray-400 pointer-events-none" />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-500">
                HMO ID / Enrollee Number
              </label>
              <input
                className="w-full h-10 rounded-full border border-gray-200 px-4 text-xs md:text-sm outline-none"
                placeholder="Enter HMO ID / Enrollee Number"
              />
            </div>
            <div className="space-y-1 relative">
              <label className="text-xs text-gray-500">Policy Start Date</label>
              <select className="w-full h-10 rounded-full border border-gray-200 px-4 pr-10 text-xs md:text-sm text-gray-400 outline-none appearance-none">
                <option>Select Date</option>
              </select>
              <ChevronRight className="w-4 h-4 absolute right-4 top-9 -translate-y-1/2 rotate-[-90deg] text-gray-400 pointer-events-none" />
            </div>
            <div className="space-y-1 relative">
              <label className="text-xs text-gray-500">Policy Expiry Date</label>
              <select className="w-full h-10 rounded-full border border-gray-200 px-4 pr-10 text-xs md:text-sm text-gray-400 outline-none appearance-none">
                <option>Select Date</option>
              </select>
              <ChevronRight className="w-4 h-4 absolute right-4 top-9 -translate-y-1/2 rotate-[-90deg] text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button className="rounded-full border border-gray-200 px-4 py-2 text-xs md:text-sm text-gray-600 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button className="rounded-full bg-[#1A2380] text-white px-4 py-2 text-xs md:text-sm font-medium hover:bg-[#111B66] transition">
              Create patient records
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
