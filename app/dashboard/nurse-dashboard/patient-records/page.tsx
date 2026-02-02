'use client'

import React from 'react'
import { MoreHorizontal, ChevronLeft, ChevronRight, Search } from 'lucide-react'

// Strict Data matching the Screenshot requirements
const patients = [
    { initials: 'BH', name: 'Brandon Herwitz', id: 'SMC-04000B', age: 32, gender: 'Male', condition: 'Diabetes Type 2', status: 'Active', date: 'Oct-30-2025' },
    { initials: 'BH', name: 'Brandon Herwitz', id: 'SMC-04000B', age: 56, gender: 'Female', condition: 'Hypertension', status: 'Discharged', date: 'Oct-30-2025' },
    { initials: 'BH', name: 'Brandon Herwitz', id: 'SMC-04000B', age: 32, gender: 'Female', condition: 'Tuberculosis (TB)', status: 'Pending', date: 'Oct-30-2025' },
    { initials: 'BH', name: 'Brandon Herwitz', id: 'SMC-04000B', age: 56, gender: 'Female', condition: 'Hepatitis', status: 'Active', date: 'Oct-30-2025' },
    { initials: 'BH', name: 'Brandon Herwitz', id: 'SMC-04000B', age: 56, gender: 'Male', condition: 'Dehydration', status: 'Active', date: 'Oct-30-2025' },
    { initials: 'BH', name: 'Brandon Herwitz', id: 'SMC-04000B', age: 56, gender: 'Male', condition: 'Dehydration', status: 'Active', date: 'Oct-30-2025' },
    { initials: 'BH', name: 'Brandon Herwitz', id: 'SMC-04000B', age: 56, gender: 'Male', condition: 'Dehydration', status: 'Active', date: 'Oct-30-2025' },
    { initials: 'BH', name: 'Brandon Herwitz', id: 'SMC-04000B', age: 56, gender: 'Male', condition: 'Dehydration', status: 'Active', date: 'Oct-30-2025' },
    { initials: 'BH', name: 'Brandon Herwitz', id: 'SMC-04000B', age: 56, gender: 'Male', condition: 'Infertility', status: 'Discharged', date: 'Oct-30-2025' },
]

