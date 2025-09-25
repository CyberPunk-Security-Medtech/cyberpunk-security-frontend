// import { Patient } from "@types/forms";

// interface PatientDetailsProps {
//     patient: Patient;
//     onClose: () => void;
// }

// export default function PatientDetails({ patient, onClose }: PatientDetailsProps) {
//     return (
//         <div className="bg-white rounded-xl shadow-lg p-6 space-y-6 max-w-2xl mx-auto">
//             <h2 className="text-xl font-semibold">{patient.name}</h2>
//             <p className="text-sm text-gray-500">Patient ID: {patient.id}</p>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="border rounded-lg p-4">
//                     <h3 className="font-medium mb-2">Personal Information</h3>
//                     <p><strong>Age:</strong> {patient.age}</p>
//                     <p><strong>Gender:</strong> {patient.gender}</p>
//                     <p><strong>Phone No:</strong> {patient.phone}</p>
//                     <p><strong>Email:</strong> {patient.email}</p>
//                     <p><strong>Address:</strong> {patient.address}</p>
//                 </div>

//                 <div className="border rounded-lg p-4">
//                     <h3 className="font-medium mb-2">Medical Information</h3>
//                     <p><strong>Condition:</strong> {patient.condition}</p>
//                     <p><strong>Last Visit:</strong> {patient.lastVisit}</p>
//                 </div>
//             </div>

//             <div className="flex gap-3">
//                 <button className="flex-1 border rounded-lg py-2">Edit Patient</button>
//                 <button className="flex-1 bg-indigo-700 text-white rounded-lg py-2">Schedule Appointment</button>
//             </div>
//         </div>
//     );
// }


"use client";

import Modal from "@components/Modal";
import { Patient } from "@/types/forms";

interface PatientDetailsProps {
    patient: Patient;
    onClose: () => void;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PatientDetails({ patient, onClose, open, setOpen }: PatientDetailsProps) {
    return (
        <Modal open={open} setOpen={setOpen}>
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-6 max-w-2xl w-full">
                <h2 className="text-xl font-semibold">{patient.name}</h2>
                <p className="text-sm text-gray-500">Patient ID: {patient.id}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4 space-y-2">
                        <h3 className="font-medium mb-2">Personal Information</h3>
                        <p><strong>Age:</strong> {patient.age}</p>
                        <p><strong>Gender:</strong> {patient.gender}</p>
                        <p><strong>Phone No:</strong> {patient.phone}</p>
                        <p><strong>Email:</strong> {patient.email}</p>
                        <p><strong>Address:</strong> {patient.address}</p>
                    </div>

                    <div className="border rounded-lg p-4 space-y-2">
                        <h3 className="font-medium mb-2">Medical Information</h3>
                        <p><strong>Condition:</strong> {patient.condition}</p>
                        <p><strong>Last Visit:</strong> {patient.lastVisit}</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="flex-1 border rounded-lg py-2">Edit Patient</button>
                    <button className="flex-1 bg-indigo-700 text-white rounded-lg py-2">
                        Schedule Appointment
                    </button>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="mt-4 px-4 py-2 bg-gray-200 rounded-lg"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
}
