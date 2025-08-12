import React from "react";

const AuditLogsTab = () => {
    const logs = [
        {
            user: "Dr. Sarah Johnson",
            action: "Viewed Patient Record",
            resource: "John Doe#1234",
            timestamp: "2024-01-15 14:30:22",
            ip: "193:185.1.100",
            device: "Desktop",
        },
        {
            user: "Dr. Sarah Johnson",
            action: "Viewed Patient Record",
            resource: "John Doe#1234",
            timestamp: "2024-01-15 14:30:22",
            ip: "193:185.1.100",
            device: "Desktop",
        },
        {
            user: "Dr. Sarah Johnson",
            action: "Viewed Patient Record",
            resource: "John Doe#1234",
            timestamp: "2024-01-15 14:30:22",
            ip: "193:185.1.100",
            device: "Desktop",
        },
        {
            user: "Dr. Sarah Johnson",
            action: "Viewed Patient Record",
            resource: "John Doe#1234",
            timestamp: "2024-01-15 14:30:22",
            ip: "193:185.1.100",
            device: "Desktop",
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
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-4">Action</th>
                        <th className="py-3 px-4">Patient/Resource</th>
                        <th className="py-3 px-4">Timestamp</th>
                        <th className="py-3 px-4">IP Address</th>
                        <th className="py-3 px-4">Device</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log, idx) => (
                        <tr key={idx} className="border-t hover:bg-gray-50">
                            <td className="py-3 px-4">{log.user}</td>
                            <td className="py-3 px-4">{log.action}</td>
                            <td className="py-3 px-4">{log.resource}</td>
                            <td className="py-3 px-4">{log.timestamp}</td>
                            <td className="py-3 px-4">{log.ip}</td>
                            <td className="py-3 px-4">
                                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">{log.device}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AuditLogsTab;
