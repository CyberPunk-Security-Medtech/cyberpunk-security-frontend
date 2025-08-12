import React from "react";

const ConsentManagementTab = () => {
    const consents = [
        {
            patient: "John Doe",
            action: "Granted data sharing consent",
            entity: "General Hospital B",
            duration: "48 hours",
            timestamp: "2024-01-15 14:30:22",
            status: "active",
        },
        {
            patient: "John Doe",
            action: "Revoked emergency access",
            entity: "Emergency Center",
            duration: "N/A",
            timestamp: "2024-01-15 14:30:22",
            status: "revoked",
        },
        {
            patient: "John Doe",
            action: "Extended sharing consent",
            entity: "Specialist Clinic",
            duration: "72 hours",
            timestamp: "2024-01-15 14:30:22",
            status: "active",
        },
    ];

    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-x-auto">
            <div className="p-4 border-b">
                <input
                    type="text"
                    placeholder="Search audit logs..."
                    className="border rounded-md px-3 py-2 text-sm w-full sm:w-64"
                />
            </div>
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-600 font-medium">
                    <tr>
                        <th className="py-3 px-4">Patient</th>
                        <th className="py-3 px-4">Action</th>
                        <th className="py-3 px-4">Hospital/Entity</th>
                        <th className="py-3 px-4">Duration</th>
                        <th className="py-3 px-4">Timestamp</th>
                        <th className="py-3 px-4">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {consents.map((item, idx) => (
                        <tr key={idx} className="border-t hover:bg-gray-50">
                            <td className="py-3 px-4">{item.patient}</td>
                            <td className="py-3 px-4">{item.action}</td>
                            <td className="py-3 px-4">{item.entity}</td>
                            <td className="py-3 px-4">{item.duration}</td>
                            <td className="py-3 px-4">{item.timestamp}</td>
                            <td className="py-3 px-4">
                                <span
                                    className={`px-2 py-1 rounded-full text-xs ${item.status === "active"
                                        ? "bg-green-100 text-black"
                                        : "bg-red-100 text-error"
                                        }`}
                                >
                                    {item.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ConsentManagementTab;
