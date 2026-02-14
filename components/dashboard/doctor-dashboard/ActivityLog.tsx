const logs = [
    { who: 'Dr. Adeyemi', type: 'Medical Update', text: 'Added new condition "Hypertension"', time: '10 Oct 2025, 4:20 PM' },
    { who: 'Dr. Adeyemi', type: 'Lab Test', text: 'Lab test order "Complete Blood Count"', time: '10 Oct 2025, 4:20 PM' },
    { who: 'Nurse Amina', type: 'Vital', text: 'Nurse created "Vital"', time: '10 Oct 2025, 4:20 PM' }
]
export default function ActivityLogTab() {
    return (
        <section className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-brand-navy mb-6">Activity Log</h3>
            <ul className="space-y-4">
                {logs.map((l) => (
                    <li key={l.type + l.time} className="flex gap-4">
                        <div className="mt-1 h-2 w-2 rounded-full bg-brand-teal" />
                        <div className="flex-1 pb-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="font-medium text-brand-navy">{l.who}</span>
                                <span className="text-sm text-brand-navy">{l.type} -</span>
                                <span className="text-sm text-gray-600">{l.text}</span>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">{l.time}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    )
}