export default function PatientsRecords() {
    // Removed mounted check to allow server rendering


    return (
        // REMOVED ROOT PADDING: The layout already provides px-4 lg:px-12.
        // This prevents "double padding" indentation.
        <div className="w-full space-y-6 font-sans py-4">

            {/* Top Section: Title & Toolbar */}
            <div className="flex flex-col gap-6 mb-8 w-full">
                {/* Title Row - Left Aligned */}
                <h2 className="text-2xl font-bold text-black text-left">Patients Records</h2>

                {/* Search & Button Row - Justify Between */}
                <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4">
                    {/* Search Input - Far Left */}
                    <div className="relative w-full md:w-[350px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 color-[#9CA3AF]" />
                        <input
                            type="text"
                            placeholder="Search patient"
                            className="w-full h-[50px] pl-12 pr-4 rounded-[100px] bg-white border border-gray-100 text-sm text-gray-700 outline-none focus:ring-1 focus:ring-[#00B8A8] placeholder-gray-400"
                        />
                    </div>

                    {/* Add Patient Button - Far Right */}
                    <button
                        className="w-full md:w-auto bg-[rgba(0,184,168,0.9)] text-white font-medium px-6 h-[50px] rounded-[100px] hover:opacity-90 transition flex items-center justify-center gap-2 whitespace-nowrap text-sm bg-[#00B8A8]"
                    >
                        <span className="text-lg leading-none mb-[2px]">+</span> Add New Patient Record
                    </button>
                </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col mb-6 w-full">
                <span className="font-medium text-gray-400 text-sm mb-2">Filter:</span>
                <div className="flex flex-wrap items-center justify-between w-full gap-y-4">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        {/* Department Dropdown */}
                        <div className="relative">
                            <select className="appearance-none bg-[#F9FAFB] border border-gray-200 rounded-full px-4 py-2 pr-8 text-gray-600 outline-none cursor-pointer hover:border-gray-300">
                                <option>Department</option>
                                <option>Cardiology</option>
                                <option>Neurology</option>
                            </select>
                            <ChevronLeft className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 rotate-[-90deg] text-gray-400 pointer-events-none" />
                        </div>

                        {/* Last Visit Dropdown */}
                        <div className="relative">
                            <select className="appearance-none bg-[#F9FAFB] border border-gray-200 rounded-full px-4 py-2 pr-8 text-gray-600 outline-none cursor-pointer hover:border-gray-300">
                                <option>Last Visit</option>
                                <option>This Week</option>
                                <option>This Month</option>
                            </select>
                            <ChevronLeft className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 rotate-[-90deg] text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-0">
                        <div className="relative">
                            <select className="appearance-none bg-white border border-gray-100 rounded-md px-3 py-1 pr-6 text-gray-600 outline-none cursor-pointer">
                                <option>10</option>
                                <option>20</option>
                                <option>50</option>
                            </select>
                            <ChevronLeft className="w-2.5 h-2.5 absolute right-2 top-1/2 -translate-y-1/2 rotate-[-90deg] text-gray-400 pointer-events-none" />
                        </div>
                        <span>Entries per page</span>
                    </div>
                </div>
            </div>

            {/* Table Container - Aligned with Header */}
            <div className="w-full overflow-x-hidden">
                <div className="w-full max-w-[95%] mx-auto overflow-x-auto border border-gray-200 rounded-xl bg-white">
                    <table className="min-w-[1000px] w-full text-left whitespace-nowrap">
                        <thead>
                            <tr className="text-xs text-gray-400 border-b border-gray-100 bg-gray-50/50">
                                <th className="py-4 px-4 font-medium pl-6">Patient Name</th>
                                <th className="py-4 px-4 font-medium">Patient ID</th>
                                <th className="py-4 px-4 font-medium">Age</th>
                                <th className="py-4 px-4 font-medium">Gender</th>
                                <th className="py-4 px-4 font-medium">Condition</th>
                                <th className="py-4 px-4 font-medium">Status</th>
                                <th className="py-4 px-4 font-medium">Last Visit</th>
                                <th className="py-4 px-4 font-medium"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map((p, index) => (
                                <tr
                                    key={index}
                                    className="h-20 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#E0F2F1] text-[rgba(0,184,168,0.9)] flex items-center justify-center font-semibold text-sm">
                                                {p.initials}
                                            </div>
                                            <span className="font-semibold text-gray-900 text-[15px]">{p.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 text-gray-900 font-medium text-[15px]">{p.id}</td>
                                    <td className="px-4 text-gray-900 font-medium text-[15px]">{p.age}</td>
                                    <td className="px-4 text-gray-900 font-medium text-[15px]">{p.gender}</td>
                                    <td className="px-4 text-gray-900 font-medium text-[15px]">{p.condition}</td>
                                    <td className="px-4">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-semibold
                                            ${p.status === 'Active' ? 'bg-[#E0F2F1] text-[rgba(0,184,168,1)]' : ''}
                                            ${p.status === 'Discharged' ? 'bg-[#EDE7F6] text-[#673AB7]' : ''}
                                            ${p.status === 'Pending' ? 'bg-[#FFF8E1] text-[#FFA000]' : ''}
                                        `}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-4 text-gray-900 font-medium text-[15px]">{p.date}</td>
                                    <td className="px-4 text-gray-400">
                                        <button className="p-2 hover:bg-gray-100 rounded-full transition">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer - Centered with Table */}
                <div className="flex items-center justify-between mt-6 text-sm text-gray-400 w-full">
                    <span>Showing 1-9 from 15</span>
                    <div className="flex items-center gap-2">
                        <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50 text-gray-400">
                            <ChevronLeft size={16} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded bg-[#E8EAF6] text-[#1A2380] font-medium border border-[#E8EAF6]">
                            1
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-100 hover:bg-gray-50 text-gray-600 font-medium">
                            2
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50 text-gray-400">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
