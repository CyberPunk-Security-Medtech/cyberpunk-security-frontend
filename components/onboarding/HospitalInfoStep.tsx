"use client";

import { useState } from "react";

interface Props {
  onNext: (data: any) => void;
  defaultValues?: {
    name?: string;
    address?: string;
    type?: string;
  };
}

export default function HospitalInfoStep({ onNext, defaultValues }: Props) {
  const [name, setName] = useState(defaultValues?.name || "");
  const [address, setAddress] = useState(defaultValues?.address || "");
  const [type, setType] = useState(defaultValues?.type || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address || !type) {
      alert("Please fill all fields");
      return;
    }
    onNext({ name, address, type });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          Hospital Information
        </h2>
        <p className="text-gray-500 text-sm mt-1">Hospital setup</p>
      </div>

      {/* Fields */}
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Hospital Name
        </label>
        <input
          type="text"
          placeholder="Enter hospital name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Hospital Address
        </label>
        <input
          type="text"
          placeholder="Enter hospital address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Type of Hospital
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select hospital type</option>
          <option value="General">General</option>
          <option value="Specialist">Specialist</option>
          <option value="Clinic">Clinic</option>
          <option value="Teaching">Teaching</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full  bg-[#1A2380]  text-white py-3 rounded-xl font-medium"
      >
        Continue
      </button>
    </form>
  );
}
