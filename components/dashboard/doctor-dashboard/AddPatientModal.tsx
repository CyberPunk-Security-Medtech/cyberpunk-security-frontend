'use client';

import { useState } from "react";
import Modal from "@components/Modal"; 
import { PatientService } from "@services/api";

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export default function AddPatientModal({ isOpen, onClose}: AddPatientModalProps) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    dob: "",
    gender: "",
    marital_status: "",
    blood_group: "",
    email: "",
    phone_number: "",
    allergies: "",
    past_medical_history: "",
    family_medical_history: "",
    symptoms: "",
    current_medications: "",
    immunizations: "",
    lifestyle_info: "",
    enrollee_type: "",
    hmo_provider: "",
    hmo_plan: "",
    hmo_number: "",
    policy_start_date: "",
    policy_expiry_date: "",
  });

  // handle input changes
  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };



const handleSubmit = async () => {
  try {
    // get active workspace from localStorage
    const activeWorkspaceStr = localStorage.getItem("activeWorkspace");
    if (!activeWorkspaceStr) return console.error("No active workspace found");

    const activeWorkspace = JSON.parse(activeWorkspaceStr);
    const orgId = activeWorkspace.id; 

    // call the API to create a new patient
    const newPatient = await PatientService.createPatient(orgId, formData);
    console.log("Patient created:", newPatient);

    // close the modal
    onClose();

    // resets the form
    setFormData({
      first_name: "",
      last_name: "",
      dob: "",
      gender: "",
      marital_status: "",
      blood_group: "",
      email: "",
      phone_number: "",
      allergies: "",
      past_medical_history: "",
      family_medical_history: "",
      symptoms: "",
      current_medications: "",
      immunizations: "",
      lifestyle_info: "",
      enrollee_type: "",
      hmo_provider: "",
      hmo_plan: "",
      hmo_number: "",
      policy_start_date: "",
      policy_expiry_date: "",
    });
  } catch (error) {
    console.error("Failed to create patient:", error);
  }
};

  return (
    <>
      {/* <button
        className="bg-[#1A2380] text-white px-4 py-2 rounded-md"
        onClick={() => setIsOpen(true)}
      >
        Add Patient
      </button> */}

      <Modal
        title="Patient Details"
        isOpen={isOpen}
        onClose={onClose}
        className="w-full max-w-4xl"
      >
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="First Name"
              className="border rounded-md px-3 py-2 w-full"
            />
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Last Name"
              className="border rounded-md px-3 py-2 w-full"
            />
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 w-full"
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 w-full"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input
              type="text"
              name="marital_status"
              value={formData.marital_status}
              onChange={handleChange}
              placeholder="Marital Status"
              className="border rounded-md px-3 py-2 w-full"
            />
            <input
              type="text"
              name="blood_group"
              value={formData.blood_group}
              onChange={handleChange}
              placeholder="Blood Group"
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="border rounded-md px-3 py-2 w-full"
          />
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="Phone Number"
            className="border rounded-md px-3 py-2 w-full"
          />

          <textarea
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            placeholder="Allergies"
            className="border rounded-md px-3 py-2 w-full"
          />

          <textarea
            name="past_medical_history"
            value={formData.past_medical_history}
            onChange={handleChange}
            placeholder="Past Medical History"
            className="border rounded-md px-3 py-2 w-full"
          />

          <textarea
            name="family_medical_history"
            value={formData.family_medical_history}
            onChange={handleChange}
            placeholder="Family Medical History"
            className="border rounded-md px-3 py-2 w-full"
          />

          <textarea
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            placeholder="Symptoms"
            className="border rounded-md px-3 py-2 w-full"
          />

          <textarea
            name="current_medications"
            value={formData.current_medications}
            onChange={handleChange}
            placeholder="Current Medications"
            className="border rounded-md px-3 py-2 w-full"
          />

          <textarea
            name="immunizations"
            value={formData.immunizations}
            onChange={handleChange}
            placeholder="Immunizations"
            className="border rounded-md px-3 py-2 w-full"
          />

          <textarea
            name="lifestyle_info"
            value={formData.lifestyle_info}
            onChange={handleChange}
            placeholder="Lifestyle Information"
            className="border rounded-md px-3 py-2 w-full"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="enrollee_type"
              value={formData.enrollee_type}
              onChange={handleChange}
              placeholder="Enrollee Type"
              className="border rounded-md px-3 py-2 w-full"
            />
            <input
              type="text"
              name="hmo_provider"
              value={formData.hmo_provider}
              onChange={handleChange}
              placeholder="HMO Provider"
              className="border rounded-md px-3 py-2 w-full"
            />
            <input
              type="text"
              name="hmo_plan"
              value={formData.hmo_plan}
              onChange={handleChange}
              placeholder="HMO Plan"
              className="border rounded-md px-3 py-2 w-full"
            />
            <input
              type="text"
              name="hmo_number"
              value={formData.hmo_number}
              onChange={handleChange}
              placeholder="HMO Number"
              className="border rounded-md px-3 py-2 w-full"
            />
            <input
              type="date"
              name="policy_start_date"
              value={formData.policy_start_date}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 w-full"
            />
            <input
              type="date"
              name="policy_expiry_date"
              value={formData.policy_expiry_date}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="bg-[#1A2380] text-white px-4 py-2 rounded-md mt-4"
          >
            Submit
          </button>
        </form>
      </Modal>
    </>
  );
}