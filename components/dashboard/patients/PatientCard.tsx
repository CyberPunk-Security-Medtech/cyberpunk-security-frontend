import { Patient } from "@/types/forms";

interface PatientCardProps {
    patient: Patient;
    onViewDetails: (patient: Patient) => void;
}

export default function PatientCard({ patient, onViewDetails }: PatientCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border p-5 space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-semibold text-lg">{patient.name}</h3>
                    <p className="text-sm gap-2 text-gray-500">
                        {patient.age} year old, {patient.gender}
                    </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs bg-green-50 text-green-600">
                    {patient.status}
                </span>
            </div>

            <div className="space-y-1 text-sm gap-2 text-gray-600">
                <p>📞 {patient.phone}</p>
                <p>📧 {patient.email}</p>
                <p>📍 {patient.address}</p>
                <p>📅 Last visit: {patient.lastVisit}</p>
            </div>

            <span className="inline-block bg-gray-100 gap-4 text-gray-700 text-xs px-3 py-1 rounded-full">
                {patient.condition}
            </span>

            <button
                onClick={() => onViewDetails(patient)}
                className="w-full border rounded-lg py-2 text-sm hover:bg-gray-50"
            >
                View Details
            </button>
        </div>
    );
}
