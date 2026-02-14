'use client'

import { Patient } from "../../types/index";
import { StatusBadge } from "../StatusBadge";

interface PatientTableProps {
    data: Patient[];
    onRowClick?: (id: string) => void;
    isLoading?: boolean;
}

export default function PatientTable({ data, onRowClick }: PatientTableProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 overflow-x-auto">
            {/* Desktop Table View */}
            <table className="w-full text-sm text-left border-collapse hidden md:table">
                <thead className="text-gray-600 border-b bg-gray-50">
                    <tr>
                        <th className="py-3 px-4 font-medium">Patient Name</th>
                        <th className="py-3 px-4 font-medium">Patient ID</th>
                        <th className="py-3 px-4 font-medium">Age</th>
                        <th className="py-3 px-4 font-medium">Gender</th>
                        <th className="py-3 px-4 font-medium">Condition</th>
                        <th className="py-3 px-4 font-medium">Status</th>
                        <th className="py-3 px-4 font-medium">Last Visit</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((p, index) => (
                        <tr
                            key={`${p.name}-${p.id}-${p.condition}-${index}`}
                            className="border-b hover:bg-gray-50 cursor-pointer"
                            onClick={() => onRowClick && onRowClick(p.id)}
                        >
                            <td className="py-3 px-4 flex items-center gap-3 font-medium text-[#1A2380]">
                                <div className="h-8 w-8 rounded-full bg-[#E6F8F7] text-[#00B8A8] flex items-center justify-center font-semibold text-xs">
                                    {p.initials}
                                </div>
                                {p.name}
                            </td>
                            <td className="px-4">{p.id}</td>
                            <td className="px-4">{p.age}</td>
                            <td className="px-4">{p.gender}</td>
                            <td className="px-4">{p.condition}</td>
                            <td className="px-4">
                                <StatusBadge status={p.status} />
                            </td>
                            <td className="px-4 text-gray-500">{p.date}</td>
                            <td className="px-4 text-right text-gray-400">⋯</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col gap-4">
                {data.map((p, index) => (
                    <div
                        key={`${p.name}-${p.id}-${p.condition}-mobile-${index}`}
                        className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer"
                        onClick={() => onRowClick && onRowClick(p.id)}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-[#E6F8F7] text-[#00B8A8] flex items-center justify-center font-semibold text-xs">
                                    {p.initials}
                                </div>
                                <div>
                                    <h3 className="font-medium text-[#1A2380] text-sm">{p.name}</h3>
                                    <p className="text-xs text-gray-500">{p.id}</p>
                                </div>
                            </div>
                            <button className="text-gray-400">⋯</button>
                        </div>

                        <div className="grid grid-cols-2 gap-y-2 text-xs">
                            <div>
                                <span className="text-gray-500">Age:</span> <span className="text-gray-700">{p.age}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Gender:</span> <span className="text-gray-700">{p.gender}</span>
                            </div>
                            <div className="col-span-2">
                                <span className="text-gray-500">Condition:</span> <span className="text-gray-700">{p.condition}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Last Visit:</span> <span className="text-gray-700">{p.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500">Status:</span>
                                <StatusBadge status={p.status} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Placeholder - can be componentized later */}
            <div className="flex items-center justify-between text-xs text-gray-500 mt-4">
                <span>Showing 1–{Math.min(data.length, 9)} from {data.length}</span>
                <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded border border-gray-200 hover:bg-gray-100">‹</button>
                    <span className="px-3 py-1.5 rounded bg-[#1A2380] text-white">1</span>
                    <span className="px-3 py-1.5 rounded hover:bg-gray-100 cursor-pointer">2</span>
                    <button className="p-1.5 rounded border border-gray-200 hover:bg-gray-100">›</button>
                </div>
            </div>
        </div>
    )
}
